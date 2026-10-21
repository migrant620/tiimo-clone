import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DateHeader } from '../components/DateHeader';
import { SectionPill } from '../components/SectionPill';
import { PlaceholderRow, TaskRow } from '../components/TaskRow';
import { TodayHeader } from '../components/TodayHeader';
import { colors, space } from '../tokens';
import { SECTION_LABEL, SECTION_ORDER } from '../model';
import { addDays, fromIso, isoOf, startOfWeek } from '../date';
import type { Task, TimeOfDay } from '../model';

interface Props {
  now: Date;
  tasks: Task[];
  onOpenMenu: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onQuickAdd: (section: TimeOfDay) => void;
  onSettings?: () => void;
}

export function TodayScreen({ now, tasks, onOpenMenu, onToggleComplete, onQuickAdd, onSettings }: Props) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({ done: true });
  const [selectedIso, setSelectedIso] = React.useState(() => isoOf(now));
  const [weekShift, setWeekShift] = React.useState(0);
  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const weekStart = React.useMemo(() => addDays(startOfWeek(now), weekShift * 7), [now, weekShift]);
  const todayIso = isoOf(now);
  const shiftWeek = (delta: number) => {
    setWeekShift((value) => value + delta);
    setSelectedIso((iso) => isoOf(addDays(fromIso(iso), delta * 7)));
  };
  const backToToday = () => {
    setWeekShift(0);
    setSelectedIso(todayIso);
  };
  const dayTasks = tasks.filter((task) => task.date === selectedIso);
  const activeOf = (section: TimeOfDay) => dayTasks.filter((task) => !task.done && task.timeOfDay === section);
  const done = dayTasks.filter((task) => task.done);

  return (
    <View style={styles.page}>
      <TodayHeader
        onAdd={() => onQuickAdd('anytime')}
        onSettings={onSettings}
        onToday={selectedIso === todayIso ? undefined : backToToday}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Today plan"
      >
        <DateHeader
          weekStart={weekStart}
          selectedIso={selectedIso}
          onSelect={setSelectedIso}
          onWeekShift={shiftWeek}
        />

        {SECTION_ORDER.map((section, index) => {
          const items = activeOf(section);
          const isCollapsed = collapsed[section] === true;
          return (
            <View key={section} style={[styles.section, index === 0 && styles.firstSection]}>
              <SectionPill
                section={section}
                label={SECTION_LABEL[section]}
                count={items.length}
                expanded={!isCollapsed}
                onToggle={() => toggle(section)}
                onAdd={items.length > 0 ? () => onQuickAdd(section) : undefined}
              />
              {isCollapsed ? null : items.length === 0 ? (
                <PlaceholderRow section={section} onQuickAdd={() => onQuickAdd(section)} />
              ) : (
                items.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onOpenMenu={() => onOpenMenu(task)}
                    onToggleComplete={() => onToggleComplete(task)}
                  />
                ))
              )}
            </View>
          );
        })}

        {done.length > 0 ? (
          <View style={styles.section}>
            <SectionPill
              label="DONE"
              count={done.length}
              expanded={!collapsed.done}
              onToggle={() => toggle('done')}
            />
            {collapsed.done
              ? null
              : done.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onOpenMenu={() => onOpenMenu(task)}
                    onToggleComplete={() => onToggleComplete(task)}
                  />
                ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: space.navHeight + space.navBottom + 24 },
  section: { marginTop: space.cardToNextSection, paddingHorizontal: space.page },
  firstSection: { marginTop: space.firstSection },
});
