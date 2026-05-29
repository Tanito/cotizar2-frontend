import Svg, { Circle, Path } from "react-native-svg";

type IconProps = {
  size?: number;
};

export function TimerIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="8" stroke="#2563EB" strokeWidth={2} />
      <Path
        d="M12 9V13L15 15"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 2H15M12 2V4"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DocumentIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3H13L18 8V20C18 21.1 17.1 22 16 22H7C5.9 22 5 21.1 5 20V5C5 3.9 5.9 3 7 3Z"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M13 3V8H18"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M8 12H15M8 16H13"
        stroke="#2563EB"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WhatsAppIcon({ size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5C20 16.2 16.2 20 11.5 20C10 20 8.6 19.6 7.4 18.9L4 20L5.1 16.8C4.4 15.6 4 14.2 4 12.8C4 8.1 7.8 4.3 12.5 4.3C17.2 4.3 20 7.8 20 11.5Z"
        stroke="#16A34A"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 9.5C10.2 11.3 11.7 12.8 13.5 13.5L14.8 12.2C15.1 11.9 15.5 11.8 15.9 11.9L17.5 12.4C18 12.6 18.3 13.1 18.2 13.6C18 15.6 16.4 17 14.5 17C10.4 17 7 13.6 7 9.5C7 7.6 8.4 6 10.4 5.8C10.9 5.7 11.4 6 11.6 6.5L12.1 8.1C12.2 8.5 12.1 8.9 11.8 9.2L10.5 10.5"
        fill="#16A34A"
      />
    </Svg>
  );
}
