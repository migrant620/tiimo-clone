import * as React from 'react';
import { Platform, Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

export const GLYPH = {
  close: ['MDI', 0xf0156],
  check: ['MDI', 0xf012c],
  chevronUp: ['MDI', 0xf0143],
  chevronLeft: ['MDI', 0xf0141],
  chevronRight: ['MDI', 0xf0142],
  lock: ['MDI', 0xf033e],
  play: ['MDI', 0xf040a],
  pause: ['MDI', 0xf03e4],
  cog: ['MDI', 0xf08bb],
  trash: ['MDI', 0xf09e7],
  copy: ['MDI', 0xf018f],
  trayUp: ['MDI', 0xf011d],
  calendar: ['MDI', 0xf0b67],
  calendarMonth: ['MDI', 0xf0e17],
  pencil: ['MDI', 0xf0cb6],
  clock: ['MDI', 0xf0150],
  arrowDown: ['MDI', 0xf0045],
  arrowUp: ['MDI', 0xf005d],
  arrowRightMdi: ['MDI', 0xf0054],
  dotsVertical: ['MDI', 0xf01d9],
  priorityTriangle: ['MDI', 0xf0536],
  priorityDot: ['MDI', 0xf0765],
  chevronDown: ['Feather', 0xf12e],
  plus: ['Feather', 0xf1c0],
  repeat: ['Feather', 0xf1c9],
  plusThin: ['Entypo', 0xf21a],
  arrowRight: ['FA6Solid', 0xf061],
} as const;

export type GlyphName = keyof typeof GLYPH;

interface IconProps {
  name: GlyphName;
  size: number;
  color: string;
  lineHeight?: number;
  style?: StyleProp<TextStyle>;
}

function faceReady(family: string): boolean {
  if (Platform.OS !== 'web') return true;
  if (typeof document === 'undefined' || !document.fonts) return true;
  let loaded = false;
  document.fonts.forEach((face) => {
    if (face.family.replace(/["']/g, '') === family && face.status === 'loaded') loaded = true;
  });
  return loaded;
}

function useFaceReady(family: string): boolean {
  const [ready, setReady] = React.useState(() => faceReady(family));
  React.useEffect(() => {
    if (ready || typeof document === 'undefined' || !document.fonts) return undefined;
    let alive = true;
    const update = () => {
      if (alive && faceReady(family)) setReady(true);
    };
    document.fonts.addEventListener('loadingdone', update);
    update();
    return () => {
      alive = false;
      document.fonts.removeEventListener('loadingdone', update);
    };
  }, [family, ready]);
  return ready;
}

export function Icon({ name, size, color, lineHeight, style }: IconProps) {
  const [family, code] = GLYPH[name];
  const ready = useFaceReady(family);
  const ink = ready ? color : 'transparent';
  return (
    <Text
      accessible={false}
      style={[{ fontFamily: family, fontSize: size, lineHeight: lineHeight ?? size, color: ink }, style]}
    >
      {String.fromCodePoint(code)}
    </Text>
  );
}
