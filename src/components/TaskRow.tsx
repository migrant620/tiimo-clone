import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CompletionCircle } from './Glyphs';
import { Icon } from './Icon';
import { colors, space, type as typo } from '../tokens';
import { PLACEHOLDER_COPY } from '../model';
import type { Task, TimeOfDay } from '../model';
import { emojiFamily } from '../emojiFont';

function TaskRowImpl({
  task,
  onToggleComplete,
  onOpenMenu,
}: {
  task: Task;
  onToggleComplete: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={task.title} onPress={onOpenMenu} style={[styles.card, task.done && styles.cardDone]}>
      <View style={styles.chip}>
        <Text style={styles.chipGlyph}>{task.marker ?? ''}</Text>
      </View>
      <View style={styles.text}>
        <Text numberOfLines={1} style={styles.title}>
          {task.title}
        </Text>
        <Text style={styles.caption}>{`${task.durationMin}min`}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={task.done ? 'Undo completion' : 'Complete task'}
        aria-checked={task.done}
        hitSlop={12}
        onPress={onToggleComplete}
        style={styles.circleSlot}
      >
        {task.done ? (
          <View style={styles.doneDisc}>
            <Icon name="check" size={15.3} lineHeight={16} color={colors.card} />
          </View>
        ) : (
          <CompletionCircle size={21.1} strokeWidth={2.4} color={colors.ink} />
        )}
      </Pressable>
    </Pressable>
  );
}

export const TaskRow = React.memo(TaskRowImpl);

export function PlaceholderRow({
  section,
  onQuickAdd,
}: {
  section: TimeOfDay;
  onQuickAdd: () => void;
}) {
  return <DashedAddCard copy={PLACEHOLDER_COPY[section]} label={`Add task to ${section}`} onPress={onQuickAdd} />;
}

export function DashedAddCard({
  copy,
  label,
  onPress,
  height,
}: {
  copy: string;
  label: string;
  onPress: () => void;
  height?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.placeholderCard, height !== undefined && { height }]}
    >
      <Text style={styles.placeholder}>{copy}</Text>
      <View style={styles.plusWell}>
        <View style={styles.plusDisc}>
            <Icon name="plusThin" size={14.2} lineHeight={14.6} color={colors.plusInk} />
          </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: space.cardHeight,
    backgroundColor: colors.card,
    borderRadius: space.cardRadius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12.3,
    paddingRight: 6,
    paddingTop: space.cardContentDrop,
    marginTop: space.pillToCard,
  },
  cardDone: { height: space.doneCardHeight, paddingBottom: space.doneCardHeight - space.cardHeight },
  chip: {
    width: 31,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: colors.discBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGlyph: { fontFamily: emojiFamily, fontSize: 14.3, lineHeight: 19.3 },
  text: { flexShrink: 1, marginLeft: 8, justifyContent: 'center' },
  title: { ...typo.taskTitle, color: colors.ink },
  caption: { ...typo.caption, color: colors.ink },
  circleSlot: { marginLeft: 'auto', marginRight: 6.8, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  placeholderCard: {
    height: space.placeholderHeight,
    borderRadius: space.cardRadius,
    borderWidth: space.dashWidth,
    borderStyle: 'dashed',
    borderColor: colors.dash,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14.3 - space.dashWidth,
    paddingRight: 6.5 - space.dashWidth,
    marginTop: space.pillToCard,
  },
  placeholder: { ...typo.placeholder, color: colors.muted, flexShrink: 1 },
  doneDisc: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  plusWell: { width: 34.2, height: 34.2, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' },
  plusDisc: {
    width: 18.4,
    height: 18.4,
    borderRadius: 9.2,
    backgroundColor: colors.sheet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
