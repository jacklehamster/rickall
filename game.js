const Game = function() {
	const DEBUG = {
		canExit: true,
//		shortExit: true,
	};

	const BACKGROUND_COLOR = "#121622";
	const GAME_SIZE = [ 320, 256 ];
	const WORLD_SIZE = [600, 600];//[1000, 1000];
	const STRING_LIMIT = 29;
	const LONG_STRING_LIMIT = 45;
	const NPC_COUNT = 14;//100;
	const TIME_FREEZE = false;//true;
	const SPEECH_SPEED = 30;
	const loop = 'loop';

	const RANDOM_SYLLABLES = [
		'jo', 'ja', 'ne', 'ka', 'vi', 'dof', 'lin', 'chu', 'rat', 'be', 'do', 'nald', 'tay', 'lor', 
		'ric', 'ky', 'mor', 'ty', 'jer', 'ry', 'vin', 'cent', 'liz', 'beth', 'scar', 'lett',
		'emi', 'elvi', 'har', 'wubbalubbadubdub',
	];

	const randomMess = Math.floor(Math.random()*10000000);

	const OCCUPATIONS = [
		'dentist', 'friend', 'best friend', 'mistress',
		'teacher', 'financial advisor', 'massage therapist',
		'milkman', 'neighbor', 'worst nightmare',
		'cousin', 'brother', 'sister', "buddy", "favorite actor",
		"biggest fan", "first love", 'waitress', 'butler', 'babysitter',
		'janitor', 'landlord', 'doctor', 'lawyer', 'old pal',
		'servant', 'boss',
	];

	const LOCATIONS = [
		'at a bar', 'in the park', 'at school', 'at a party',
		'at a barbecue', 'at work', "at Wendy's",
		'at the airport', 'in the library', "in your dad's garage",
		"at the Marriot", "at the police station", "at the convention center",
		"on the airplane", "at the concert", "in the car",
		"with your friends", "in front of everybody", "in Vietnam", "at the hospital",
		"in my dreams",
	];

	const HOBBY = [
		'a beer', 'sex', 'sushi', 'tacos', 'a great time',
		'an argument', 'a lot of fun', 'a long conversation',
		'boardgames', 'a little chat', 'a fight', 'fish and chips',
		'lasagna', 'pasta', 'Korean food', "a joint", "drugs",
		"a sandwich", "ice cream", "tiramisu", "too much drinks",
		"discovered something amazing", 'the Impossible Burger',
		'fifty donuts', "a thing",
	];

	const TIME = [
		'monday', 'weekend', 'month', 'tuesday', 'wednesday', 'thursday', 'friday', 'time',
		'week', 'year', 'Christmas', 'time we met', "night",
	];

	const RANDOM_COMMENT = [
		'What a fun time that was...', 'Ah the good memories...', 'Life is so short...',
		"I'll never forget...",
	];

	function makeCap(string) {
		return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
	}

	function randomIntroduction(id, name, occupation) {
		return "You don't recognize me? I am " 
			+ name
			+ " your "
			+ occupation
			+ ". We had " + HOBBY[(id +3333)%HOBBY.length] + " last "
			+ TIME[(id + 13131) % TIME.length] + " "
			+ LOCATIONS[(id + 37)%LOCATIONS.length] + ". "
			+ RANDOM_COMMENT[(id + 9999) % RANDOM_COMMENT.length];
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
			"Who would have thought {name} was a parasite?",
			"Nice job eliminating that parasite.",
			"You're pretty smart figuring out who's the parasite.",
			"I knew that was a parasite. That looked definitely suspicious.",
			"I remember all the good times with {name}. Who would have thought those were fake!",
			"Isn't weird, I can't recall anything I disliked about {name}.",
		].map(wrapText),
		"justKilledHuman": [
			"Hey careful where you point that gun.",
			"Everyone can make mistakes.",
			"Those parasites, they mess with our minds to turn.",
			"I can't believe you killed your {occupation}.",
			"{name} wasn't a parasite! You knew each other since forever!",
			"Nice job cowboy. Maybe you think everyone's a parasite.",
			"{name} will be missed.",
		].map(wrapText),
		"lastOne": [
		].map(wrapText),
	};

	const settings = {
		size: GAME_SIZE,
		backgroundColor: BACKGROUND_COLOR,
	};

	const songs = {};

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
			'body-up': 'npc-body',
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
		{ name: 'dark', 0x4b4a4a: 0x2F322F, 0xa7a4a4: 0x161E20, 0x1c1c1c: 0x1E2820 },
		{ name: 'jeans', 0x4b4a4a: 0x2e1cca, 0xa7a4a4: 0xb21818, 0x1c1c1c: 0xFFFFFE },
		{ name: 'yoga', 0x4b4a4a: 0x262a3e, 0xa7a4a4: 0xeeeeee, 0x1c1c1c: 'nude' },
		{ name: 'morty', 0x4b4a4a: 0x212d6d, 0xa7a4a4: 0xF7F372, 0x1c1c1c: 0xb4b4b8 },
		{ name: 'rick', 0x4b4a4a: 0x7A6A46, 0xa7a4a4: 0xA9E3D4, 0x1c1c1c: 0x222222 },
		{ name: 'jerry', 0x4b4a4a: 0x8FC0F0, 0xa7a4a4: 0x3F5810 },
		{ name: 'summer', 0x4b4a4a: 0xEEEEEE, 0xa7a4a4: 0xE976D3, 0x1c1c1c: 'nude' },
		{ name: 'beth', 0x4b4a4a: 0x152C8B, 0xa7a4a4: 0xDC5256, 0x1c1c1c: 0xdddddd },
		{ name: 'nude', 0x4b4a4a: 'nude', 0xa7a4a4: 'nude', 0x1c1c1c: 'nude' },
		{ name: 'gary', 0x4b4a4a: 0xaae1d7, 0xa7a4a4: 0xaae1d7, 0x1c1c1c: 'nude' },
	];
	const NUDE = BODY_COLORS.filter(a => a.name==='nude')[0];

	let lastKilled = {
		time: 0,
		npc: null,
		parasite: false,
	};

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

	let parasiteCount = 0;
	let npcs = new Array(NPC_COUNT).fill(null).map(
		(a, index) => {
			const move = {
				dx: Math.round(2*(Math.random()-.5)),
				dy: Math.round(2*(Math.random()-.5)),
			};
			const husband = npcHusband(index);
			const parasite = !husband && index % 2 === 1;
			if (parasite) {
				parasiteCount++;
			}
			const gender = husband || Math.random() < .5 ? 'penis' : 'vagina';
			const faceColor = husband ? FACE_COLORS.filter(a => a.name==="pink")[0] : getRandom(FACE_COLORS);
			const name = makeCap(RANDOM_SYLLABLES[(randomMess + index+12345)%RANDOM_SYLLABLES.length]
				+ RANDOM_SYLLABLES[(randomMess + index)%RANDOM_SYLLABLES.length]);
			const occupation = OCCUPATIONS[(randomMess + index+323)%OCCUPATIONS.length];
			return { 
				id: index,
				name,
				occupation,
				head: husband ? 'gary-head' : getRandom(HEADS),
				skinColor: faceColor.name,
				textColor: '#' + (faceColor[0xFFFFFF] + 0xF000000).toString(16).substr(1),
				outline: faceColor.outline || '#222222',
				bodyColor: husband ? 'gary' : index>=NPC_COUNT * .9 ? NUDE.name : getRandom(BODY_COLORS.slice(0, BODY_COLORS.length - 2)).name,
				x: 100 + Math.random()*(WORLD_SIZE[0]-200), 
				y: 100 + Math.random()*(WORLD_SIZE[1]-200),
				move,
				face: move,
				lookAtHero: { dx: 0, dy: 0},
				type: husband ? 'gary' : getRandom(['npc', 'pixie', 'mad', 'smart']),
				gender,
				introduction: husband ? husbandIntro(gender) : wrapText(randomIntroduction(index + randomMess, name, occupation)),
				memory: wrapTextWithLimit(husband ? husbandMemory(gender) : randomMemory(index + randomMess, parasite, name), LONG_STRING_LIMIT),
				blocked: 0,
				husband,
				parasite,
			};
		}
	);
	let totalParasiteCount = parasiteCount;
	const walls = {}, surface = {}, npcWalls = {};

	const tiles = [], cols = Math.floor(WORLD_SIZE[0] / 32), rows = Math.floor(WORLD_SIZE[1] / 32);
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const isDoor = r===1 && c===Math.round(cols/2);
			const isWall = c===0 || r<=1 || c===cols-1 || r===rows-1;
			const type = !isWall ? 'floor-tile' : 'bricks';
			const frame = type==='floor-tile' ? getRandom([0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]) : 
				getRandom([0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
			tiles.push({ type, x: c * 32 - 16, y: r * 32 - 16, frame });
			if(isDoor) {
				tiles.push({ type: 'the-door', x: c * 32 - 16, y: r * 32 - 16, frame:1, door:'closed', });
				tiles.push({ type: 'the-door', x: c * 32 - 16, y: r * 32 - 16, frame:0, door:'opened', });
			}
			walls[c + "_" + r] = isDoor ? 'door' : isWall ? type : null;
			surface[c + "_" + r] = type;
		}
	}

	function canExit() {
		if (DEBUG.canExit) {
			return true;
		}
		return inHallway || parasiteCount===0;
	}

	function initScene() {
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
		if(walls[tag]) {
			if (walls[tag] !== 'door') {
				return true;				
			}

			if(!canExit() && walls[tag] === 'door') {
				return true;
			}
		}
		return !surface[tag] || npcToo && npcWalls[tag];
	}

	function exiting(x, y) {
		const xx = Math.round(x / 32);
		const yy = Math.round(y / 32);
		const tag = xx+"_"+yy;
		return walls[tag] === 'door' && canExit();
	}

	let exitedTheBuilding = 0;
	function goExit(now) {
		exitedTheBuilding = now;
		Engine.setData('exitTime', now);
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

	let inHallway = false;
	let inFinal = false;
	let inFinalFinal = false;

	let skipOnce = false;

	function finalfinalScene(now) {
		skipOnce = true;
		console.log('finalfinal');
//		Engine.previousScene(now);
		Engine.nextScene(now);
		hero.x = 544;//WORLD_SIZE[0]/2+16;
		hero.y = 224;//WORLD_SIZE[1]/2;


		tiles.length = 0;
		exitedTheBuilding = 0;
		npcs.length = 0;
		hero.gun = now;
		inFinal = true;
		inFinalFinal = true;
		talking = 0;
		npcToTalk.talking = 0;
//		talking = true;
//		console.log('finalScene');

		scroll.x = (settings.size[0] / 2 - hero.x + (hero.gun ? - hero.face.dx * 70 : talking && npcToTalk ? - hero.face.dx * 20 : 0));
		scroll.y = (settings.size[1] / 2 - hero.y + (hero.gun ? - hero.face.dy * 60 + 30 : talking && npcToTalk ? 40 : 20));

		const COLS = 15, ROWS = 6;
		for(let r=0; r < ROWS; r++) {
			for(let c = -1; c < COLS; c++) {
				const isDoor = false;//c === Math.floor(COLS/2) && r === 1;
				const isWall = c<0 || c === COLS-1 || r<=1 || r===ROWS-1
					|| c >= 2 && r != 2;
				const type = !isWall ? 'floor-tile' : 'bricks';
				const frame = type==='floor-tile' ? getRandom([0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]) : 
					getRandom([0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
				const col = Math.floor(hero.x / 32 + c);
				const row = Math.floor(hero.y / 32 + r - ROWS + 2);
//				tiles.push({ type, x: col * 32 - 16, y: row * 32 - 16, frame });
				walls[col + "_" + row] = isDoor ? 'door' : isWall ? type : null;
				surface[col + "_" + row] = type;
			}
		}
		tiles.push({ type:'moonlight', x: (WORLD_SIZE[0]/2+16) - 72, y: (WORLD_SIZE[1]/2)- 320});

		const husband = true;
		const parasite = false;
		const gender = 'penis';
		const faceColor = FACE_COLORS.filter(a => a.name==="pink")[0];
		const name = 'Sleepy Gary';
		const occupation = 'husband';
		const move = { dx: 0, dy: 0};

		npcs.push(npcToTalk = { 
			id: 0,
			name,
			occupation,
			head: 'gary-head',
			skinColor: faceColor.name,
			textColor: '#' + (faceColor[0xFFFFFF] + 0xF000000).toString(16).substr(1),
			outline: faceColor.outline || '#222222',
			bodyColor: 'gary',
			x: 715, 
			y: 224,
			move,
			face: move,
			lookAtHero: { dx: -1, dy: 0},
			type: 'gary',
			gender,
			introduction: husbandIntro(gender),
			memory: wrapTextWithLimit(husbandMemory(gender), LONG_STRING_LIMIT),
			blocked: 0,
			husband,
			parasite,
		});		
		window.gary = npcToTalk;



		// FINALCHATS = [
		// 	"You're right Sleepy Gary. You really are... human.",
		// 	"--1-",
		// 	"--2-",
		// 	"--3-",
		// 	"--4-",
		// ].map(wrapText);



	}

	function finalScene(now) {
		skipOnce = true;
		Engine.nextScene(now);
		hero.x = WORLD_SIZE[0]/2+16;
		hero.y = WORLD_SIZE[1]/2;
		tiles.length = 0;
		exitedTheBuilding = 0;
		npcs.length = 0;
		hero.gun = now;
		inFinal = true;
//		console.log('finalScene');

		scroll.x = (settings.size[0] / 2 - hero.x + (hero.gun ? - hero.face.dx * 70 : talking && npcToTalk ? - hero.face.dx * 20 : 0));
		scroll.y = (settings.size[1] / 2 - hero.y + (hero.gun ? - hero.face.dy * 60 + 30 : talking && npcToTalk ? 40 : 20));

		const COLS = 15, ROWS = 6;
		for(let r=0; r < ROWS; r++) {
			for(let c = -1; c < COLS; c++) {
				const isDoor = false;//c === Math.floor(COLS/2) && r === 1;
				const isWall = c<0 || c === COLS-1 || r<=1 || r===ROWS-1
					|| c >= 2 && r != 2;
				const type = !isWall ? 'floor-tile' : 'bricks';
				const frame = type==='floor-tile' ? getRandom([0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]) : 
					getRandom([0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
				const col = Math.floor(hero.x / 32 + c);
				const row = Math.floor(hero.y / 32 + r - ROWS + 2);
//				tiles.push({ type, x: col * 32 - 16, y: row * 32 - 16, frame });
				walls[col + "_" + row] = isDoor ? 'door' : isWall ? type : null;
				surface[col + "_" + row] = type;
			}
		}
		tiles.push({ type:'moonlight', x: (WORLD_SIZE[0]/2+16) - 72, y: (WORLD_SIZE[1]/2)- 320});


		const husband = true;
		const parasite = false;
		const gender = 'penis';
		const faceColor = FACE_COLORS.filter(a => a.name==="pink")[0];
		const name = 'Sleepy Gary';
		const occupation = 'husband';
		const move = { dx: 0, dy: 0};

		npcs.push(npcToTalk = { 
			id: 0,
			name,
			occupation,
			head: 'gary-head',
			skinColor: faceColor.name,
			textColor: '#' + (faceColor[0xFFFFFF] + 0xF000000).toString(16).substr(1),
			outline: faceColor.outline || '#222222',
			bodyColor: 'gary',
			x: 715, 
			y: 224,
			move,
			face: move,
			lookAtHero: { dx: -1, dy: 0},
			type: 'gary',
			gender,
			introduction: husbandIntro(gender),
			memory: wrapTextWithLimit(husbandMemory(gender), LONG_STRING_LIMIT),
			blocked: 0,
			husband,
			parasite,
		});
	}

	function secondScene(now) {
		skipOnce = true;
		Engine.nextScene(now);
		hero.x = WORLD_SIZE[0]/2+16;
		hero.y = WORLD_SIZE[1]/2;
		inHallway = true;
		npcs.length = 0;
		parasites.length = 0;
		tiles.length = 0;
		exitedTheBuilding = 0;

		const COLS = 7, ROWS = DEBUG.shortExit ? 5 :30;
		for(let r=0; r < ROWS; r++) {
			for(let c = 0; c < COLS; c++) {
				const isDoor = c === Math.floor(COLS/2) && r === 1;
				const isWall = c===0 || c === COLS-1 || r<=1 || r===ROWS-1;
				const type = !isWall ? 'floor-tile' : 'bricks';
				const frame = type==='floor-tile' ? getRandom([0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3]) : 
					getRandom([0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
				const col = Math.floor(hero.x / 32 + c - 2);
				const row = Math.floor(hero.y / 32 + r - ROWS + 3);
				const offsetY = r===ROWS-1 && c===Math.floor(COLS/2) ? 8 : 0;
				if(offsetY > 0) {
					tiles.push({ type:'floor-tile', x: col * 32 - 16, y: row * 32 - 16, frame: 0 });					
				}
				tiles.push({ type, x: col * 32 - 16, y: row * 32 - 16 + offsetY, frame });
				if(isDoor) {
					tiles.push({ type: 'the-door', x: col * 32 - 16, y: row * 32 - 16, frame:1, door:'closed', });
					tiles.push({ type: 'the-door', x: col * 32 - 16, y: row * 32 - 16, frame:0, door:'opened', });
				}
				walls[col + "_" + row] = isDoor ? 'door' : isWall ? type : null;
				surface[col + "_" + row] = type;
//				tiles.push({});
			}
		}
	}

	function performActions5(now) {
		hero.move.dy = 0;
		hero.move.dx = 0;

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
			waitUp = false;
			finalChat = 0;
			chatIndex = 3;
		} else {

			if(!talking || !npcToTalk) {
				npcToTalk = null;
			} else {
				if(now - talking > 1000 && !npcToTalk.talking) {
					npcToTalk.talking = now;
				}//console.log(Keyboard.move.dy);
				//inFinalfinal

				if (!waitUp && Keyboard.move.dy) {
					chatIndex = Math.max(0, Math.min(3, chatIndex - Keyboard.move.dy)); //(chatIndex % 4 - Keyboard.move.dy + 4) % 4;
//						console.log(chatIndex);
					waitUp = true;
				} else if(!Keyboard.move.dy) {
					waitUp = false;
				}

			}

		}



		if(!alreadyPressed && Keyboard.action.down) {
			{
				if(npcToTalk) {
//					talking = talking ? 0 : now;
					if(!talking) {
					} else if (finalChat < FINALCHATS_NEXT) {
						npcToTalk.talking = 0;
						finalChat ++;
						chatIndex = 3;
					} else {
						npcToTalk.talking = 0;
						finalChat ++;
						chatIndex = 3;
						// goExit(now);
					}
				}
			}
			alreadyPressed = true;
		} else if(!alreadyPressed && Keyboard.action.cancel) {
			if(hero.gun) {
				hero.gun = 0;
				justPutGunDown = now;
				Engine.setData('music', 'spring_sprinkle');				
			}
			talking = 0;
		} else if(alreadyPressed && !Keyboard.action.down && !Keyboard.action.cancel) {
			alreadyPressed = false;
		}
	}

	function performActions4(now) {
		if(exitedTheBuilding && now - exitedTheBuilding > 2000 ) {
			finalfinalScene(now);
		}
		if(!exitedTheBuilding && now > 20000) {
			goExit(now);
		}
	}

	function performActions3(now) {
		if(exitedTheBuilding && now - exitedTheBuilding > 2000 ) {
			finalScene(now);
		}


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

		if(!exitedTheBuilding && hero.x / 32 < 17) {

			if (Keyboard.move.dx != hero.move.dx || Keyboard.move.dy != hero.move.dy) {
				const { dx, dy } = Keyboard.move;
				hero.move.dx = dx;
				hero.move.dy = dy;
			}

			const { dx, dy } = hero.move;
			const { face } = hero;

			if(dx || dy) {
				face.dx = dx;
				face.dy = dy;
			}

			window.hero = hero;

			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist) {
				let heroSpeed = shooting(now) ? 0 :  SPEED * 2 * (hero.gun || now - justPutGunDown ? 2 : 1);
				let realDx = heroSpeed * dx / dist;
				let realDy = heroSpeed * dy / dist;
				if (blocked(hero.x + realDx, hero.y + realDy)) {
					if (!blocked(hero.x + heroSpeed * dx, hero.y)) {

						if(Math.floor(hero.y / 32) < 7) {
//							hero.x += heroSpeed * dx;
						}
					} else if(!blocked(hero.x, hero.y + heroSpeed * dy)) {
						if(Math.floor(hero.y / 32) >= 7) {
//							hero.y += heroSpeed * dy;
						}
					} else {

					}
				} else {
					if(hero.y / 32 <= 7) {
						hero.x += realDx;
					}
					if(hero.y / 32 > 7) {
						hero.y += realDy;
					} else {
						hero.y = 7 * 32;
					}
				}
			}
		} else if(!exitedTheBuilding) {
			hero.move.dy = 0;
			hero.move.dx = 0;

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
				waitUp = false;
				finalChat = 0;
				chatIndex = 3;
			} else {

				if(!talking || !npcToTalk) {
					npcToTalk = null;
				} else {
					if(now - talking > 1000 && !npcToTalk.talking) {
						npcToTalk.talking = now;
					}//console.log(Keyboard.move.dy);

					if (!waitUp && Keyboard.move.dy) {
						chatIndex = Math.max(0, Math.min(3, chatIndex - Keyboard.move.dy)); //(chatIndex % 4 - Keyboard.move.dy + 4) % 4;
//						console.log(chatIndex);
						waitUp = true;
					} else if(!Keyboard.move.dy) {
						waitUp = false;
					}

				}

			}



			if(!alreadyPressed && Keyboard.action.down) {
				{
					if(npcToTalk) {
	//					talking = talking ? 0 : now;
						if(!talking) {
						} else if (finalChat < FINALCHATS_NEXT) {
							npcToTalk.talking = 0;
							finalChat ++;
							chatIndex = 3;
						} else {
							npcToTalk.talking = 0;
							finalChat ++;
							chatIndex = 3;
							goExit(now);
						}
					}
				}
				alreadyPressed = true;
			} else if(!alreadyPressed && Keyboard.action.cancel) {
				if(hero.gun) {
					hero.gun = 0;
					justPutGunDown = now;
					Engine.setData('music', 'spring_sprinkle');				
				}
				talking = 0;
			} else if(alreadyPressed && !Keyboard.action.down && !Keyboard.action.cancel) {
				alreadyPressed = false;
			}

		}
	}


	let finalChat = 0;

	function performActions2(now) {
		// if(!hero.gun) {
		// 	hero.gun = now;
		// }
		if(exitedTheBuilding && now - exitedTheBuilding > 2000 ) {
			finalScene(now);
		}


		const scrollGx = (settings.size[0] / 2 - (WORLD_SIZE[0]/2+16)  );
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

		if(!exitedTheBuilding) {
			if (Keyboard.move.dx != hero.move.dx || Keyboard.move.dy != hero.move.dy) {
				const { dx, dy } = Keyboard.move;
				hero.move.dx = dx;
				hero.move.dy = dy;
			}

			const { dx, dy } = hero.move;
			const { face } = hero;

			if(dx || dy) {
				face.dx = dx;
				face.dy = dy;
			}

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
					if(exiting(hero.x, hero.y)) {
						goExit(now);
					}
				}
			}
		}
	}

	function performActions(now) {
		// if(!hero.gun) {
		// 	hero.gun = now;
		// }
		if(exitedTheBuilding && now - exitedTheBuilding > 2000 && !inHallway) {
			Engine.setData('music', null);
			secondScene(now);
		}


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

		if(!exitedTheBuilding) {
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
					if(exiting(hero.x, hero.y)) {
						goExit(now);
					}
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
					Engine.playSound('laser');
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
								case 2: // MEMORY LANE
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
									Engine.setData('music', 'vick_n_vorty');				
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
					Engine.setData('music', 'spring_sprinkle');				
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
		}

		const npcSpeed = SPEED * (hero.gun ? 5 : 1);
		const wasShooting = shooting(now);
		const SHOOT_MARGIN_X = 100;
		const SHOOT_MARGIN_Y = 100;
		const SHOOTING_AREA_X = 10;
		const SHOOTING_AREA_Y = 20;
		let shotNpc = null;

		parasites.forEach(parasite => {
			if(now - parasite.born < 700) {
				return;
			}
			{
				const dx = hero.x - parasite.x;
				const dy = hero.y - parasite.y;
				const distHero = Math.sqrt(dx * dx + dy * dy);
				if (distHero < 60) {
					if (dx * parasite.move.dx >= 0 && dy * parasite.move.dy >= 0) {
						parasite.move.dx = Math.floor(Math.random() * 3) - 1;
						parasite.move.dy = Math.floor(Math.random() * 3) - 1;
					}
					if (dx * parasite.move.dx > 0 && dy * parasite.move.dy > 0) {
						parasite.move.dx *= -1;
						parasite.move.dy *= -1;
					}
				} else if(distHero < 100 && dx * parasite.move.dx >= 0 && dy * parasite.move.dy >= 0) {
					parasite.move.dx = Math.floor(Math.random() * 3) - 1;
					parasite.move.dy = Math.floor(Math.random() * 3) - 1;
				} else if (distHero > 400) {
					parasite.move.dx = 0;
					parasite.move.dy = 0;					
				}
			}

			{
				const speed = 1;
				let { dx, dy } = parasite.move;
				let dist = Math.sqrt(dx * dx + dy * dy);
				if (dist) {
					let realDx = speed * dx / dist;
					let realDy = speed * dy / dist;

					parasite.x += realDx;
					parasite.y += realDy;
					if(parasite.x < 0 && dx < 0) {
						parasite.x = 0;
						parasite.move.dx = -dx;
					}
					if(parasite.x > WORLD_SIZE[0] && dx > 0) {
						parasite.x = WORLD_SIZE[0];
						parasite.move.dx = -dx;
					}
					if(parasite.y < 0 && dy < 0) {
						parasite.y = 0;
						parasite.move.dy = -dy;
					}
					if(parasite.y > WORLD_SIZE[1] && dy > 0) {
						parasite.y = WORLD_SIZE[1];
						parasite.move.dy = -dy;
					}		
				}
			}

		});

		npcs.forEach(npc => {
			if(wasShooting && !shotNpc && lastShot.target == null && !npc.husband && !npc.shot)
			{
				const { dx, dy } = lastShot;
				const [width, height] = settings.size;
				let shot = false;
				if(!dx) {	//	SHOOTING VERTICAL
					if (dy * (npc.y - lastShot.y) > 0 && Math.abs(npc.x - lastShot.x) < SHOOTING_AREA_X && onScreen(npc)) {
						shot = now;
					}
				} else if(!dy) {	//	SHOOTING HORIZONTAL
					if (dx * (npc.x - lastShot.x) > 0 && Math.abs(npc.y - 16 - lastShot.y) < SHOOTING_AREA_Y && onScreen(npc)) {
						shot = now;
					}
//					console.log(npc.y, lastShot.y, npc.y - 16 - lastShot.y);
				}
				if(shot) {
					Engine.playSound('parasite_die');
					lastKilled.time = now;
					lastKilled.npc = npc;
					lastKilled.parasite = npc.parasite;
					shotNpc = npc;
					npc.shot = now;
					lastShot.target = npc;
					//timeFreeze = true;
					for(let i=0; i<10; i++) {
						particles.push([dx===0 ? lastShot.x : npc.x, dy===0 ? lastShot.y : npc.y, (Math.random() -.5) * 3 + lastShot.dx, (Math.random()-.5) * 2 + lastShot.dy]);
					}

					if(npc.parasite) {
						parasiteCount--;
						for(let i=0; i < totalParasiteCount - parasiteCount; i++) {
							parasites.push(
								{ born: now, x: npc.x, y: npc.y, move: {dx: Math.random()-.5, dy: Math.random()-.5} },
							);
						}
					}

//					console.log(npc);
				}
			}

			if(timeFreeze || npc.shot) {
				return;
			}
			occupy(npc.x, npc.y, false);

			//	avoid hero
			if (hero.gun && npc.blocked < 100)
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
					if (npc.blocked < 100) {
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
						npc.move.dx = (WORLD_SIZE[0]/2 - npc.x);
						npc.move.dy = (WORLD_SIZE[1]/2 - npc.y);
						const dist = (npc.move.dx * npc.move.dx - npc.move.dy * npc.move.dy);
						npc.move.dx /= dist;
						npc.move.dy /= dist;
						if (!blocked(npc.x + realDx, npc.y + realDy, true) && dist < 100) {
							npc.blocked = 0;
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
				frame: inFinal ? 2 : (hero.gun || npc!==hero && (justPutGunDown && now - justPutGunDown < 2000 || showGun() || !lastKilled.parasite && lastKilled.time && now - lastKilled.time < 60000) ? (npc===hero ? 2 : npc.id % 3 + 1) : 0),
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
		if(skipOnce) {
			skipOnce = false;
			return sprites;
		}
		if(!exitedTheBuilding || inFinal) {
			const heroSprite = shooting(now) ? 'gunshooting' : showGun() ? 'gun' : 'hero';
			const heroDx = hero.face.dx;
			const heroDy = hero.face.dy;
			// const heroDx = hero.gun ? hero.face.dx : hero.move.dx;
			// const heroDy = hero.gun ? hero.face.dy : hero.move.dy;
			sprites.push(getSprite(heroSprite, scroll.x + hero.x, scroll.y + hero.y, heroDx, heroDy, hero, now));
		}

		npcs.forEach(npc => {
			if (onScreen(npc)) {
//				if(!npc.shot || Math.random() > .8) {
					sprites.push(getSprite(npc.type, scroll.x + npc.x, scroll.y + npc.y, npc.move.dx, npc.move.dy, npc, now));
//				}
			}
		});

		tiles.forEach(tile => {
			if (onScreen(tile) || inFinal) {
				if(tile.door === 'opened') {
					if(canExit()) {
						sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
					}
				} else if(tile.door === 'closed') {
					if(!canExit()) {
						sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);						
					}
				} else {
					sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
				}
			}
		});
		if (talking && npcToTalk) {
			const LETTER_BOX_SIZE = Math.min(70, (now - talking) / 8);
			if(!inFinal) {
				sprites.push(['rect',0, 0, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			}
			sprites.push(['rect',0, settings.size[1] - LETTER_BOX_SIZE, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 1 }]);
			if(npcToTalk && npcToTalk.talking) {
				const killed = (now - lastKilled.time) < 60000 ? lastKilled.npc : null;
				const topics = !killed ? HOT_TOPICS.normal : killed.parasite ? HOT_TOPICS.justKilled : HOT_TOPICS.justKilledHuman;
				let text = memoryLanes() ? npcToTalk.memory : whoAreYou() ? npcToTalk.introduction : npcToTalk.husband ? (inFinal?
					FINALCHATS[finalChat]:"Remember our vacation?") 
				: topics[npcToTalk.id % topics.length]; //'Greetings. What can I do for you?';
				lastMessage = text;
				if (killed) {
					text = text.split("{name}").join(killed.name).split("{occupation}").join(killed.occupation);
				}
				//console.log(npcToTalk.textColor);
				if(memoryLanes()) {
					sprites.push(['text', 20, 42, { text, color: 'white', speechSpeed: SPEECH_SPEED, talkTime: npcToTalk.talking, zOrder: 3, outline: '#222222' }]);
				} else {
					sprites.push(['text', 
						- (inFinalFinal ? 30 : 0) +
						settings.size[0] / 2 - Math.min(text.length, STRING_LIMIT) * 2 + hero.face.dx * 20 - 10, settings.size[1] / 2 - 30, { text, color: npcToTalk.textColor, speechSpeed: SPEECH_SPEED, talkTime: npcToTalk.talking, zOrder: 3, outline: npcToTalk.outline }]);
				}
			
				const shouldTalk = npcToTalk.talking && now - npcToTalk.talking < lastMessage.length * SPEECH_SPEED;
				if(npcToTalk.talking && !shouldTalk) {
//					sprites.push(['gun', settings.size[0] - 50, settings.size[1] - 40, { size: [20,20], zOrder: 3}]);
					if(!inFinal) {
						sprites.push(getMenu(now));
					} else if(finalChat !== FINALCHATS_NEXT && !inFinalFinal) {
						sprites.push(getFinalMenu(now));
					}
				}
			}
		}
		if (hero.gun && !inFinal && !inHallway) {
			const LETTER_BOX_SIZE = Math.min(30, (now - hero.gun) / 8);
			sprites.push(['rect',0, 0, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 2 }]);
			sprites.push(['rect',0, settings.size[1] - LETTER_BOX_SIZE, { width: settings.size[0], height: LETTER_BOX_SIZE, zOrder: 2 }]);
			sprites.push(['gun', settings.size[0] - 50, settings.size[1] - 30, { zOrder: 3}]);
			sprites.push(['text', 10, 25, { text: "ESC: PUT AWAY THE GUN\nSPACE: SHOOT", zOrder: 3, color: '#FFFFFF'}]);
			sprites.push(['text', settings.size[0] - 40, 27, {text: parasiteCount, zOrder: 3, color: '#29b8b8', fontSize: 20}])

			if(shooting(now) && !lastShot.target) {
				sprites.push(makeBullet(lastShot, scroll));
			}
		}
		particles.forEach(particle => {
			sprites.push(['rect', scroll.x + particle[0], scroll.y + particle[1] - 16, { zOrder: 1, color: 'white', width: 2, height: 2 }]);
		});

		parasites.forEach(parasite => {
			if(now - parasite.born > 700) {
				sprites.push(['parasite-run', scroll.x + parasite.x, scroll.y + parasite.y, {animated: true }]);
			}
		});

		return sprites;
	}


	const FINALCHATS_NEXT = 3;

	//finalChat



	let FINALCHATS = [
		"I don't care what's happening out there. You and I, we're going to survive this.",
		"Wait, can you be so sure that I'm a parasite? After all we've been through together.",
		"Oh please don't kill me. You must have a bad memory of me hidden somewhere.",
		"No! Wait! There's this one time... you know... please try to remember...",
		"--1-",
		"--2-",
		"--3-",
		"--4-",
	].map(wrapText);

	function getSprites2(now) {
		sprites.length = 0;
		const heroSprite = shooting(now) ? 'gunshooting' : showGun() ? 'gun' : 'hero';
		const heroDx = hero.face.dx;
		const heroDy = hero.face.dy;
		if(!exitedTheBuilding) {
			sprites.push(getSprite(heroSprite, scroll.x + hero.x, scroll.y + hero.y, heroDx, heroDy, hero, now));
		}

		tiles.forEach(tile => {
			if (onScreen(tile)) {
				if(tile.door === 'opened') {
					if(canExit()) {
						sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
					}
				} else if(tile.door === 'closed') {
					if(!canExit()) {
						sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);						
					}
				} else {
					sprites.push([tile.type, scroll.x + tile.x, scroll.y + tile.y, {animated: false, frame: tile.frame}]);
				}
			}
		});



		return sprites;
	}	

	const parasites = [
	];

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

	const FINALMENUS = [
		[
			['text', 20, -15, { text: "I know I'll survive this. Don't know about you.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "You're a parasite, Sleepy Gary.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "Sleepy Gary, you've been a bad, bad boy.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: 'Goodbye Spleepy Gary. I will miss you.', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
		[
			['text', 20, -15, { text: "Parasites can't implant bad memories.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "I don't have a single bad memory of you.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "You are my best memories, Sleepy Gary.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: "You're too good to be real, Sleepy Gary.", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
		[
			['text', 20, -15, { text: "That nice vacation on our yatch?", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "That memorable wedding?", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "Our first kiss?", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: 'Our ménage à trois with Jerry?', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
		[
			['text', 20, -15, { text: "1---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: '---', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
		[
			['text', 20, -15, { text: "2---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: '---', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
		[
			['text', 20, -15, { text: "3---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 0, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 15, { text: "---", speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
			['text', 20, 30, { text: '---', speechSpeed: SPEECH_SPEED, color: 'white', outline: '#222222'}],
		],
	];


	function getFinalMenu(now) {
		return [
			'group', 20, settings.size[1] - 35, { zOrder: 3}, FINALMENUS[finalChat]
				.concat([['pointer', -16, 8 - chatIndex * 15, { animated: false, frame: 5 }]]),
		];
	}


	function getMenu(now) {
		return [
			'group', 20, settings.size[1] - 35, { zOrder: 3}, [
//				['gun',  20, -40, { size: [25, 25] }],
				['text', 20, -15, { text: 'I\'s time to take out the big gun.', speechSpeed: SPEECH_SPEED, color: '#EE5555', outline: '#222222'}],
				// ['text', 20, 0, { text: 'Will you take me back to memory lanes?', speechSpeed: SPEECH_SPEED, color: '#AAEEFF', outline: '#222222'}],
				['text', 20, 0, { text: 'Will you take me down memory lane?', speechSpeed: SPEECH_SPEED, color: memoryLanes() ? '#444444' : 'white', outline: '#222222'}],
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

	function getFinalSprites() {
		if(skipOnce) {
			skipOnce = false;
			return [];
		}
		return [
			['sex', 0, 50, {animated: true}],
			['sex-caught', 0, 50, {animated: true, after: 7000, animationStart: 7000}],
			['text', 20, 42, { text: "Sleepy Gary! how could you?           \n\nAnd with...              YOU.", color: '#cccccc', speechSpeed: 100, talkTime: 11000, zOrder: 3, outline: '#222222' }],

		];

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
			['parasite-run.png', 32, 32, {
				offset: {x:-16, y:-32}
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
			['the-door.png', 32, 64, {
				offset: {x:0, y:-32},
			}],
			['sex.png', 320, 150, {
				count: 4,
				frameRate: 4,
			}],
			['sex-caught.png', 320, 150, {
				count: 8,
				frameRate: 8,
				repeat: 1,
			}],
			['moonlight.png'],


			["spring_sprinkle.mp3", 1, loop],
			["vick_n_vorty.mp3", 1, loop],
			["evil_vortman.mp3", 1, loop],
			["parasite_die.wav", 1],
			["laser.wav", 0.4],
			["ui_yes.wav", 1],
			["ui_no.wav", 1],
		],
		scenes: [
			{
				fadeStart: ['exitTime'],
				objects: {

				},
				init: [
					initScene,
					[ '=>', 'music', 'spring_sprinkle' ],
				],
				actions: [
					['setMusic', ['music']],
					performActions,
				],
				sprites: getSprites,
			},
			{
				fadeStart: ['exitTime'],
				objects: {
				},
				init: [
					[ '=>', 'music', 'evil_vortman' ],
				],
				actions: [
					['setMusic', ['music']],
					performActions2,
				],
				sprites: getSprites,
			},
			{
				fadeStart: ['exitTime'],
				objects: {
				},
				init: [
					[ '=>', 'music', 'evil_vortman' ],
				],
				actions: [
					['setMusic', ['music']],
					performActions3,
				],
				sprites: getSprites,
			},
			{
				fadeStart: ['exitTime'],
				backgroundColor: 'black',
				init: [
					[ '=>', 'music', 'evil_vortman' ],
				],
				actions: [
					['setMusic', ['music']],
					performActions4,
				],
				sprites: getFinalSprites,
			},
			{
				fadeStart: ['exitTime'],
				objects: {
				},
				init: [
					[ '=>', 'music', 'evil_vortman' ],
				],
				actions: [
					['setMusic', ['music']],
					performActions5,
				],
				sprites: getSprites,
			},			
			{
				fadeStart: ['exitTime'],
				backgroundColor: 'black',
				init: [
					[ '=>', 'music', 'evil_vortman' ],
				],
				actions: [
					['setMusic', ['music']],
				],
			},

		],
	};
}();
