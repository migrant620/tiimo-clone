import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { MoonGlyph, SparkleGlyph, SunGlyph, SunriseGlyph } from '../components/Glyphs';
import { Icon } from '../components/Icon';
import { emojiFamily } from '../emojiFont';
import { account, colors, fonts, onboarding as ob, type as typo } from '../tokens';


export const NEED_PAGE = {
  title: 'What’s your biggest need right now?',
  body: 'To give you the best start, we’d love to know what you most need help with in your daily life.',
  options: [
    'Organize My Day and Time',
    'Remember My Tasks',
    'Prioritize To-Do’s',
    'Build and Stick to Routines',
    'Support Focus Work',
    'Something else',
  ],
};

export const ND_PAGE = {
  title: 'Are you neurodivergent?',
  body: 'Tiimo helps you stay focused and plan your day with ease. Which of these feels most like you?',
  options: ['I am neurodivergent', 'I think I am neurodivergent', 'I am not neurodivergent', "I don't know"],
};

export type Daypart = 'morning' | 'afternoon' | 'evening';

export const ROUTINE_PAGES: Record<Daypart, { tag: string; title: string; body: string; chips: Array<[string, string]> }> = {
  morning: {
    tag: 'MORNING',
    title: 'Start your day with strong habits',
    body: 'Pick the routines that energize your day.',
    chips: [
      ['\u{1F305}', 'Wake up'],
      ['\u{1F9CE}\u{1F3FC}‍♀️', 'Morning prayer'],
      ['\u{1F6CC}', 'Make bed'],
      ['\u{1FAA5}', 'Brush teeth'],
      ['\u{1F4A7}', 'Drink water'],
      ['\u{1F48A}', 'Take meds'],
      ['\u{1F6C0}\u{1F3FB}', 'Shower'],
      ['\u{1F457}', 'Get dressed'],
      ['\u{1F373}', 'Breakfast'],
      ['☕', 'Have coffee'],
      ['\u{1F4DD}', 'Plan your day'],
      ['\u{1F9F9}', 'Quick tidy'],
      ['\u{1F68C}', 'Commute to work'],
    ],
  },
  afternoon: {
    tag: 'AFTERNOON',
    title: 'Choose the habits that make your day flow',
    body: 'Balance work, health, and personal time with ease.',
    chips: [
      ['\u{1F4DD}', 'Plan your day'],
      ['\u{1F4DA}', 'Study'],
      ['\u{1F468}\u{1F3FB}‍\u{1F4BB}', 'Start work'],
      ['\u{1F4EA}', 'Check emails'],
      ['\u{1F3A7}', 'Deep work'],
      ['\u{1F32F}', 'Lunch'],
      ['☕', 'Coffee break'],
      ['\u{1F4A7}', 'Drink water'],
      ['\u{1F4AA}\u{1F3FB}', 'Workout'],
      ['\u{1F476}\u{1F3FC}', 'Pick up kids'],
      ['\u{1F96B}', 'Grocery shopping'],
      ['\u{1F49C}', 'Socialize'],
      ['\u{1F68C}', 'Commute home'],
    ],
  },
  evening: {
    tag: 'EVENING',
    title: 'End your day with recharging habits',
    body: 'Add the routines that help you relax and sleep better.',
    chips: [
      ['\u{1F959}', 'Have dinner'],
      ['\u{1F3CB}\u{1F3FC}‍♂️', 'Workout'],
      ['\u{1F9D8}\u{1F3FC}‍♀️', 'Yoga'],
      ['\u{1F4DA}', 'Homework'],
      ['\u{1F9F9}', 'Quick tidy'],
      ['\u{1F9FA}', 'Do laundry'],
      ['\u{1F6C0}\u{1F3FB}', 'Take a shower'],
      ['\u{1F9CE}\u{1F3FC}‍♀️', 'Evening prayer'],
      ['\u{1F4DD}', 'Journal'],
      ['\u{1F4FA}', 'Watch TV'],
      ['\u{1F4D6}', 'Read book'],
      ['\u{1F415}', 'Walk the dog'],
      ['☕', 'Drink tea'],
      ['\u{1FAA5}', 'Brush teeth'],
      ['\u{1F971}', 'Go to bed'],
    ],
  },
};

const FIRST_ROW: Record<Daypart, number> = { morning: 2, afternoon: 3, evening: 3 };

const TAG_TINT: Record<Daypart, string> = {
  morning: colors.morningPill,
  afternoon: colors.afternoonPill,
  evening: colors.eveningPill,
};
const TAG_GLYPH: Record<Daypart, (props: { size?: number; color?: string }) => React.ReactElement> = {
  morning: SunriseGlyph,
  afternoon: SunGlyph,
  evening: MoonGlyph,
};


function StepBar({ step }: { step: number }) {
  return (
    <View
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={ob.barSteps}
      aria-valuenow={step}
      accessibilityLabel="Setup progress"
      style={styles.bar}
    >
      <View style={[styles.barFill, { width: (ob.barWidth * step) / ob.barSteps }]} />
    </View>
  );
}

function SkipButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Skip" onPress={onPress} style={styles.skip}>
      <Text style={styles.skipLabel}>Skip</Text>
    </Pressable>
  );
}

function BottomButton({ label, enabled, onPress }: { label: string; enabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!enabled}
      onPress={onPress}
      style={[styles.wide, styles.cta, enabled ? styles.dark : styles.idle]}
    >
      <Text style={enabled ? styles.darkLabel : styles.idleLabel}>{label}</Text>
    </Pressable>
  );
}


export function WelcomePage({ onStart, onLogIn }: { onStart: () => void; onLogIn: () => void }) {
  return (
    <View style={styles.fill}>
      <View style={styles.wash} aria-hidden>
        <Svg width="100%" height={ob.washBottom}>
          <Defs>
            <LinearGradient id="welcomeWash" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.surface} />
              <Stop offset="1" stopColor={ob.washTo} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height={ob.washBottom} fill="url(#welcomeWash)" />
        </Svg>
      </View>
      <View style={styles.welcomeBlock}>
        <Text accessibilityRole="header" style={styles.welcomeTitle}>
          {'All-in-one planning\nand productivity'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get started"
          onPress={onStart}
          style={[styles.wide, styles.dark, styles.welcomeButton]}
        >
          <Text style={styles.darkLabel}>Get started</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Already have an account? Log in here"
          onPress={onLogIn}
          style={styles.loginRow}
        >
          <Text style={styles.loginText}>
            {'Already have an account? '}
            <Text style={styles.underline}>Log in here</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function QuestionPage({
  step,
  title,
  body,
  options,
  onContinue,
}: {
  step: number;
  title: string;
  body: string;
  options: string[];
  onContinue: () => void;
}) {
  const [choice, setChoice] = React.useState<string | null>(null);
  return (
    <View style={styles.fill}>
      <StepBar step={step} />
      <View style={styles.questionBlock}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.options} role="radiogroup" accessibilityLabel={title}>
          {options.map((option, index) => {
            const on = choice === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityLabel={option}
                aria-checked={on}
                onPress={() => setChoice(option)}
                style={[styles.wide, styles.option, index > 0 && styles.optionNext, on && styles.dark]}
              >
                <Text style={on ? styles.darkLabel : styles.optionLabel}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <BottomButton label="Continue" enabled={choice !== null} onPress={onContinue} />
    </View>
  );
}

export function InterludePage({ text, top, onDone }: { text: string; top: number; onDone: () => void }) {
  const done = React.useRef(onDone);
  done.current = onDone;
  React.useEffect(() => {
    const t = setTimeout(() => done.current(), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={text} onPress={onDone} style={styles.fill}>
      <Text style={[styles.interlude, { top }]}>{text}</Text>
    </Pressable>
  );
}

export function RoutinePage({ part, step, onNext }: { part: Daypart; step: number; onNext: () => void }) {
  const page = ROUTINE_PAGES[part];
  const Glyph = TAG_GLYPH[part];
  const [picked, setPicked] = React.useState<Record<string, boolean>>({});
  const count = Object.values(picked).filter(Boolean).length;
  const toggle = (label: string) => setPicked((prev) => ({ ...prev, [label]: !prev[label] }));
  const suggest = () =>
    setPicked((prev) => {
      const next = { ...prev };
      page.chips.slice(0, FIRST_ROW[part]).forEach(([, label]) => {
        next[label] = true;
      });
      return next;
    });
  return (
    <View style={styles.fill}>
      <ScrollView style={styles.fill} contentContainerStyle={styles.routineScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.tag, { backgroundColor: TAG_TINT[part] }]}>
          <View style={styles.tagGlyph}>
            <Glyph size={16} color={colors.ink} />
          </View>
          <Text style={styles.tagLabel}>{page.tag}</Text>
        </View>
        <Text accessibilityRole="header" style={[styles.title, styles.routineTitle]}>
          {page.title}
        </Text>
        <Text style={[styles.body, styles.routineBody]}>{page.body}</Text>
        <View style={styles.chips}>
          {page.chips.map(([emoji, label]) => {
            const on = !!picked[label];
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityLabel={label}
                aria-pressed={on}
                onPress={() => toggle(label)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={styles.chipEmoji} aria-hidden>
                  {emoji}
                </Text>
                <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <StepBar step={step} />
      <SkipButton onPress={onNext} />
      <Pressable accessibilityRole="button" accessibilityLabel="Suggest for me" onPress={suggest} style={[styles.wide, styles.suggest]}>
        <SparkleGlyph size={18.2} color={colors.ink} />
        <Text style={styles.optionLabel}>Suggest for me</Text>
      </Pressable>
      <BottomButton label={count > 0 ? 'Continue' : 'Choose at least one to begin'} enabled={count > 0} onPress={onNext} />
    </View>
  );
}

export function NotificationsPage({ step, onNext }: { step: number; onNext: () => void }) {
  return (
    <View style={styles.fill}>
      <StepBar step={step} />
      <SkipButton onPress={onNext} />
      <View style={[styles.questionBlock, { top: ob.notifyTitleTop }]}>
        <Text accessibilityRole="header" style={styles.title}>
          Never miss a task! Turn on notifications
        </Text>
        <Text style={styles.body}>
          Forgetful? We'll nudge you with tailored notifications and reminders, so you can stay on top of even the most
          hectic days.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enable notifications"
        onPress={onNext}
        style={[styles.wide, styles.dark, styles.enable]}
      >
        <Text style={styles.darkLabel}>Enable notifications</Text>
        <Icon name="arrowRightMdi" size={18.2} color={colors.card} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, height: ob.washBottom },
  bar: {
    position: 'absolute',
    top: ob.barTop,
    left: ob.barLeft,
    width: ob.barWidth,
    height: ob.barHeight,
    borderRadius: ob.barHeight / 2,
    backgroundColor: ob.barTrack,
    overflow: 'hidden',
  },
  barFill: { height: ob.barHeight, borderRadius: ob.barHeight / 2, backgroundColor: colors.primary },
  skip: {
    position: 'absolute',
    left: ob.skip[0],
    top: ob.skip[1],
    width: ob.skip[2],
    height: ob.skip[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: { ...typo.button, color: colors.primary },
  wide: { height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  dark: { backgroundColor: account.darkFill, borderWidth: 0 },
  darkLabel: { ...typo.button, color: colors.card },
  idle: { backgroundColor: account.idleFill },
  idleLabel: { ...typo.button, color: account.idleInk },
  cta: { position: 'absolute', left: 22.2, right: 21.8, bottom: ob.ctaBottom },
  welcomeBlock: { position: 'absolute', left: 40, right: 40, bottom: account.signUpBottom },
  welcomeTitle: { ...typo.welcomeTitle, color: colors.ink, textAlign: 'center' },
  welcomeButton: { marginTop: 30.2 },
  loginRow: { marginTop: 12, height: 38.2, alignItems: 'center', justifyContent: 'center' },
  loginText: { fontFamily: fonts.bold, fontSize: 14.5, lineHeight: 20, color: colors.ink },
  underline: { textDecorationLine: 'underline' },
  questionBlock: { position: 'absolute', top: ob.titleTop, left: 22.2, right: 21.8 },
  title: { ...typo.onboardingTitle, color: colors.ink },
  body: { ...typo.onboardingBody, color: colors.ink, marginTop: ob.bodyGap },
  options: { marginTop: ob.optionsGap },
  option: { backgroundColor: colors.card, borderWidth: 1, borderColor: ob.optionBorder },
  optionNext: { marginTop: ob.optionGap },
  optionLabel: { ...typo.button, color: colors.ink },
  interlude: { ...typo.interlude, color: colors.ink, textAlign: 'center', position: 'absolute', left: 21.8, right: 22.2 },
  routineScroll: { paddingTop: ob.tagTop, paddingBottom: ob.suggestBottom + 52 },
  tag: {
    alignSelf: 'flex-start',
    marginLeft: ob.tagLeft,
    height: ob.tagHeight,
    borderRadius: ob.tagRadius,
    paddingLeft: ob.tagLabelLeft,
    paddingRight: ob.tagRight,
    justifyContent: 'center',
  },
  tagGlyph: { position: 'absolute', left: 14.4, top: 0, bottom: 0, justifyContent: 'center' },
  tagLabel: { ...typo.smallCaps, color: colors.ink },
  routineTitle: { marginTop: ob.routineTitleTop - ob.tagTop - ob.tagHeight, marginHorizontal: 22.2 },
  routineBody: { marginHorizontal: 22.2 },
  chips: {
    marginTop: ob.chipsGap,
    paddingHorizontal: ob.chipLeft,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ob.chipGap,
  },
  chip: {
    height: ob.chipHeight,
    borderRadius: ob.chipRadius,
    borderWidth: 1,
    borderColor: ob.chipBorder,
    backgroundColor: colors.card,
    paddingLeft: ob.chipPadLeft - 1,
    paddingRight: ob.chipPadRight - 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipOn: { backgroundColor: account.darkFill, borderColor: account.darkFill },
  chipEmoji: { fontFamily: emojiFamily, width: ob.chipEmoji, fontSize: 14.3, lineHeight: 19.3, textAlign: 'center' },
  chipLabel: { ...typo.routineChip, color: colors.ink, marginLeft: ob.chipLabelGap },
  chipLabelOn: { color: colors.card },
  suggest: {
    position: 'absolute',
    left: 23.3,
    right: 22.6,
    bottom: ob.suggestBottom,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: ob.optionBorder,
    gap: 7.6,
  },
  enable: { position: 'absolute', left: 24, right: 24, bottom: ob.enableBottom, gap: 8.4 },
});
