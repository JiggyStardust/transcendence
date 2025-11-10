const vxSmallAngle = 2;
const vxLargeAngle = 1.581;
const vxStraightAngle = 2.236;
const vzSmallAngle = 1;
const vzLargeAngle = 1.581;
const vzStraightAngle = 0;

const xStartingAngle = vxStraightAngle;
const zStartingAngle = vzStraightAngle;

const xStartingPosition = 0;
const zStartingPosition = 0;

const paddleCollisionX = 2.4;
const scoreCollisionX = 2.6;
const sideCollisionZ = 2.6;
const paddleSize = 1.5;
const paddleCollisionSize = 0.95;

const startingBallSpeed = 2.5;
const ballSpeed = startingBallSpeed;
const ballSpeedIncrement = 0.08;
const maxBallSpeed = 5;

let direction = new BABYLON.Vector3(xStartingAngle, 0, zStartingAngle);


export const move = {
	vxSmallAngle,
	vxLargeAngle,
	vxStraightAngle,
	vzSmallAngle,
	vzLargeAngle,
	vzStraightAngle,
	xStartingAngle,
	zStartingAngle,
	xStartingPosition,
	zStartingPosition,
	startingBallSpeed,
	ballSpeed,
	ballSpeedIncrement,
	maxBallSpeed,
	paddleCollisionX,
	scoreCollisionX,
	sideCollisionZ,
	paddleSize,
	paddleCollisionSize,
	direction
};
