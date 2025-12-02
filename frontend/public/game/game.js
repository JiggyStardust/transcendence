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
	gameOverText: null,
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
		vxSmallAngle: 2,
		vxLargeAngle: 1.581,
		vxStraightAngle: 2.236,
		vzSmallAngle: 1,
		vzLargeAngle: 1.581,
		vzStraightAngle: 0,
		xStartingAngle: 2.236,
		zStartingAngle: 0,
		xStartingPos: 0,
		zStartingPos: 0,
		paddleCollisionX: 2.4,
		scoreCollisionX: 2.6,
		sideCollisionZ: 2.6,
		paddleSize: 1.5,
		paddleCollisionSize: 0.95,
		paddle3CollisionSize: 0.775,
		p3StartingZ: -2,
		startingBallSpeed: 2.5,
		ballSpeed: 2.5,
		ballSpeedIncrement: 0.08,
		maxBallSpeed: 5,
		toggleDirection: 1,
		direction: new BABYLON.Vector3(-2.236, 0, 0)
	}
};
