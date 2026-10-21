import { Platform } from 'react-native';
import * as Font from 'expo-font';
import { FontDisplay } from 'expo-font';

const FAMILY = 'NotoColorEmoji-Marker';

let requested = false;

export function loadEmojiFont() {
  if (requested) return;
  requested = true;
  Font.loadAsync({
    [FAMILY]: { uri: require('../assets/fonts/NotoColorEmoji-Marker.ttf'), display: FontDisplay.SWAP },
  }).catch(() => undefined);
}

export const emojiFamily =
  Platform.OS === 'web' ? `${FAMILY}, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif` : undefined;

export const EMOJI_ADVANCE_EM = 1275 / 1024;
