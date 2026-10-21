import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from './components/BottomNav';
import { TodayScreen } from './screens/TodayScreen';
import { colors, fontFiles, frame } from './tokens';
import { DEFAULT_MARKER, DEFAULT_REPEAT } from './model';
import { addDays, fromIso, isoOf } from './date';
import { useTiimoState } from './useTiimoState';
import { loadEmojiFont } from './emojiFont';
import type { ActionMenuRow, Tab, Task, TimeOfDay } from './model';

const loadFocus = () => import('./screens/FocusScreen');
const loadTodo = () => import('./screens/TodoScreen');
const loadProfile = () => import('./screens/ProfileScreen');
const loadSettings = () => import('./screens/SettingsScreen');
const loadAccount = () => import('./screens/AccountFlow');
const loadUpdate = () => import('./components/UpdateTaskScreen');
const loadCalendar = () => import('./components/CalendarPicker');
const loadQuickCreate = () => import('./components/QuickCreateSheet');
const loadOverlays = () => import('./components/Overlays');
const FocusScreen = React.lazy(() => loadFocus().then((m) => ({ default: m.FocusScreen })));
const TodoScreen = React.lazy(() => loadTodo().then((m) => ({ default: m.TodoScreen })));
const ProfileScreen = React.lazy(() => loadProfile().then((m) => ({ default: m.ProfileScreen })));
const SettingsScreen = React.lazy(() => loadSettings().then((m) => ({ default: m.SettingsScreen })));
const AccountFlow = React.lazy(() => loadAccount().then((m) => ({ default: m.AccountFlow })));
const UpdateTaskScreen = React.lazy(() => loadUpdate().then((m) => ({ default: m.UpdateTaskScreen })));
const CalendarPicker = React.lazy(() => loadCalendar().then((m) => ({ default: m.CalendarPicker })));
const QuickCreateSheet = React.lazy(() => loadQuickCreate().then((m) => ({ default: m.QuickCreateSheet })));
const ActionMenuSheet = React.lazy(() => loadOverlays().then((m) => ({ default: m.ActionMenuSheet })));
const DeleteDialog = React.lazy(() => loadOverlays().then((m) => ({ default: m.DeleteDialog })));

const Deferred = ({ children }: { children: React.ReactNode }) => <React.Suspense fallback={null}>{children}</React.Suspense>;

let prefetched = false;
function prefetch() {
  if (prefetched) return;
  prefetched = true;
  [loadFocus, loadTodo, loadProfile, loadSettings, loadAccount, loadUpdate, loadCalendar, loadQuickCreate, loadOverlays].forEach(
    (load) => {
      load().catch(() => undefined);
    },
  );
}

type Overlay =
  | { kind: 'menu'; task: Task }
  | { kind: 'quickCreate'; section: TimeOfDay }
  | { kind: 'create'; section: TimeOfDay; draft?: Partial<Task> }
  | { kind: 'edit'; task: Task }
  | { kind: 'delete'; task: Task }
  | { kind: 'reschedule'; task: Task };

const NEW_TASK: Task = {
  id: 'draft',
  title: '',
  durationMin: 30,
  timeOfDay: 'anytime',
  repeat: DEFAULT_REPEAT,
  date: isoOf(new Date()),
  done: false,
  marker: DEFAULT_MARKER,
};

function Shell() {
  const state = useTiimoState();
  const insets = useSafeAreaInsets();
  const [overlay, setOverlay] = React.useState<Overlay | null>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [profileName, setProfileName] = React.useState<string | null>(null);
  const now = React.useMemo(() => new Date(), []);
  React.useEffect(() => {
    let done = false;
    const warm = () => {
      if (done) return;
      done = true;
      loadEmojiFont();
      prefetch();
    };
    const t = setTimeout(warm, 8000);
    if (Platform.OS === 'web' && typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(warm, warm);
    } else {
      warm();
    }
    return () => clearTimeout(t);
  }, []);

  const close = () => setOverlay(null);
  const selectTab = (tab: Tab) => {
    setProfileOpen(false);
    setSettingsOpen(false);
    state.setTab(tab);
  };
  const openSettings = () => {
    setProfileOpen(false);
    setSettingsOpen(true);
  };

  const onMenuSelect = (row: ActionMenuRow) => {
    if (overlay?.kind !== 'menu') return;
    const task = overlay.task;
    switch (row) {
      case 'Start task':
        close();
        state.startFocus(task.id);
        break;
      case 'Edit task':
        setOverlay({ kind: 'edit', task });
        break;
      case 'Delete task':
        setOverlay({ kind: 'delete', task });
        break;
      case 'Make a copy':
        close();
        state.createTask(task.title, task.durationMin, task.timeOfDay, task.repeat, task.notes, task.date);
        break;
      case 'Reschedule for tomorrow':
        close();
        state.updateTask(task.id, { date: isoOf(addDays(fromIso(task.date), 1)) });
        break;
      case 'Reschedule for today':
        close();
        state.updateTask(task.id, { date: isoOf(now) });
        break;
      case 'Reschedule task':
        setOverlay({ kind: 'reschedule', task });
        break;
      default:
        close();
        break;
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.stage, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        {!profileOpen && !settingsOpen && state.tab === 'today' ? (
          <TodayScreen
            now={now}
            tasks={state.tasks}
            onOpenMenu={(task) => setOverlay({ kind: 'menu', task })}
            onToggleComplete={(task) => state.setCompleted(task.id, !task.done)}
            onQuickAdd={(section) => setOverlay({ kind: 'quickCreate', section })}
            onSettings={openSettings}
          />
        ) : null}
        {!profileOpen && !settingsOpen && state.tab === 'focus' ? (
          <Deferred><FocusScreen
            task={state.activeTask}
            timer={state.timer}
            onToggleTimer={state.toggleTimer}
            onRingPress={() => {
              if (state.activeTask) setOverlay({ kind: 'edit', task: state.activeTask });
            }}
            onCreateTask={() => setOverlay({ kind: 'create', section: 'anytime' })}
          /></Deferred>
        ) : null}
        {!profileOpen && !settingsOpen && state.tab === 'todo' ? (
          <Deferred><TodoScreen onQuickAdd={() => setOverlay({ kind: 'create', section: 'anytime' })} onSettings={openSettings} /></Deferred>
        ) : null}
        {profileOpen ? <Deferred><ProfileScreen name={profileName} onSignIn={() => setAccountOpen(true)} /></Deferred> : null}
        {settingsOpen ? <Deferred><SettingsScreen onSignIn={() => setAccountOpen(true)} /></Deferred> : null}
        <BottomNav
          active={state.tab}
          onSelect={selectTab}
          onProfile={() => {
            setSettingsOpen(false);
            setProfileOpen(open => !open);
          }}
        />

        {overlay?.kind === 'create' ? (
          <View style={styles.cover} role="dialog" aria-modal>
            <Deferred><UpdateTaskScreen
              heading="New task"
              task={{ ...NEW_TASK, timeOfDay: overlay.section, date: isoOf(now), ...overlay.draft }}
              onSubmit={(patch) => {
                state.createTask(
                  patch.title ?? '',
                  patch.durationMin ?? 30,
                  patch.timeOfDay ?? overlay.section,
                  patch.repeat ?? DEFAULT_REPEAT,
                  patch.notes,
                  patch.date ?? isoOf(now),
                );
                close();
              }}
              onDismiss={close}
              onStart={close}
              onDelete={close}
            /></Deferred>
          </View>
        ) : null}

        {overlay?.kind === 'edit' ? (
          <View style={styles.cover} role="dialog" aria-modal>
            <Deferred><UpdateTaskScreen
              task={overlay.task}
              onSubmit={(patch) => {
                state.updateTask(overlay.task.id, patch);
                close();
              }}
              onDismiss={close}
              onStart={() => {
                const id = overlay.task.id;
                close();
                state.startFocus(id);
              }}
              onDelete={() => setOverlay({ kind: 'delete', task: overlay.task })}
            /></Deferred>
          </View>
        ) : null}
        {accountOpen ? (
          <Deferred><AccountFlow
            onClose={() => setAccountOpen(false)}
            onDone={(name) => {
              setAccountOpen(false);
              setProfileName(name || null);
              setSettingsOpen(false);
              setProfileOpen(true);
            }}
          /></Deferred>
        ) : null}
      </View>

      {overlay?.kind === 'quickCreate' ? (
        <Deferred><QuickCreateSheet
          section={overlay.section}
          onDismiss={close}
          onSubmit={(title, durationMin, timeOfDay, repeat) => {
            state.createTask(title, durationMin, timeOfDay, repeat);
            close();
          }}
          onMore={(title, durationMin, timeOfDay, repeat) =>
            setOverlay({ kind: 'create', section: timeOfDay, draft: { title, durationMin, timeOfDay, repeat } })
          }
        /></Deferred>
      ) : null}
      {overlay?.kind === 'menu' ? (
        <Deferred><ActionMenuSheet task={overlay.task} onSelect={onMenuSelect} onDismiss={close} /></Deferred>
      ) : null}
      {overlay?.kind === 'reschedule' ? (
        <Deferred><CalendarPicker
          value={overlay.task.date}
          onSave={(iso) => {
            state.updateTask(overlay.task.id, { date: iso });
            close();
          }}
          onDismiss={close}
        /></Deferred>
      ) : null}
      {overlay?.kind === 'delete' ? (
        <Deferred><DeleteDialog
          onCancel={close}
          onConfirm={() => {
            state.deleteTask(overlay.task.id);
            close();
          }}
        /></Deferred>
      ) : null}
    </View>
  );
}

if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('grayscale-text')) {
  const style = document.createElement('style');
  style.id = 'grayscale-text';
  style.textContent = '#root > div, [aria-modal="true"] { will-change: transform; }';
  document.head.appendChild(style);
}

const FONT_GRACE_MS = 1200;

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  const [fontGraceOver, setFontGraceOver] = React.useState(false);
  React.useEffect(() => {
    if (fontsLoaded || fontError) return undefined;
    const t = setTimeout(() => setFontGraceOver(true), FONT_GRACE_MS);
    return () => clearTimeout(t);
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError && !fontGraceOver) return null;
  return (
    <SafeAreaProvider>
      <Shell />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sheet, alignItems: 'center' },
  stage: { flex: 1, width: frame.width, maxWidth: '100%', backgroundColor: colors.surface },
  cover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.30)' },
});
