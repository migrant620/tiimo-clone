import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RepeatOption, Tab, Task, TimeOfDay, TimerState } from './model';
import { DEFAULT_MARKER, DEFAULT_REPEAT, validDurationMinutes, validTimerDeadline } from './model';
import { isoOf } from './date';

const EMPTY_TIMER: TimerState = {
  taskId: null,
  remainingSec: 0,
  totalSec: 0,
  running: false,
  endsAt: null,
  startedAt: null,
};

let sequence = 0;
const nextId = () => `t${(sequence += 1)}`;

function seedTasks(): Task[] {
  return [];
}

export function useTiimoState() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [timer, setTimer] = useState<TimerState>(EMPTY_TIMER);
  const [tab, setTab] = useState<Tab>('today');

  useEffect(() => {
    if (!timer.running || timer.endsAt === null) return;
    const id = setInterval(() => {
      setTimer((prev) => {
        if (!prev.running || prev.endsAt === null) return prev;
        const remaining = Math.min(prev.totalSec, Math.max(0, Math.round((prev.endsAt - Date.now()) / 1000)));
        return { ...prev, remainingSec: remaining, running: remaining > 0, endsAt: remaining > 0 ? prev.endsAt : null };
      });
    }, 250);
    return () => clearInterval(id);
  }, [timer.running, timer.endsAt]);

  const createTask = useCallback(
    (
      title: string,
      durationMin: number,
      timeOfDay: TimeOfDay,
      repeat: RepeatOption = DEFAULT_REPEAT,
      notes?: string,
      date: string = isoOf(new Date()),
    ) => {
      const clean = title.trim();
      if (!clean || !validDurationMinutes(durationMin)) return;
      const task: Task = {
        id: nextId(),
        title: clean,
        durationMin,
        timeOfDay,
        repeat,
        date,
        done: false,
        marker: DEFAULT_MARKER,
        ...(notes ? { notes } : null),
      };
      setTasks((prev) => [...prev, task]);
      return task;
    },
    [],
  );

  const updateTask = useCallback((id: string, patch: Partial<Omit<Task, 'id'>>) => {
    if (patch.durationMin !== undefined && !validDurationMinutes(patch.durationMin)) return;
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }, []);

  const setCompleted = useCallback((id: string, done: boolean) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done } : task)));
    setTimer((prev) => (prev.taskId === id ? EMPTY_TIMER : prev));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setTimer((prev) => (prev.taskId === id ? EMPTY_TIMER : prev));
  }, []);

  const startFocus = useCallback(
    (value: string | Task) => {
      const task = typeof value === 'string' ? tasks.find((item) => item.id === value) : value;
      if (!task) return;
      const startedAt = Date.now();
      if (!validDurationMinutes(task.durationMin, startedAt)) return;
      const remainingSec = task.durationMin * 60;
      setTimer({
        taskId: task.id,
        remainingSec,
        totalSec: remainingSec,
        running: true,
        endsAt: startedAt + remainingSec * 1000,
        startedAt,
      });
      setTab('focus');
    },
    [tasks],
  );

  const toggleTimer = useCallback(() => {
    setTimer((prev) => {
      if (prev.taskId === null) return prev;
      if (prev.running) {
        const remainingSec = prev.endsAt === null
          ? prev.remainingSec
          : Math.min(prev.totalSec, Math.max(0, Math.round((prev.endsAt - Date.now()) / 1000)));
        return { ...prev, remainingSec, running: false, endsAt: null };
      }
      if (prev.remainingSec <= 0) return prev;
      const resumedAt = Date.now();
      if (!validTimerDeadline(resumedAt, prev.remainingSec)) return prev;
      const endsAt = resumedAt + prev.remainingSec * 1000;
      return { ...prev, running: true, endsAt };
    });
  }, []);

  const activeTask = useMemo(
    () => (timer.taskId === null ? null : tasks.find((task) => task.id === timer.taskId) ?? null),
    [timer.taskId, tasks],
  );

  return {
    tasks,
    timer,
    activeTask,
    tab,
    setTab,
    createTask,
    updateTask,
    setCompleted,
    deleteTask,
    startFocus,
    toggleTimer,
  };
}
