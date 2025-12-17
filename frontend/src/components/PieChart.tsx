type Props = {
  wins: number;
  losses: number;
  size?: number;
  strokeWidth?: number;
};

export default function MatchResultPie({
  wins,
  losses,
  size = 500, // width and height
  strokeWidth = size / 2, // border thickness
}: Props) {
  const total = wins + losses;

  // Avoid division by zero
  if (total === 0) {
    return <p className="text-sm text-gray-500">No data</p>;
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius; // PI x diameter

  const lossRatio = losses / total;
  const lossStroke = lossRatio * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Background circle (wins) */}
      <circle
      // cx and cy: coorninates to placement
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#3a86ff"  // color
        strokeWidth={strokeWidth}
      />

      {/* Losses arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#fb5607" // color
        strokeWidth={strokeWidth}
        strokeDasharray={`${lossStroke} ${circumference - lossStroke}`}
        strokeDashoffset={0} // where areas start
        strokeLinecap="butt" // round, butt, square, inherit or defined
      />
    </svg>
  );
}
