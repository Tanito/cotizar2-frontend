import Svg, { Circle, Path } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export function HomeIcon({ size = 24, color = "#2563EB" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5L12 4L20 10.5V19C20 20.1 19.1 21 18 21H14V15H10V21H6C4.9 21 4 20.1 4 19V10.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HistoryIcon({ size = 24, color = "#9CA3AF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C14.4 4 16.5 5 18 6.6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M18 3V7H14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function UsersIcon({ size = 24, color = "#9CA3AF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={3} stroke={color} strokeWidth={2} />
      <Circle cx={17} cy={10} r={2.5} stroke={color} strokeWidth={2} />
      <Path
        d="M4 19C4 15.7 6.7 13 10 13C13.3 13 16 15.7 16 19"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M15 19C15 16.8 16.8 15 19 15"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MoreIcon({ size = 24, color = "#9CA3AF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 7H19M5 12H19M5 17H19"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PlusIcon({ size = 24, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function DocumentIcon({ size = 22, color = "#2563EB" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3H13L18 8V20C18 21.1 17.1 22 16 22H7C5.9 22 5 21.1 5 20V5C5 3.9 5.9 3 7 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M13 3V8H18"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M8 12H15M8 16H13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WhatsAppIcon({ size = 20, color = "#16A34A" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5C20 16.2 16.2 20 11.5 20C10 20 8.6 19.6 7.4 18.9L4 20L5.1 16.8C4.4 15.6 4 14.2 4 12.8C4 8.1 7.8 4.3 12.5 4.3C17.2 4.3 20 7.8 20 11.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 9.5C10.2 11.3 11.7 12.8 13.5 13.5L14.8 12.2C15.1 11.9 15.5 11.8 15.9 11.9L17.5 12.4C18 12.6 18.3 13.1 18.2 13.6C18 15.6 16.4 17 14.5 17C10.4 17 7 13.6 7 9.5C7 7.6 8.4 6 10.4 5.8C10.9 5.7 11.4 6 11.6 6.5L12.1 8.1C12.2 8.5 12.1 8.9 11.8 9.2L10.5 10.5"
        fill={color}
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 18, color = "#9CA3AF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BellIcon({ size = 22, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 16V11C18 7.93 15.64 5.36 12.5 5.04V4C12.5 3.17 11.83 2.5 11 2.5C10.17 2.5 9.5 3.17 9.5 4V5.04C6.36 5.36 4 7.93 4 11V16L3 18H19L18 16Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M10 18.5C10 19.88 11.12 21 12.5 21C13.88 21 15 19.88 15 18.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
