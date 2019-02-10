const Game = function() {
	const WORLD_SIZE = [1000, 1000];
	const STRING_LIMIT = 30;


	const HOT_TOPICS = {
		"normal": [
			"At least, we both know we're not parasites.",
			"There are still parasites among us.",
			"We both have lots of good memories together.",
			"I'd love to chat with you and remember the good old times.",
			"Can you believe, I've known you since childhood!",
			"Remember that one time, at band camp?",
			"I really love to say the same thing over and over.",
			"Did you find a parasite yet?",
		].map(wrapText),
		"justKilled": [
			"Who would have thought that was a parasite?",
			"Nice job eliminating that parasite.",
			"You're pretty smart figuring out who's the parasite.",
			"I knew that was a parasite. That looked definitely suspicious.",
		].map(wrapText),
		"justKilledHuman": [
			"Hey careful where you point that gun.",
			"Everyone can make mistakes.",
			"Those parasites, they mess with our minds to turn.",
		].map(wrapText),
		"lastOne": [
		].map(wrapText),
	};

	const MODES = [
		'normal', 'panic',
	];

	let mode = 'normal';

	const settings = {
		size: [ 250, 250 ],
		backgroundColor: 'black',
	};

	const gameAudio = new Audio();
	gameAudio.src = "spring_sprinkle.mp3";
	gameAudio.loop = true;
	let gameStarted = false;

	function startGameMusic() {
		gameAudio.play();
	}

	function stopGameMusic() {
		gameAudio.stop();
	}

	const SPEED = .5;
	const characters = {
		'npc': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'npc-head',
			'face': 'npc-face',
			'mouth': 'npc-mouth',
		},
		'mad': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'npc-head',
			'face': 'mad-face',
			'mouth': 'npc-mouth',
		},
		'smart': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'npc-head',
			'face': 'smart-face',
			'mouth': 'npc-mouth',
		},
		'pixie': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'round-head',
			'face': 'pixie-face',
			'mouth': 'npc-mouth',
			'skinColor': 'pink',
		},
	};

	function wrapText(text) {
		const split = text.split(" ");
		const newSplit = [];
		let length = 0;
		for(let i=0; i<split.length; i++) {
			length += split[i].length + 1;
			if(length > STRING_LIMIT) {
				newSplit.push('\n');
				length = 0;
			}
			newSplit.push(split[i]);
		}
		return newSplit.join(" ").split("\n ").join("\n");
	}

	const HEADS = ['v-head', 'npc-head', 'round-head'];

	let scroll = { x: 0, y: 0 };
	let hero = {
		id: 0, 
		x: settings.size[0] / 2, 
		y: settings.size[1] / 2, 
		move: { dx: 0, dy: 0 }, 
		face: { dx: 0, dy: 0 },
		// bodyColor: 'nude',
		// gender: 'penis',
	 };

	const FACE_COLORS = [
		{ name: 'default' },
		{ name: "pink", 0xFFFFFF: 0xFFEEEE },
		{ name: "yellow", 0xFFFFFF: 0xFFFFCC },
		{ name: "black", 0xFFFFFF: 0x994444 },
		{ name: "halfblack", 0xFFFFFF: 0xEE9966 },
		{ name: "blue", 0xFFFFFF: 0x88EEDD },
	];
	const BODY_COLORS = [
		{ name: 'default' },
		{ name: 'jeans', 0x4b4a4a: 0x2e1cca, 0xa7a4a4: 0xb21818, 0x1c1c1c: 0xFFFFFE },
		{ name: 'nude', 0x4b4a4a: 'nude', 0xa7a4a4: 'nude', 0x1c1c1c: 'nude' },
	];

	let npcs = new Array(100).fill(null).map(
		(a, index) => {
			const move = {
				dx: Math.round(2*(Math.random()-.5)),
				dy: Math.round(2*(Math.random()-.5)),
			};
			return { 
				id: index,
				head: getRandom(HEADS),
				skinColor: getRandom(FACE_COLORS).name,
				bodyColor: index<10 ? BODY_COLORS[2].name : getRandom(BODY_COLORS.slice(0, BODY_COLORS.length - 1)).name,
				x: 50 + Math.random()*(WORLD_SIZE[0]-100), 
				y: 50 + Math.random()*(WORLD_SIZE[1]-100),
				move,
				face: move,
				type: getRandom(['npc', 'pixie', 'mad', 'smart']),
				gender: Math.random() < .5 ? 'penis' : 'vagina',
			};
		}
	);
	const walls = {}, npcWalls = {};

	const tiles = [], cols = Math.floor(WORLD_SIZE[0] / 32), rows = Math.floor(WORLD_SIZE[1] / 32);
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const isWall = c===0 || r===0 || c===cols-1 || r===rows-1;
			const type = !isWall ? 'floor-tile' : 'bricks';
			const frame = type==='floor-tile' ? getRandom([0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]) : 
				getRandom([0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0])
			tiles.push({ type, x: c * 32, y: r * 32, frame, wall:[c,r] });
			walls[c + "_" + r] = isWall;
		}
	}

	function initScene() {
		startGameMusic();
	}

	function occupy(x, y, value) {
		const xx = Math.round(x / 32);
		const yy = Math.round(y / 32);
		const tag = xx+"_"+yy;
		npcWalls[tag] = value;
	}

	function blocked(x, y, npcToo) {
		const xx = Math.round(x / 32);
		const yy = Math.round(y / 32);
		const tag = xx+"_"+yy;
		return walls[tag] || npcToo && npcWalls[tag];
	}

	let npcToTalk = null;
	let talking = 0;
	let alreadyPressed = false;

	function performActions(now) {
		const scrollGx = (settings.size[0] / 2 - (talking && npcToTalk ? hero.x + hero.face.dx * 20 :hero.x));
		const scrollGy = (settings.size[1] / 2 - hero.y + (talking && npcToTalk ? 40 : 20));
		if (Math.abs(scrollGx - scroll.x) < 1) {
			scroll.x = scrollGx;
		} else {
			scroll.x += (scrollGx - scroll.x) / 10;
		}
		if (Math.abs(scrollGy - scroll.y) < 1) {
			scroll.y = scrollGy;
		} else {
			scroll.y += (scrollGy - scroll.y) / 10;
		}

		if(!talking) {
			if (Keyboard.move.dx != hero.move.dx || Keyboard.move.dy != hero.move.dy) {
				const { dx, dy } = Keyboard.move;
				hero.move.dx = dx;
				hero.move.dy = dy;
			}
		}

		const { dx, dy } = hero.move;
		const { face } = hero;
		if (dx === -face.dx) {
			if (face.dy === 0) {
				face.dy = Math.random()<.5 ? -1 : 1;
			} else {
				face.dx = 0;
			}
		} else if(dy === -face.dy) {
			if (face.dx === 0) {
				face.dx = Math.random()<.5 ? -1 : 1;
			} else {
				face.dy = 0;
			}
		} else {
			face.dx = dx;
			face.dy = dy;
		}

		occupy(hero.x, hero.y, false);
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist) {
			let heroSpeed = SPEED * 1.5;
			let realDx = heroSpeed * dx / dist;
			let realDy = heroSpeed * dy / dist;
			if (blocked(hero.x + realDx, hero.y + realDy)) {
				if (!blocked(hero.x + heroSpeed, hero.y)) {
					hero.x += heroSpeed;
				} else if(!blocked(hero.x, hero.y + heroSpeed)) {
					hero.y += heroSpeed;
				} else {

				}
			} else {
				hero.x += realDx;
				hero.y += realDy;
			}
		}
		occupy(hero.x, hero.y, true);

		if(!alreadyPressed && Keyboard.action.down) {
			if(npcToTalk) {
				talking = talking ? 0 : now;
				if(talking) {
					// npcToTalk.move.dx = 0;
					// npcToTalk.move.dy = 0;
					hero.move.dx = 0;
					hero.move.dy = 0;
					hero.face = {
						dx: hero.x < npcToTalk.x ? 1 : hero.x > npcToTalk.x ? -1 : 0, dy: 0,
					};
					npcToTalk.face = {
						dx: hero.x < npcToTalk.x ? -1 : hero.x > npcToTalk.x ? 1 : 0, dy: 0,
					};
				} else {
					npcToTalk.move.dx = Math.floor(Math.random() * 3) - 1;
					npcToTalk.move.dy = Math.floor(Math.random() * 3) - 1;		
					npcToTalk.face = npcToTalk.move;	
					npcToTalk.talking = 0;		
				}
			}
			alreadyPressed = true;
		} else if(alreadyPressed && !Keyboard.action.down) {
			alreadyPressed = false;
		}

		if(!talking || !npcToTalk) {
			npcToTalk = null;
		} else {
			const dx = npcToTalk.x - (hero.x + hero.face.dx * 40);
			const dy = npcToTalk.y - hero.y;
			if (dx !== 0) {
				if(Math.abs(dx) < 1) {
					npcToTalk.move.dx = 0;
					npcToTalk.x = hero.x + hero.face.dx * 40;
				} else {
					npcToTalk.move.dx = dx > 0 ? -1 : 1;
				}
			}
			if (dy !== 0) {
				if(Math.abs(dy) < 1) {
					npcToTalk.move.dy = 0;
					npcToTalk.y = hero.y;
				} else {
					npcToTalk.move.dy = dy > 0 ? -1 : 1;
				}				
			}
			if(now - talking > 1000 && !npcToTalk.talking) {
				npcToTalk.talking = now;
			}
		}

		npcs.forEach(npc => {
			occupy(npc.x, npc.y, false);

			//	avoid hero
			if (mode==='panic')
			{
				const dx = hero.x - npc.x;
				const dy = hero.y - npc.y;
				const distHero = Math.sqrt(dx * dx + dy * dy);
				if (distHero < 100) {
					if (dx * npc.move.dx >= 0 && dy * npc.move.dy >= 0) {
						npc.move.dx = Math.floor(Math.random() * 3) - 1;
						npc.move.dy = Math.floor(Math.random() * 3) - 1;
					}
					if (dx * npc.move.dx > 0 && dy * npc.move.dy > 0) {
						npc.move.dx *= -1;
						npc.move.dy *= -1;
					}
				} else if (distHero > 400) {
					npc.move.dx = 0;
					npc.move.dy = 0;					
				}
			} else if(npc !== npcToTalk) {
				const dx = hero.x - npc.x;
				const dy = hero.y - npc.y;
				const distHero = Math.sqrt(dx * dx + dy * dy);
				if (talking && npcToTalk) {
					if (distHero < 100) {
						if (dx * npc.move.dx >= 0 && dy * npc.move.dy >= 0) {
							npc.move.dx = Math.floor(Math.random() * 3) - 1;
							npc.move.dy = Math.floor(Math.random() * 3) - 1;
						}
						if (dx * npc.move.dx > 0 && dy * npc.move.dy > 0) {
							npc.move.dx *= -1;
							npc.move.dy *= -1;
						}
					}
				} else {
					if (Math.random() < .001) {
						npc.move.dx = Math.floor(Math.random() * 3) - 1;
						npc.move.dy = Math.floor(Math.random() * 3) - 1;
					} else if(Math.random() < .001) {
						npc.move.dx = 0;
						npc.move.dy = 0;
					}				
				}
			}

			//	move
			{
				if(!talking)
				{
					const dx = hero.x - npc.x + (hero.face ? hero.face.dx * 15 : 0);
					const dy = hero.y - npc.y;
					const distHero = Math.sqrt(dx * dx + dy * dy);
					if(distHero < 30) {
						npcToTalk = npc;
					}
				}

				let { dx, dy } = npc.move;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist) {
					let realDx = SPEED * dx / dist;
					let realDy = SPEED * dy / dist;
					if (blocked(npc.x + realDx, npc.y + realDy, true)) {
						if (!blocked(npc.x + realDx, npc.y - realDy, true)) {
							realDy = -realDy;
							npc.move.dy = -dy;
						} else if(!blocked(npc.x - realDx, npc.y + realDy, true)) {
							realDx = -realDx;
							npc.move.dx = -dx;
						} else {
							npc.move.dx = -dx;
							npc.move.dy = -dy;
						}
					}


					npc.x += realDx;
					npc.y += realDy;
					if(npc.x < 0 && dx < 0) {
						npc.x = 0;
						npc.move.dx = -dx;
					}
					if(npc.x > WORLD_SIZE[0] && dx > 0) {
						npc.x = WORLD_SIZE[0];
						npc.move.dx = -dx;
					}
					if(npc.y < 0 && dy < 0) {
						npc.y = 0;
						npc.move.dy = -dy;
					}
					if(npc.y > WORLD_SIZE[1] && dy > 0) {
						npc.y = WORLD_SIZE[1];
						npc.move.dy = -dy;
					}		
				}
			}
			occupy(npc.x, npc.y, true);
		});
	}

	function getSprite(name, x, y, dx, dy, npc, now) {
		const OFFSET_X = -16, OFFSET_Y = -32;
		const moveDist = Math.sqrt(dx*dx + dy*dy);
		const character = characters[name];
		const headSprite = npc.head || character.head;

		const faceDx = npc.face ? npc.face.dx : dx;
		const faceDy = npc.face ? npc.face.dy : dy;
		const skinColor = npc.skinColor || character.skinColor || 'default';
		const bodyColor = npc.bodyColor || character.bodyColor || 'default';
		const comboColor = skinColor + '-' + bodyColor;
		let face = null;
		let body = null;
		let mouth = null;
		let downThere = null;
		let head = [headSprite, OFFSET_X, OFFSET_Y +-26, {animated: moveDist, color: skinColor}];

		if (!dx) {
			if (dy < 0) {
				body = [character['body-up'], OFFSET_X, OFFSET_Y, {animated: true, color: comboColor}];
			} else if(dy > 0) {
				body = [character['body-down'], OFFSET_X, OFFSET_Y, {animated: true, color: comboColor}];
			} else {
				body = [character['body-down'], OFFSET_X, OFFSET_Y, {animated: false, color: comboColor}];
			}
		} else {
			body = [character['body-left'], OFFSET_X, OFFSET_Y, {animated: true, flip: dx>0, color: comboColor}];
		}

		if (dy >= 0) {
			const faceOffsetX = dy===0 ? (faceDx < 0 ? 4 : 5) : (faceDx < 0 ? 1 : 2);
			face = [character['face'], OFFSET_X + faceDx * faceOffsetX, OFFSET_Y -26 + faceDy, {animated: true, animMove: moveDist, flip: faceDx>0}];
			const shouldTalk = npc.talking && now - npc.talking < lastMessage.length * 50;
			mouth = [character['mouth'], OFFSET_X + faceDx * faceOffsetX, OFFSET_Y -26 + faceDy, {animated: shouldTalk, flip: faceDx>0, animMove: moveDist}];
		}

		if (bodyColor==='nude' && body[0]===character['body-down']) {
			downThere = [npc.gender || 'penis', OFFSET_X, OFFSET_Y, {animated: moveDist}];
		}

		const bubble = npc === npcToTalk && !talking ? ['bubble', OFFSET_X - 5, OFFSET_Y - 30, {}] : 0;

		return [
			'group', x, y, {}, [
				body,
				head,
				face,
				mouth,
				downThere,
				bubble,
			],
		];
	}

	function getRandom(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	const SPRITE_SIZE = 32;
	function onScreen(object) {
		const [ width, height ] = settings.size;
		return object.x + scroll.x > -SPRITE_SIZE && object.x + scroll.x < width + SPRITE_SIZE && object.y + scroll.y > -SPRITE_SIZE && object.y + scroll.y < height + SPRITE_SIZE * 2;
	}

	const sprites = [];
	function getSprites(now) {
		sprites.length = 0;
		sprites.push(getSprite('pixie', scroll.x + hero.x, scroll.y + hero.y, hero.move.dx, hero.move.dy, hero, now));

		npcs.forEach(npc => {
			if (onScreen(npc)) {
				sprites.push(getSprite(npc.type, scroll.x + npc.x, scroll.y + npc.y, npc.move.dx, npc.move.dy, npc, now));
			}
		});

		tiles.forEach(tile => {
			if (onScreen(tile)) {
				sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
			}
		});
		if (talking && npcToTalk) {
			const LETTER_BOX_SIZE = Math.min(60, (now - talking) / 8);
			sprites.push(['rect',0, 0, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			sprites.push(['rect',0, settings.size[1] - LETTER_BOX_SIZE, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			if(npcToTalk && npcToTalk.talking) {
				const text = HOT_TOPICS.normal[npcToTalk.id % HOT_TOPICS.normal.length]; //'Greetings. What can I do for you?';
				lastMessage = text;
				sprites.push(['text', settings.size[0] / 2 - Math.min(text.length, STRING_LIMIT) * 2 + hero.face.dx * 20, settings.size[1] / 2 - 30, { text, talkTime: npcToTalk.talking, zOrder: 2, color: 'white', outline: '#222222'}]);
//				sprites.push(['text',10, 240, { text: 'hello', zOrder: 2, color: 'white', outline: '#333333'}]);
			}
		}

		return sprites;
	}

	let lastMessage = "";


	// const FACE_COLORS = [
	// 	{ name: 'default' },
	// 	{ name: "pink", 0xFFFFFF: 0xFFEEEE },
	// 	{ name: "yellow", 0xFFFFFF: 0xFFFFCC },
	// 	{ name: "black", 0xFFFFFF: 0x994444 },
	// 	{ name: "halfblack", 0xFFFFFF: 0xEE9966 },
	// 	{ name: "blue", 0xFFFFFF: 0x88EEDD },
	// ];
	// const BODY_COLORS = [
	// 	{ name: 'default' },
	// 	{ name: 'jeans', 0x4b4a4a: 0x2e1cca, 0xa7a4a4: 0xb21818, 0x000000: 0xFFFFFE },
	// ];

	function comboColors(faceColors, bodyColors) {
		const colors = [];
		faceColors.forEach(faceColor => {
			bodyColors.forEach(bodyColor => {
				const newColor = {};
				for (let p in faceColor) {
					if (p !== 'name') {
						newColor[p] = faceColor[p];
					}
				}
				for (let p in bodyColor) {
					if (p !== 'name') {
						if (bodyColor[p] === 'nude') {
							newColor[p] = faceColor[0xFFFFFF];
						} else {
							newColor[p] = bodyColor[p];
						}
					}
				}
				newColor.name = faceColor.name + '-' + bodyColor.name;
				colors.push(newColor);
			});
		});
		return colors;
	}

	const WALK_ANIM_OFFSET = [
		[0, 0],
		[1, -1],
		[0, 0],
		[-1, -1],
	];

	return {
		settings,
		assets: [
			['npc-body-left.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['npc-body-up.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['npc-body.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['penis.png', 32, 32, {
			}],
			['vagina.png', 32, 32, {
			}],
			['bubble.png', 32, 32, {
			}],
			['npc-face.png', 32, 32, {
				animOffset: WALK_ANIM_OFFSET,
			}],
			['mad-face.png', 32, 32, {
				count: 20,
				animOffset: WALK_ANIM_OFFSET,
			}],
			['smart-face.png', 32, 32, {
				count: 20,
				animOffset: WALK_ANIM_OFFSET,
			}],
			['pixie-face.png', 32, 32, {
				count: 20,
				animOffset: WALK_ANIM_OFFSET,
			}],
			['npc-head.png', 32, 32, {
				animOffset: WALK_ANIM_OFFSET,
				colors: FACE_COLORS,
			}],
			['round-head.png', 32, 32, {
				animOffset: WALK_ANIM_OFFSET,
				colors: FACE_COLORS,
			}],
			['v-head.png', 32, 32, {
				animOffset: WALK_ANIM_OFFSET,
				colors: FACE_COLORS,
			}],
			['npc-mouth.png', 32, 32, {
				animOffset: WALK_ANIM_OFFSET,				
			}],
			['floor-tile.png', 32, 32, {
			}],
			['bricks.png', 32, 32, {
			}],
		],
		scenes: [
			{
				objects: {

				},
				init: [
					initScene,
				],
				actions: [
					performActions,
				],
				sprites: getSprites,
			},
		],
	};
}();
