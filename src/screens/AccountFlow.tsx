import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from '../components/Icon';
import { account, colors, fonts, type as typo } from '../tokens';

type Step = 'signUp' | 'profile' | 'notify';

interface Props {
  onClose: () => void;
  onDone: (name: string) => void;
}

function useBackSteps(depth: number, onBack: () => void) {
  const back = React.useRef(onBack);
  back.current = onBack;
  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
    window.history.pushState({ accountStep: depth }, '');
    const onPop = () => back.current();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') window.history.back();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
    };
  }, [depth]);
}

export function AccountFlow({ onClose, onDone }: Props) {
  const [step, setStep] = React.useState<Step>('signUp');
  const [name, setName] = React.useState('');
  const depth = step === 'signUp' ? 1 : step === 'profile' ? 2 : 3;
  useBackSteps(depth, () => {
    if (step === 'notify') setStep('profile');
    else if (step === 'profile') setStep('signUp');
    else onClose();
  });

  return (
    <View style={styles.page} role="dialog" aria-modal>
      {step === 'signUp' ? <SignUp onContinue={() => setStep('profile')} /> : null}
      {step === 'profile' ? <CreateProfile name={name} onChange={setName} onSave={() => setStep('notify')} /> : null}
      {step === 'notify' ? <NotifyChoice onContinue={() => onDone(name.trim())} /> : null}
    </View>
  );
}

function SignUp({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={styles.signUpBlock}>
      <Text accessibilityRole="header" style={styles.signUpTitle}>
        {'Sign up to start\nplanning with Tiimo'}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Continue with Google" onPress={onContinue} style={[styles.wideButton, styles.darkButton, styles.firstButton]}>
        <Text style={styles.darkLabel}>Continue with Google</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Sign up with email" onPress={onContinue} style={[styles.wideButton, styles.softButton, styles.nextButton]}>
        <Text style={styles.softLabel}>Sign up with email</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Already have an account? Log in here" onPress={onContinue} style={styles.loginRow}>
        <Text style={styles.loginText}>
          {'Already have an account? '}
          <Text style={styles.underline}>Log in here</Text>
        </Text>
      </Pressable>
    </View>
  );
}

function CreateProfile({ name, onChange, onSave }: { name: string; onChange: (value: string) => void; onSave: () => void }) {
  const [focused, setFocused] = React.useState(false);
  const canSave = name.trim().length > 0;
  return (
    <View style={styles.profileScrim}>
      <View style={styles.profileCard}>
        <Text accessibilityRole="header" style={styles.profileTitle}>
          Create new profile
        </Text>
        <View style={[styles.field, focused && styles.fieldFocused]}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            accessibilityLabel="Name"
            value={name}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={() => (canSave ? onSave() : undefined)}
            autoFocus
            style={styles.fieldInput}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save"
          disabled={!canSave}
          onPress={onSave}
          style={[styles.wideButton, styles.saveButton]}
        >
          <Text style={styles.darkLabel}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const CHOICES = [
  { key: 'no', lead: 'No, thanks', rest: " I'll pass" },
  { key: 'yes', lead: "Yes, I'd like to", rest: ' get offers and updates' },
] as const;

function NotifyChoice({ onContinue }: { onContinue: () => void }) {
  const [choice, setChoice] = React.useState<string | null>(null);
  return (
    <View style={styles.notifyBlock}>
      <Text accessibilityRole="header" style={styles.notifyTitle}>
        Notify me on updates and offers
      </Text>
      {CHOICES.map((c, index) => {
        const on = choice === c.key;
        return (
          <Pressable
            key={c.key}
            accessibilityRole="radio"
            accessibilityLabel={`${c.lead}${c.rest}`}
            aria-checked={on}
            onPress={() => setChoice(c.key)}
            style={[styles.option, index > 0 && styles.optionNext]}
          >
            <Text style={styles.optionText}>
              <Text style={styles.optionLead}>{c.lead}</Text>
              {c.rest}
            </Text>
            <View style={[styles.radio, on && styles.radioOn]}>
              {on ? <Icon name="check" size={15.3} lineHeight={16} color={colors.card} /> : null}
            </View>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue"
        disabled={choice === null}
        onPress={onContinue}
        style={[styles.wideButton, styles.continueButton, choice ? styles.darkButton : styles.idleButton]}
      >
        <Text style={choice ? styles.darkLabel : styles.idleLabel}>Continue</Text>
        <Icon name="arrowRightMdi" size={18.2} color={choice ? colors.card : account.idleInk} />
      </Pressable>
      <Text style={styles.legal}>
        {'By continuing, you agree to our '}
        <Text style={styles.legalLink}>Privacy Policy</Text>
        {' and '}
        <Text style={styles.legalLink}>Terms of Use</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.surface },
  wideButton: {
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  darkButton: { backgroundColor: account.darkFill },
  darkLabel: { ...typo.button, color: colors.card },
  signUpBlock: { position: 'absolute', left: 40, right: 40, bottom: account.signUpBottom },
  signUpTitle: { ...typo.accountTitle, color: colors.ink, textAlign: 'center' },
  firstButton: { marginTop: 30.2 },
  nextButton: { marginTop: 12 },
  softButton: { backgroundColor: colors.cancelFill },
  softLabel: { fontFamily: fonts.regular, fontSize: 14.5, lineHeight: 20, color: colors.ink },
  loginRow: { marginTop: 12, height: 38.2, alignItems: 'center', justifyContent: 'center' },
  loginText: { fontFamily: fonts.bold, fontSize: 14.5, lineHeight: 20, color: colors.ink },
  underline: { textDecorationLine: 'underline' },
  profileScrim: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: account.profileBackdrop },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: account.cardRadius,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24.2,
  },
  profileTitle: { ...typo.profileTitle, color: colors.ink },
  field: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
  },
  fieldFocused: { borderWidth: 1.5 },
  fieldLabel: {
    position: 'absolute',
    top: -8.1,
    left: 2.9,
    paddingHorizontal: 9,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 13.8,
    color: colors.primary,
  },
  fieldInput: { fontFamily: fonts.regular, fontSize: 16, color: colors.ink, paddingHorizontal: 16, height: 46, outlineStyle: 'none' } as object,
  saveButton: { marginTop: 16, backgroundColor: colors.primary },
  notifyBlock: { position: 'absolute', left: 24, right: 24, bottom: account.notifyBottom },
  notifyTitle: { ...typo.notifyTitle, color: colors.ink },
  option: {
    marginTop: 12.1,
    height: 66,
    borderRadius: account.optionRadius,
    borderWidth: 1,
    borderColor: colors.dash,
    paddingLeft: 21.1,
    paddingRight: 21.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionNext: { marginTop: 12.1 },
  optionText: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24, color: colors.ink, flexShrink: 1 },
  optionLead: { fontFamily: fonts.regular, color: colors.primary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: colors.ink },
  continueButton: { marginTop: 23.9, gap: 8 },
  idleButton: { backgroundColor: account.idleFill },
  idleLabel: { ...typo.button, color: account.idleInk },
  legal: { marginTop: 20.1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 16, color: colors.ink, textAlign: 'center' },
  legalLink: { fontFamily: fonts.medium, textDecorationLine: 'underline' },
});
