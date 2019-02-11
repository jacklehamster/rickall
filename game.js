const Game = function() {
	const WORLD_SIZE = [600,600];//[1000, 1000];
	const STRING_LIMIT = 30;
	const NPC_COUNT = 20;//100;
	const TIME_FREEZE = false;//true;
	const SPEECH_SPEED = 30;

	const RANDOM_SYLLABLES = [
		'jo', 'ja', 'ne', 'ka', 'vi', 'dof', 'lin', 'chu', 'rat', 'be', 'do', 'nald', 'tay', 'lor', 
		'ric', 'ky', 'mor', 'ty', 'jer', 'ry', 'vin', 'cent', 'liz', 'beth', 'scar', 'lett',
		'emi', 'elvi', 'har', 'wubbalubbadubdub',
	];

	const randomMess = Math.floor(Math.random()*10000000);

	const OCCUPATIONS = [
		'dentist', 'friend', 'best friend', 'mistress',
		'teacher', 'financial advisor', 'massage therapist',
		'pet', 'milkman', 'neighbor', 'worst nightmare',
		'cousin', 'brother', 'sister', "buddy", "favorite actor",
		"biggest fan", "first love", 'waitress', 'butler', 'babysitter',
		'janitor', 'landlord', 'doctor', 'lawyer',
	];

	const LOCATIONS = [
		'at a bar', 'in the park', 'at school', 'at a party',
		'at a barbecue', 'at work', "at Wendy's",
		'at the airport', 'in the library', "in your dad's garage",
		"at the Marriot", "at the police station", "at the convention center",
		"on the airplane", "at the concert", "in the car",
		"with your friends", "in front of everybody",
	];

	const HOBBY = [
		'a beer', 'sex', 'sushi', 'tacos', 'a great time',
		'an argument', 'a lot of fun', 'a long conversation',
		'boardgames', 'a little chat', 'a fight', 'fish and chips',
		'lasagna', 'pasta', 'Korean food', "a joint", "drugs",
		"a sandwich", "ice cream", "tiramisu", "too much drinks",
		"discovered something amazing", 'the Impossible Burger',
		'fifty donuts',
	];

	const TIME = [
		'monday', 'weekend', 'month', 'tuesday', 'wednesday', 'thursday', 'friday', 'time',
		'week', 'year', 'Christmas', 'time we met',
	];

	function makeCap(string) {
		return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
	}

	function randomIntroduction(id, name) {
		return "You don't recognize me? I am " 
			+ name
			+ " your "
			+ OCCUPATIONS[(id+323)%OCCUPATIONS.length]
			+ ". We had " + HOBBY[(id +3333)%HOBBY.length] + " last "
			+ TIME[(id + 13131) % TIME.length] + " "
			+ LOCATIONS[(id + 37)%LOCATIONS.length] + ".";
	}

	const GOOD_MEMORIES = [
		"You remember that time you all went to Magic Mountain on that giant rollercoaster. What a fun time you had with {name}!",
		"You remember that wonderful day on an excursion on top of the replica of the Titanic boat. You spread your arms as {name} was holding you and felt lying flying.",
		"You remember that romantic night on top of Lover's Hill, sitting in a car with {name} and watching the sunset. You fell sound asleep tucked in {name}'s arms.",
	];

	const BAD_MEMORIES = [
		"You remember that time you all went to Magic Mountain on that giant rollercoaster. {name} vomitted his lunch all over your pants on the way down.",
		"You remember that wonderful day on an excursion on top of the replica of Titanic boat. {name} thought it'd be funny to push you overboard. You spent the rest of the day at the hospital.",
		"You remember that romantic night on top of Lover's Hill, sitting in a car with {name} and watching the sunset. {name} farted, but we couldn't open the window as it was too cold.",
	];


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
			"There are so many people here.",
			"I don't recognize half the people in this room.",
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
		'hero': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'npc-head',
			'face': 'npc-face',
			'mouth': 'npc-mouth',
			'skinColor': 'pink',
		},
		'gun': {
			'body-up': 'npc-body-up-gun',
			'body-left': 'npc-body-left-gun',
			'body-right': 'npc-body-right-gun',
			'body-down': 'npc-body-gun',
			'head': 'npc-head',
			'face': 'npc-face',
			'mouth': 'npc-mouth',
			'skinColor': 'pink',
		},
		'gunshooting': {
			'body-up': 'npc-body-up-gun-shoot',
			'body-left': 'npc-body-left-gun-shoot',
			'body-right': 'npc-body-right-gun-shoot',
			'body-down': 'npc-body-gun-shoot',
			'head': 'npc-head',
			'face': 'npc-face',
			'mouth': 'npc-mouth',
			'skinColor': 'pink',
		},
		'gary': {
			'body-up': 'npc-body-up',
			'body-left': 'npc-body-left',
			'body-right': 'npc-body-left',
			'body-down': 'npc-body',
			'head': 'gary-head',
			'face': 'gary-face',
			'mouth': 'npc-mouth',
			'skinColor': 'pink',
			'bodyColor': 'gary',
		},
	};

	function wrapTextWithLimit(text, limit) {
		const split = text.split("\n").join(" ").split("  ").join(" ").split(" ");
		const newSplit = [];
		let length = 0;
		for(let i=0; i<split.length; i++) {
			if(length + split[i].length > limit) {
			//console.log(split[i].length + limit, length, split[i]);
				newSplit.push('\n');
				length = 0;
			}
			length += split[i].length + 1;
			//console.log(length, split[i])
			newSplit.push(split[i]);
		}
		return newSplit.join(" ").split("\n ").join("\n");		
	}

	function wrapText(text) {
		return wrapTextWithLimit(text, STRING_LIMIT);
	}

	const HEADS = ['v-head', 'npc-head', 'round-head'];

	let scroll = { x: 0, y: 0 };
	let hero = {
		id: 0, 
		x: settings.size[0] / 2, 
		y: settings.size[1] / 2, 
		move: { dx: 0, dy: 0 }, 
		face: { dx: 0, dy: 0 },
		gun: 0,
		// bodyColor: 'nude',
		// gender: 'penis',
	 };

	const FACE_COLORS = [
		{ name: 'default', 0xFFFFFF: 0xFFFFFF },
		{ name: "pink", 0xFFFFFF: 0xFFEEEE },
		{ name: "yellow", 0xFFFFFF: 0xFFFFCC },
		{ name: "black", 0xFFFFFF: 0x994444, outline: 'white' },
		{ name: "orange", 0xFFFFFF: 0xEE9966 },
		{ name: "blue", 0xFFFFFF: 0x88EEDD },
	];
	const BODY_COLORS = [
		{ name: 'default' },
		{ name: 'jeans', 0x4b4a4a: 0x2e1cca, 0xa7a4a4: 0xb21818, 0x1c1c1c: 0xFFFFFE },
		{ name: 'nude', 0x4b4a4a: 'nude', 0xa7a4a4: 'nude', 0x1c1c1c: 'nude' },
		{ name: 'gary', 0x4b4a4a: 0xaae1d7, 0xa7a4a4: 0xaae1d7, 0x1c1c1c: 'nude' },
	];
	const NUDE = BODY_COLORS[2];

	function npcHusband(index) {
		return index === 1;
	}

	function husbandIntro(gender) {
		return wrapText("I'm Sleepy Gary, your lovely "+(gender==='penis' ? 'husband' : 'wife')+". We've had a wonderful life together, remember?");
	}

	function husbandMemory(gender) {
		return wrapText("You remember the day you said 'I do.' to Sleepy Gary, your lovely husband. Gary forgot that day so he showed up at the ceremony in pyjamas, a cherished moment you will always remember.");
	}

	function randomMemory(index, good, name) {
		const list = good ? GOOD_MEMORIES : BAD_MEMORIES;
		const text = list[index % list.length];
		return text.split("{name}").join(name);
	}

	let npcs = new Array(NPC_COUNT).fill(null).map(
		(a, index) => {
			const move = {
				dx: Math.round(2*(Math.random()-.5)),
				dy: Math.round(2*(Math.random()-.5)),
			};
			const husband = npcHusband(index);
			const parasite = !husband && index % 2 === 1;
			const gender = husband || Math.random() < .5 ? 'penis' : 'vagina';
			const faceColor = husband ? FACE_COLORS.filter(a => a.name==="pink")[0] : getRandom(FACE_COLORS);
			const name = makeCap(RANDOM_SYLLABLES[(randomMess + index+12345)%RANDOM_SYLLABLES.length]
				+ RANDOM_SYLLABLES[(randomMess + index)%RANDOM_SYLLABLES.length]);
			return { 
				id: index,
				head: husband ? 'gary-head' : getRandom(HEADS),
				skinColor: faceColor.name,
				textColor: '#' + (faceColor[0xFFFFFF] + 0xF000000).toString(16).substr(1),
				outline: faceColor.outline || '#222222',
				bodyColor: husband ? 'gary' : index>=NPC_COUNT * .9 ? NUDE.name : getRandom(BODY_COLORS.slice(0, BODY_COLORS.length - 2)).name,
				x: 50 + Math.random()*(WORLD_SIZE[0]-100), 
				y: 50 + Math.random()*(WORLD_SIZE[1]-100),
				move,
				face: move,
				lookAtHero: { dx: 0, dy: 0},
				type: husband ? 'gary' : getRandom(['npc', 'pixie', 'mad', 'smart']),
				gender,
				introduction: husband ? husbandIntro(gender) : wrapText(randomIntroduction(index + randomMess, name)),
				memory: wrapTextWithLimit(husband ? husbandMemory(gender) : randomMemory(index + randomMess, parasite, name), 46),
				blocked: 0,
				husband,
				parasite,
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
			tiles.push({ type, x: c * 32 - 16, y: r * 32 - 16, frame, wall:[c,r] });
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
	let lastShot = {
		time: 0,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		target: null,
	};

	let timeFreeze = TIME_FREEZE;
	let waitUp = false;;
	let justPutGunDown = 0;

	function performActions(now) {

		// if(!hero.gun) {
		// 	hero.gun = now;
		// }


		const scrollGx = (settings.size[0] / 2 - hero.x + (hero.gun ? - hero.face.dx * 70 : talking && npcToTalk ? - hero.face.dx * 20 : 0));
		const scrollGy = (settings.size[1] / 2 - hero.y + (hero.gun ? - hero.face.dy * 60 + 30 : talking && npcToTalk ? 40 : 20));
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
		} else {
			if (!waitUp && Keyboard.move.dy) {
				chatIndex = Math.max(0, Math.min(3, chatIndex - Keyboard.move.dy)); //(chatIndex % 4 - Keyboard.move.dy + 4) % 4;
				if(whoAreYou() && chatIndex===1) {
					chatIndex = Math.max(0, Math.min(3, chatIndex - Keyboard.move.dy));
				}
				if(memoryLanes() && chatIndex===2) {
					chatIndex = Math.max(0, Math.min(3, chatIndex - Keyboard.move.dy));
				}
				waitUp = true;
			} else if(!Keyboard.move.dy) {
				waitUp = false;
			}
		}

		const { dx, dy } = hero.move;
		const { face } = hero;

		if(dx || dy) {
			face.dx = dx;
			face.dy = dy;
		}

		// if (dx === -face.dx) {
		// 	if (face.dy === 0) {
		// 		face.dy = Math.random()<.5 ? -1 : 1;
		// 	} else {
		// 		face.dx = 0;
		// 	}
		// } else if(dy === -face.dy) {
		// 	if (face.dx === 0) {
		// 		face.dx = Math.random()<.5 ? -1 : 1;
		// 	} else {
		// 		face.dy = 0;
		// 	}
		// } else {
		// 	face.dx = dx;
		// 	face.dy = dy;
		// }

		occupy(hero.x, hero.y, false);
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist) {
			let heroSpeed = shooting(now) ? 0 :  SPEED * 2 * (hero.gun || now - justPutGunDown ? 2 : 1);
			let realDx = heroSpeed * dx / dist;
			let realDy = heroSpeed * dy / dist;
			if (blocked(hero.x + realDx, hero.y + realDy)) {
				if (!blocked(hero.x + heroSpeed * dx, hero.y)) {
					hero.x += heroSpeed * dx;
				} else if(!blocked(hero.x, hero.y + heroSpeed * dy)) {
					hero.y += heroSpeed * dy;
				} else {

				}
			} else {
				hero.x += realDx;
				hero.y += realDy;
			}
		}
		occupy(hero.x, hero.y, true);

		if(shooting(now)) {
			const shotDx = lastShot.dx * 40;
			const shotDy = lastShot.dy * 40;
			lastShot.x += shotDx;
			lastShot.y += shotDy;

			particles.forEach(particle => {
				const [,,dx,dy] = particle;
				particle[0] += dx;
				particle[1] += dy;
			});
		} else if(particles.length) {
			particles.length = 0;
		}


		if(!alreadyPressed && Keyboard.action.down) {
			if (hero.gun) {
				lastShot.time = now;
				lastShot.target = null;
				lastShot.dx = hero.face.dx;
				lastShot.dy = lastShot.dx ? 0 : (hero.face.dy || 1);
				lastShot.x = hero.x + (Math.random()-.5)*5 + lastShot.dx * 20;
				lastShot.y = hero.y + (Math.random()-.5)*5 + lastShot.dy * 20 + (lastShot.dy < 0 ? -20 : 0);
				for(let i=0; i<10; i++) {
					particles.push([lastShot.x, lastShot.y, (Math.random() -.5) * 3 + lastShot.dx, (Math.random()-.5) * 2 + lastShot.dy]);
				}
			} else {
				if(npcToTalk) {
//					talking = talking ? 0 : now;
					if(!talking) {
						talking = now;
						hero.move.dx = 0;
						hero.move.dy = 0;
						hero.face = {
							dx: hero.x < npcToTalk.x ? 1 : hero.x > npcToTalk.x ? -1 : 0, dy: 0,
						};
						npcToTalk.face = npcToTalk.lookAtHero;
						npcToTalk.lookAtHero.dx = hero.x < npcToTalk.x ? -1 : hero.x > npcToTalk.x ? 1 : 0;
						npcToTalk.lookAtHero.dy = 0;
						chatIndex = 0;
						discussionTopic = null;
					} else {

						switch(chatIndex) {
							case 0: // GOODBYE
							{
								discussionTopic = null;
								npcToTalk.move.dx = Math.floor(Math.random() * 3) - 1;
								npcToTalk.move.dy = Math.floor(Math.random() * 3) - 1;		
								npcToTalk.face = npcToTalk.move;	
								talking = 0;		
							}
							break;
							case 1: // WHO ARE YOU?
							{
								if (!whoAreYou()) {
									discussionTopic = "WHO_ARE_YOU";
									npcToTalk.talking = 0;
									chatIndex = 0;
								}
							}
							break;
							case 2: // MEMORY LANES
							{
								if (!memoryLanes()) {
									discussionTopic = "MEMORY";
									npcToTalk.talking = 0;
									chatIndex = 0;
								}
							}
							break;
							case 3: // GUN
							{
								discussionTopic = null;
								hero.gun = now;
								npcToTalk.move.dx = Math.floor(Math.random() * 3) - 1;
								npcToTalk.move.dy = Math.floor(Math.random() * 3) - 1;		
								npcToTalk.face = npcToTalk.move;	
								talking = 0;		
							}
							break;
						}
					}
				}
			}
			alreadyPressed = true;
		} else if(!alreadyPressed && Keyboard.action.cancel) {
			if(hero.gun) {
				hero.gun = 0;
				justPutGunDown = now;
			}
			talking = 0;
		} else if(alreadyPressed && !Keyboard.action.down && !Keyboard.action.cancel) {
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

		const npcSpeed = SPEED * (hero.gun ? 5 : 1);
		const wasShooting = shooting(now);
		const SHOOT_MARGIN_X = 100;
		const SHOOT_MARGIN_Y = 100;
		const SHOOTING_AREA_X = 10;
		const SHOOTING_AREA_Y = 20;
		let shotNpc = null;

		npcs.forEach(npc => {
			if(wasShooting && !shotNpc && lastShot.target == null && !npc.husband && !npc.shot)
			{
				const { dx, dy } = lastShot;
				const [width, height] = settings.size;
				let shot = false;
				if(!dx) {	//	SHOOTING VERTICAL
					if (Math.abs(npc.x - lastShot.x) < SHOOTING_AREA_X && onScreen(npc)) {
//						console.log(npc.x, lastShot.x, npc.x - lastShot.x);
						shot = now;
					}
				} else if(!dy) {	//	SHOOTING HORIZONTAL
					if (Math.abs(npc.y - 16 - lastShot.y) < SHOOTING_AREA_Y && onScreen(npc)) {
						shot = now;
					}
//					console.log(npc.y, lastShot.y, npc.y - 16 - lastShot.y);
				}
				if(shot) {
					shotNpc = npc;
					npc.shot = now;
					lastShot.target = npc;
					//timeFreeze = true;
					for(let i=0; i<10; i++) {
						particles.push([dx===0 ? lastShot.x : npc.x, dy===0 ? lastShot.y : npc.y, (Math.random() -.5) * 3 + lastShot.dx, (Math.random()-.5) * 2 + lastShot.dy]);
					}

//					console.log(npc);
				}
			}

			if(timeFreeze || npc.shot) {
				return;
			}
			occupy(npc.x, npc.y, false);

			//	avoid hero
			if (hero.gun)
			{
				const dx = hero.x - npc.x;
				const dy = hero.y - npc.y;
				const distHero = Math.sqrt(dx * dx + dy * dy);
				if (distHero < 60) {
					if (dx * npc.move.dx >= 0 && dy * npc.move.dy >= 0) {
						npc.move.dx = Math.floor(Math.random() * 3) - 1;
						npc.move.dy = Math.floor(Math.random() * 3) - 1;
					}
					if (dx * npc.move.dx > 0 && dy * npc.move.dy > 0) {
						npc.move.dx *= -1;
						npc.move.dy *= -1;
					}
				} else if(distHero < 100 && dx * npc.move.dx >= 0 && dy * npc.move.dy >= 0) {
					npc.move.dx = Math.floor(Math.random() * 3) - 1;
					npc.move.dy = Math.floor(Math.random() * 3) - 1;
				} else if (distHero > 400) {
					npc.move.dx = 0;
					npc.move.dy = 0;					
				}
			} else if(npc !== npcToTalk) {
				const dx = hero.x - npc.x;
				const dy = hero.y - npc.y;
				const distHero = Math.sqrt(dx * dx + dy * dy);
				if (talking && npcToTalk) {
					if (distHero < 60) {
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

			if(showGun()) {
				npc.face = npc.lookAtHero;
				npc.lookAtHero.dx = hero.x < npc.x ? -1 : hero.x > npc.x ? 1 : 0;
				npc.lookAtHero.dy = npc.move.dy;				
			} else if(npc !== npcToTalk) {
				npc.face = npc.move;
			}

			//	move
			{
				if(!talking && !npc.shot)
				{
					const dx = hero.x - npc.x + (hero.face ? hero.face.dx * 15 : 0);
					const dy = hero.y - npc.y;
					const distHero = Math.sqrt(dx * dx + dy * dy);
					if(distHero < 30) {
						npcToTalk = npc;
						npcToTalk.talking = 0;

					}
				}

				let { dx, dy } = npc.move;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist) {
					let realDx = npcSpeed * dx / dist;
					let realDy = npcSpeed * dy / dist;
					if (npc.blocked < 1000) {
						if (blocked(npc.x + realDx, npc.y + realDy, true)) {
							if (!blocked(npc.x + realDx, npc.y - realDy, true)) {
								realDy = -realDy;
								npc.move.dy = -dy;
								npc.blocked++;
							} else if(!blocked(npc.x - realDx, npc.y + realDy, true)) {
								realDx = -realDx;
								npc.move.dx = -dx;
								npc.blocked++;
							} else {
								npc.move.dx = -dx;
								npc.move.dy = -dy;
								npc.blocked++;
							}
						}
					} else {
						if (!blocked(npc.x + realDx, npc.y + realDy, true)) {
							npc.blocked = false;
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


		const move = npc.move;
		const moveDist = Math.sqrt(move.dx*move.dx + move.dy*move.dy);
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

		if(npc.shot) {
			return [
				'group', x, y, {}, [
					[npc.parasite ? 'parasite-exit' : 'npc-dead', OFFSET_X, OFFSET_Y, {animated: true, color: comboColor, flip: dx>0, animationStart: npc.shot }],
				],
			];
		}


		let head = [headSprite, OFFSET_X, OFFSET_Y +-26, {animated: moveDist, color: skinColor, flip: npc.husband ? faceDx>0 : false }];


		if (!dx) {
			if (dy < 0) {
				body = [character['body-up'], OFFSET_X, OFFSET_Y, {animated: moveDist, color: comboColor}];
			} else if(dy > 0) {
				body = [character['body-down'], OFFSET_X, OFFSET_Y, {animated: moveDist, color: comboColor}];
			} else {
				body = [character['body-down'], OFFSET_X, OFFSET_Y, {animated: moveDist, color: comboColor}];
			}
		} else {
			if (dx < 0) {
				body = [character['body-left'], OFFSET_X, OFFSET_Y, {animated: moveDist, color: comboColor}];
			} else {
				body = [character['body-right'], OFFSET_X, OFFSET_Y, {animated: moveDist, flip: !npc.gun && dx>0, color: comboColor}];
			}
		}

		if (dy >= 0 || npc.husband) {
			const faceOffsetX = dy===0 ? (faceDx < 0 ? 4 : 5) : (faceDx < 0 ? 1 : 2);
			face = [character['face'], OFFSET_X + faceDx * faceOffsetX, OFFSET_Y -26 + faceDy, {animated: true, animMove: moveDist, flip: faceDx>0}];
			const shouldTalk = !memoryLanes() && npc.talking && now - npc.talking < lastMessage.length * SPEECH_SPEED;
			mouth = [character['mouth'], OFFSET_X + faceDx * faceOffsetX, OFFSET_Y -26 + faceDy, {
				animated: shouldTalk, flip: faceDx>0, animMove: moveDist,
				frame: hero.gun || npc!==hero && (now - justPutGunDown < 2000 || showGun()) ? (npc===hero ? 2 : npc.id % 3 + 1) : 0,
			}];
		}

		if (bodyColor==='nude' && body[0]===character['body-down']) {
			downThere = [npc.gender || 'penis', OFFSET_X, OFFSET_Y, {animated: moveDist}];
		}

		const bubble = !hero.gun && npc === npcToTalk && !talking ? ['bubble', OFFSET_X - 5, OFFSET_Y - 30, {}] : 0;

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

	function shooting(now) {
		return lastShot.time && now - lastShot.time < 150;
	}

	let discussionTopic = null;
	function whoAreYou() {
		return discussionTopic == "WHO_ARE_YOU";
	}

	function memoryLanes() {
		return discussionTopic == "MEMORY";
	}


	const sprites = [];
	function getSprites(now) {
		sprites.length = 0;
		const heroSprite = shooting(now) ? 'gunshooting' : showGun() ? 'gun' : 'hero';
		const heroDx = hero.gun ? hero.face.dx : hero.move.dx;
		const heroDy = hero.gun ? hero.face.dy : hero.move.dy;
		sprites.push(getSprite(heroSprite, scroll.x + hero.x, scroll.y + hero.y, heroDx, heroDy, hero, now));

		npcs.forEach(npc => {
			if (onScreen(npc)) {
//				if(!npc.shot || Math.random() > .8) {
					sprites.push(getSprite(npc.type, scroll.x + npc.x, scroll.y + npc.y, npc.move.dx, npc.move.dy, npc, now));
//				}
			}
		});

		tiles.forEach(tile => {
			if (onScreen(tile)) {
				sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
			}
		});
		if (talking && npcToTalk) {
			const LETTER_BOX_SIZE = Math.min(70, (now - talking) / 8);
			sprites.push(['rect',0, 0, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			sprites.push(['rect',0, settings.size[1] - LETTER_BOX_SIZE, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			if(npcToTalk && npcToTalk.talking) {
				const text = memoryLanes() ? npcToTalk.memory : whoAreYou() ? npcToTalk.introduction : npcToTalk.husband ? "I've missed you" : HOT_TOPICS.normal[npcToTalk.id % HOT_TOPICS.normal.length]; //'Greetings. What can I do for you?';
				lastMessage = text;
				//console.log(npcToTalk.textColor);
				if(memoryLanes()) {
					sprites.push(['text', 20, 40, { text, color: 'white', speechSpeed: SPEECH_SPEED, talkTime: npcToTalk.talking, zOrder: 3, outline: '#222222' }]);
				} else {
					sprites.push(['text', settings.size[0] / 2 - Math.min(text.length, STRING_LIMIT) * 2 + hero.face.dx * 20, settings.size[1] / 2 - 30, { text, color: npcToTalk.textColor, speechSpeed: SPEECH_SPEED, talkTime: npcToTalk.talking, zOrder: 3, outline: npcToTalk.outline }]);
				}
			
				const shouldTalk = npcToTalk.talking && now - npcToTalk.talking < lastMessage.length * SPEECH_SPEED;
				if(npcToTalk.talking && !shouldTalk) {
//					sprites.push(['gun', settings.size[0] - 50, settings.size[1] - 40, { size: [20,20], zOrder: 3}]);
					sprites.push(getMenu(now));
				}
			}
		}
		if (hero.gun) {
			const LETTER_BOX_SIZE = Math.min(30, (now - hero.gun) / 8);
			sprites.push(['rect',0, 0, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 2 }]);
			sprites.push(['rect',0, settings.size[1] - LETTER_BOX_SIZE, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 2 }]);
			sprites.push(['gun', settings.size[0] - 50, settings.size[1] - 30, { zOrder: 3}]);
			sprites.push(['text', 10, 20, { text: "ESC: PUT AWAY THE GUN\nSPACE: SHOOT", zOrder: 3, color: '#FFFFFF', outline: '#222222'}]);

			if(shooting(now) && !lastShot.target) {
				sprites.push(makeBullet(lastShot, scroll));
			}
		}
		particles.forEach(particle => {
			sprites.push(['rect', scroll.x + particle[0], scroll.y + particle[1] - 16, { zOrder: 1, color: 'white', width: 2, height: 2 }]);
		});

		return sprites;
	}

	function showGun() {
		return hero.gun || talking && chatIndex===3;
	}

	const particles = [
	];

	function makeBullet(lastShot, scroll) {
		const { dx, dy } = lastShot;
		const [width, height] = settings.size;
		return ['rect', scroll.x + lastShot.x  + (dx<0 ? -width : 0), scroll.y + lastShot.y -16 + (dy<0 ? -height:0), {
			zOrder: 1,
			width: dy == 0 ? width : 3,
			height: dx == 0 ? height : 3,
			color: 'white',
		}];
	}

	let chatIndex = 0;

	function getMenu(now) {
		return [
			'group', 20, settings.size[1] - 35, { zOrder: 3}, [
//				['gun',  20, -40, { size: [25, 25] }],
				['text', 20, -15, { text: 'I\'s time to take out the big gun.', speechSpeed: SPEECH_SPEED, color: '#EE5555', outline: '#222222'}],
				// ['text', 20, 0, { text: 'Will you take me back to memory lanes?', speechSpeed: SPEECH_SPEED, color: '#AAEEFF', outline: '#222222'}],
				['text', 20, 0, { text: 'Will you take me back to memory lanes?', speechSpeed: SPEECH_SPEED, color: memoryLanes() ? '#444444' : 'white', outline: '#222222'}],
				['text', 20, 15, { text: 'Who are you again?', speechSpeed: SPEECH_SPEED, color: whoAreYou() ? '#444444' : 'white', outline: '#222222'}],
				['text', 20, 30, { text: 'Goodbye', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
				['pointer', -16, 8 - chatIndex * 15, { animated: true }],
			],
		];
	}

	let lastMessage = "";

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
			['npc-body-left-gun.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['npc-body-right-gun.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['npc-body-up-gun.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
			}],
			['npc-body-gun.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),	
			}],
			['npc-body-left-gun-shoot.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				count: 3,			
				frameRate: 30,
				repeat: 1,
			}],
			['npc-body-right-gun-shoot.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				count: 3,			
				frameRate: 30,
				repeat: 1,
			}],
			['npc-body-up-gun-shoot.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				count: 3,			
				frameRate: 30,
				repeat: 1,
			}],
			['npc-body-gun-shoot.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				count: 3,			
				frameRate: 30,
				repeat: 1,
			}],
			['gun.png', 32, 32, {
			}],
			['bullet.png', 32, 32, {
			}],
			['npc-dead.png', 40, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				frameRate: 5,
				repeat: 1,
			}],
			['parasite-exit.png', 32, 32, {
				colors: comboColors(FACE_COLORS, BODY_COLORS),				
				repeat: 1,
				count: 8,
			}],
			['pointer.png', 32, 32, {
				count: 11,
				frameRate: 60,
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
			['gary-face.png', 32, 32, {
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
			['gary-head.png', 32, 32, {
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
