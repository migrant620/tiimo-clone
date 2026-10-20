import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TodayHeader } from '../components/TodayHeader';
import { DashedAddCard } from '../components/TaskRow';
import { Icon } from '../components/Icon';
import type { GlyphName } from '../components/Icon';
import { colors, space, type as typo } from '../tokens';
import { PRIORITY_HINT, PRIORITY_LABEL, PRIORITY_ORDER } from '../model';
import type { Priority } from '../model';

const TINT: Record<Priority, string> = {
  high: colors.highPill,
  medium: colors.mediumPill,
  low: colors.lowPill,
  todo: colors.todoPill,
  done: colors.donePill,
};

const GLYPH: Record<Priority, { name: GlyphName; flip: boolean } | null> = {
  high: { name: 'priorityTriangle', flip: false },
  medium: { name: 'priorityDot', flip: false },
  low: { name: 'priorityTriangle', flip: true },
  todo: null,
  done: null,
};

function PriorityPill({
  priority,
  count,
  expanded,
  onToggle,
}: {
  priority: Priority;
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const glyph = GLYPH[priority];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${PRIORITY_LABEL[priority]} ${count}`}
      aria-expanded={expanded}
      onPress={onToggle}
      style={[styles.pill, { backgroundColor: TINT[priority] }]}
    >
      {glyph ? (
        <View style={styles.pillIcon}>
          <Icon
            name={glyph.name}
            size={space.priorityGlyph}
            color={colors.ink}
            style={glyph.flip ? styles.flipped : null}
          />
        </View>
      ) : null}
      <Text style={styles.pillLabel}>{`${PRIORITY_LABEL[priority]} (${count})`}</Text>
      <Icon name="chevronUp" size={16} color={colors.ink} style={[styles.chevron, expanded && styles.flipped]} />
    </Pressable>
  );
}

export function TodoScreen({ onQuickAdd, onSettings }: { onQuickAdd: () => void; onSettings?: () => void }) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({ done: true });
  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.page}>
      <TodayHeader onAdd={onQuickAdd} onSettings={onSettings} menuGlyph="dotsVertical" menuLabel="More options" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="To-do list"
      >
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={styles.title}>
            To-do
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Add to-do" onPress={onQuickAdd} hitSlop={10} style={styles.titleAdd}>
            <Icon name="plusThin" size={14.2} lineHeight={14.6} color={colors.plusInk} />
          </Pressable>
        </View>

        {PRIORITY_ORDER.map((priority, index) => {
          const isCollapsed = collapsed[priority] === true;
          return (
            <View key={priority} style={[styles.section, index === 0 && styles.firstSection]}>
              <PriorityPill
                priority={priority}
                count={0}
                expanded={!isCollapsed}
                onToggle={() => toggle(priority)}
              />
              {isCollapsed ? null : (
                <DashedAddCard
                  copy={PRIORITY_HINT[priority]}
                  label={`Add to-do to ${PRIORITY_LABEL[priority]}`}
                  onPress={onQuickAdd}
                  height={space.priorityCardHeight}
                />
              )}
            </View>
          );
        })}

        <View style={styles.section}>
          <PriorityPill priority="done" count={0} expanded={collapsed.done !== true} onToggle={() => toggle('done')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: space.navHeight + space.navBottom + 24 },
  titleRow: {
    marginTop: space.todoTitleTop,
    height: space.todoTitleHeight,
    paddingLeft: space.todoTitleLeft,
    justifyContent: 'center',
  },
  title: { ...typo.dateTitle, lineHeight: space.todoTitleHeight, color: colors.ink },
  titleAdd: {
    position: 'absolute',
    left: space.todoTitleAddLeft,
    top: space.todoTitleAddTop,
    width: 18.4,
    height: 18.4,
    borderRadius: 9.2,
    backgroundColor: colors.sheet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginTop: space.priorityCardToNext, paddingHorizontal: space.page },
  firstSection: { marginTop: space.priorityFirstSection },
  pill: {
    height: space.priorityPillHeight,
    borderRadius: space.priorityPillHeight / 2,
    paddingHorizontal: space.priorityPillPadX,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  pillIcon: {
    width: space.priorityGlyph,
    marginRight: space.priorityGlyphGap,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: { ...typo.section, color: colors.ink },
  chevron: { marginLeft: space.priorityChevronGap },
  flipped: { transform: [{ rotate: '180deg' }] },
});
