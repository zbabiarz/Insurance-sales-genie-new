import { SVGProps } from "react";

export function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      width="1.2em"
      height="1.2em"
      {...props}
    >
      {/* Robot head */}
      <rect x="4" y="6" width="16" height="14" rx="2" />

      {/* Antenna */}
      <rect x="11" y="2" width="2" height="4" rx="1" />
      <circle cx="12" cy="2" r="1.5" />

      {/* Eyes */}
      <circle cx="9" cy="11" r="2" fill="white" />
      <circle cx="15" cy="11" r="2" fill="white" />
      <circle cx="9" cy="11" r="1" fill="#333" />
      <circle cx="15" cy="11" r="1" fill="#333" />

      {/* Mouth */}
      <rect x="8" y="16" width="8" height="2" rx="1" fill="white" />

      {/* Ears/Side parts */}
      <rect x="2" y="10" width="2" height="6" rx="1" />
      <rect x="20" y="10" width="2" height="6" rx="1" />

      {/* Control panel lights */}
      <circle cx="7" cy="8" r="0.8" fill="#5df" />
      <circle cx="10" cy="8" r="0.8" fill="#f55" />
      <circle cx="13" cy="8" r="0.8" fill="#5f5" />
    </svg>
  );
}
