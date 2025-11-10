export const gameState = {
	engine: null,
	canvas: null,
	scene: null,
	camera: null,
	sphere: null,
	paddle1: null,
	paddle2: null,
	scoreBoard: null,
	scoreTextLeft: null,
	scoreTextRight: null,

	score: {
		p1: 0,
		p2: 0,
		max: 7
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
		xStartingPosition: 0,
		zStartingPosition: 0,
		paddleCollisionX: 2.4,
		scoreCollisionX: 2.6,
		sideCollisionZ: 2.6,
		paddleSize: 1.5,
		paddleCollisionSize: 0.95,
		startingBallSpeed: 2.5,
		ballSpeed: 2.5,
		ballSpeedIncrement: 0.08,
		maxBallSpeed: 5,
		direction: new BABYLON.Vector3(2.236, 0, 0)
	}
};
