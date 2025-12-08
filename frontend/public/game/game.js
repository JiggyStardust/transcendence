const state = Object.freeze({
	start: 0,
	playing: 1,
	pointScored: 2,
	reset: 3,
	gameOver: 4
});

export const game = {
	engine: null,
	canvas: null,
	scene: null,
	camera: null,
	sphere: null,
	paddle1: null,
	paddle2: null,
	paddle3: null,
	scoreBoard: null,
	scoreLeftText: null,
	scoreRightText: null,
	countdownText1: null,
	countdownText2: null,
	countdownText3: null,
	arrowLineText: null,
	arrowRightText: null,
	arrowLeftText: null,
	gameOverFinalText: null,
	gameOverScoreText: null,
	winnerText: null,
	p1NameText: null,
	p2NameText: null,
	p3NameText: null,
	middlePaddleFlag: false,
	startingCameraY: 7,
	currentCameraZ: 2,
	hasThirdPlayer: false,
  	state: state,
	currentState: state.start,

	light: {
		redArrow: null,
		redCountdown: null,
		redFinal: null
	},

	username: {
		p1: "Player1",
		p2: "Player2",
		p3: "Player3",
		p1Display: null,
		p2Display: null,
		p3Display: null
	},

	score: {
		p1: 0,
		p2: 0,
		max: 7
	},

	pointScored: {
		interval: 2,
		timer: 0
	},

	reset: {
		interval: 3,
		timer: 3,
		complete: false
	},

	move: {
		vxStraight: 2.236,
		vxSmall: 2,
		vxLarge: 1.581,
		vzStraight: 0,
		vzSmall: 1,
		vzLarge: 1.581,
		xStartingAngle: 2.236,
		zStartingAngle: 0,

		xStartingPos: 0,
		zStartingPos: 0,

		paddleCollisionX: 2.4,
		scoreCollisionX: 2.6,
		sideCollisionZ: 2.6,

		paddleSize: 1.5,
		paddleColSize: 0.95,
		paddle3ColSize: 0.775,

		p3StartingZ: -2,
		startingBallSpeed: 2.5,
		ballSpeed: 2.5,
		ballSpeedIncrement: 0.08,
		maxBallSpeed: 5,
		toggleDirection: 1,
		direction: new BABYLON.Vector3(-2.236, 0, 0)
	}
};
