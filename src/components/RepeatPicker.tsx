import * as React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { RadioGlyph } from './Glyphs';
import { colors, space, type as typo } from '../tokens';
import { REPEAT_CARD_OPTIONS, repeatOptionForKey } from '../model';
import type { RepeatOption } from '../model';

export function RepeatPicker({
  value,
  onSelect,
  onDismiss,
}: {
  value: RepeatOption;
  onSelect: (option: RepeatOption) => void;
  onDismiss: () => void;
}) {
  const options = REPEAT_CARD_OPTIONS;
  const selectedOption = React.useRef<View>(null);
  const focusSelected = React.useCallback(() => {
    requestAnimationFrame(() => selectedOption.current?.focus());
  }, []);
  const cardKeyboard = {
    onKeyDownCapture: (event: React.KeyboardEvent) => {
      if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      const target = event.target as HTMLElement;
      const label = target.getAttribute?.('aria-label');
      const focusedIndex = options.findIndex((option) => `Repeat ${option}` === label);
      const navigationKey = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key);
      if (focusedIndex < 0 && !navigationKey) return;
      const index = focusedIndex < 0 ? options.indexOf(value) : focusedIndex;
      const option = repeatOptionForKey(event.key, index, options);
      if (!option) return;
      event.preventDefault();
      event.stopPropagation();
      onSelect(option);
    },
  };
  const card = (
    <View style={styles.repeatCard}>
      <Text accessibilityRole="header" style={styles.repeatTitle}>
        Repeat
      </Text>
      <View style={styles.repeatList} accessibilityRole="radiogroup">
        {options.map((option) => (
          <Pressable
            key={option}
            ref={option === value ? selectedOption : undefined}
            accessibilityRole="radio"
            accessibilityLabel={`Repeat ${option}`}
            aria-checked={option === value}
            tabIndex={option === value ? 0 : -1}
            onPress={() => onSelect(option)}
            style={styles.repeatRow}
          >
            <Text style={styles.repeatLabel}>{option}</Text>
            <RadioGlyph
              size={space.repeatRadioSize}
              strokeWidth={space.repeatRadioStroke}
              dotSize={space.repeatRadioDot}
              selected={option === value}
              color={option === value ? colors.primary : colors.ink}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <Modal transparent visible animationType="none" onRequestClose={onDismiss} onShow={focusSelected} {...cardKeyboard}>
      <Pressable
        accessibilityLabel="Dismiss repeat options"
        style={[styles.scrim, { backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' } as any]}
        onPress={onDismiss}
      />
      {card}
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.30)' },
  repeatCard: {
    position: 'absolute',
    top: space.repeatCardTop,
    left: space.repeatCardInset,
    right: space.repeatCardInset,
    backgroundColor: colors.surface,
    borderRadius: space.repeatCardRadius,
    paddingHorizontal: space.repeatCardPadX,
    paddingTop: space.repeatCardPadTop,
    paddingBottom: space.repeatCardPadBottom,
  },
  repeatTitle: { ...typo.pickerTitle, color: colors.ink },
  repeatList: {
    marginTop: space.repeatTitleToList,
    borderRadius: space.repeatListRadius,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  repeatRow: {
    height: space.repeatRowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: space.repeatRowPadLeft,
    paddingRight: space.repeatRowPadRight,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.sheet,
  },
  repeatLabel: { ...typo.body, color: colors.ink },
});
