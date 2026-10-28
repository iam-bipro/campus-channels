import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { loginWithGoogle, registerWithEmail, resendVerificationEmail } from '../../services/authService';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type SignUpScreenProps = {
  onAuthenticated?: () => void;
  onLogin?: () => void;
};

const steps = ['Basic Info', 'College Details', 'Profile', 'Done'];

export default function SignUpScreen({ onAuthenticated, onLogin }: SignUpScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleContinue = () => {
    if (step === steps.length - 1) {
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleCreateAccount = async () => {
    setSubmitMessage('');
    setSubmitError('');
    try {
      setIsSubmitting(true);
      await registerWithEmail({ name: fullName, email, password, rollNo, department, year, phone, bio });
      setVerificationSent(true);
      setSubmitMessage(`Verification email sent to ${email.trim()}. Open the link in that email, then use Log In.`);
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
      const message = code === 'auth/email-already-in-use'
        ? 'This email is already registered. Please log in instead.'
        : code === 'auth/configuration-not-found'
          ? 'Firebase Authentication is not enabled yet. In Firebase Console, open Authentication, click Get started, enable Email/Password, and try again.'
          : error instanceof Error ? error.message : 'Unable to create your account.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.decorations}>
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowRight]} />
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View style={styles.logoMark}>
              <View style={styles.logoCap}>
                <View style={styles.capTop} />
                <View style={styles.capBase} />
              </View>
              <View style={styles.chatBubble}>
                <View style={styles.chatDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            </View>
            <View>
              <Text style={styles.brandName}>Campus <Text style={styles.brandAccent}>Channels</Text></Text>
              <Text style={styles.tagline}>Your College. Your Community.</Text>
              <Text style={styles.tagline}>Real People. Real Updates.</Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.introTitle}>Create Your{'\n'}<Text style={styles.introAccent}>Account</Text></Text>
            <Text style={styles.introBody}>Join your college community and{'\n'}stay connected with what matters.</Text>
          </View>

          <View style={styles.steps}>
            {steps.map((stepName, index) => (
              <React.Fragment key={stepName}>
                <View style={styles.step}>
                  <View style={[styles.stepCircle, index <= step && styles.stepCircleActive]}>
                    <Text style={[styles.stepNumber, index <= step && styles.stepNumberActive]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepLabel, index <= step && styles.stepLabelActive]}>{stepName}</Text>
                </View>
                {index < steps.length - 1 && <View style={styles.stepLine} />}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.card}>
            {step === 0 && (
              <>
                <Field icon="person-outline" label="Full Name" onChangeText={setFullName} placeholder="Enter your full name" value={fullName} />
                <Field autoCapitalize="none" icon="mail-outline" keyboardType="email-address" label="Email Address" onChangeText={setEmail} placeholder="you@college.edu" value={email} />
                <Field autoCapitalize="none" icon="lock-closed-outline" label="Password" onChangeText={setPassword} onToggleVisibility={() => setShowPassword((visible) => !visible)} placeholder="Create a strong password" secureTextEntry={!showPassword} value={password} visible={showPassword} />
                <Field icon="phone-portrait-outline" keyboardType="phone-pad" label="Phone Number (Optional)" onChangeText={setPhone} placeholder="+91 98765 43210" value={phone} />
              </>
            )}

            {step === 1 && (
              <>
                <Text style={styles.sectionTitle}>Tell us about your college</Text>
                <Text style={styles.sectionBody}>This helps organize your campus community and keep it private.</Text>
                <Field icon="card-outline" label="Roll Number" onChangeText={setRollNo} placeholder="Enter your roll number" value={rollNo} />
                <Field icon="school-outline" label="Department" onChangeText={setDepartment} placeholder="e.g. Computer Science" value={department} />
                <Field icon="calendar-outline" label="Year of Study" onChangeText={setYear} placeholder="e.g. 2nd Year" value={year} />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.sectionTitle}>Complete your profile</Text>
                <Text style={styles.sectionBody}>Add a short introduction so classmates know who you are.</Text>
                <View style={styles.avatarPicker}>
                  <View style={styles.avatarCircle}><Ionicons color={colors.primary} name="person-outline" size={34} /></View>
                  <View>
                    <Text style={styles.avatarTitle}>Add a profile photo</Text>
                    <Text style={styles.avatarBody}>You can add one later from settings.</Text>
                  </View>
                </View>
                <View style={styles.bioField}>
                  <Text style={styles.fieldLabel}>Short Bio</Text>
                  <TextInput
                    multiline
                    onChangeText={setBio}
                    placeholder="Tell your campus community about yourself"
                    placeholderTextColor="#A1B2CB"
                    style={styles.bioInput}
                    textAlignVertical="top"
                    value={bio}
                  />
                </View>
              </>
            )}

            {step === 3 && (
              <View style={styles.doneState}>
                <View style={styles.doneIcon}><Ionicons color="#28A56A" name="checkmark" size={42} /></View>
                <Text style={styles.sectionTitle}>You’re all set, {fullName || 'student'}!</Text>
                <Text style={styles.sectionBody}>Your account details are ready. Submit to join your college community.</Text>
                <View style={styles.summary}>
                  <SummaryRow label="Email" value={email} />
                  <SummaryRow label="Roll Number" value={rollNo} />
                  <SummaryRow label="Department" value={department} />
                  <SummaryRow label="Year" value={year} />
                </View>
              </View>
            )}

            <View style={styles.navigationRow}>
              {step > 0 ? (
                <Pressable accessibilityRole="button" onPress={handleBack} style={styles.backButton}>
                  <Ionicons color={colors.primary} name="arrow-back" size={21} />
                  <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
              ) : <View />}
              <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={step === steps.length - 1 ? handleCreateAccount : handleContinue} style={({ pressed }) => [styles.primaryButton, styles.continueButton, pressed && styles.pressed]}>
                {isSubmitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>{step === steps.length - 1 ? 'Create Account' : 'Continue'}</Text>}
                {!isSubmitting && <Ionicons color={colors.white} name={step === steps.length - 1 ? 'checkmark' : 'arrow-forward'} size={25} />}
              </Pressable>
            </View>

            {!!submitMessage && <View style={styles.successBanner}><Ionicons color="#188A54" name="mail-open-outline" size={20} /><Text style={styles.successBannerText}>{submitMessage}</Text></View>}
            {!!submitError && <View style={styles.errorBanner}><Ionicons color="#B42318" name="alert-circle-outline" size={20} /><Text style={styles.errorBannerText}>{submitError}</Text></View>}
            {verificationSent && (
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={async () => {
                  try {
                    setIsSubmitting(true);
                    await resendVerificationEmail();
                    setSubmitError('');
                    setSubmitMessage(`A new verification email was requested for ${email.trim()}. Check Inbox, Spam, and Promotions.`);
                  } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'Unable to resend the verification email.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                style={styles.resendButton}
              >
                <Text style={styles.resendButtonText}>Resend verification email</Text>
              </Pressable>
            )}

            {step === 0 && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.or}>OR</Text>
                  <View style={styles.divider} />
                </View>
                <Pressable accessibilityRole="button" onPress={async () => {
                  try {
                    await loginWithGoogle();
                    onAuthenticated?.();
                  } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to continue with Google.';
                    Alert.alert('Google sign-up failed', message);
                  }
                }} style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Sign up with Google</Text>
                </Pressable>
              </>
            )}

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account? </Text>
              <Pressable accessibilityRole="button" onPress={onLogin}><Text style={styles.loginLink}>Log In</Text></Pressable>
            </View>
          </View>

          <View style={styles.features}>
            {[
              ['people-outline', 'Visible Members', 'See who’s in\nthe community'],
              ['shield-checkmark-outline', 'Approval to Join', 'Keeps outsiders\nout'],
              ['notifications-outline', 'Push Notifications', 'Get instant alerts\non your phone'],
              ['folder-open-outline', 'Organized Sharing', 'By department,\nsubject & semester'],
            ].map(([icon, title, description]) => (
              <View key={title} style={styles.feature}>
                <View style={styles.featureIcon}><Ionicons color={colors.primary} name={icon as never} size={24} /></View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureText}>{description}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.footer}>— Built for students, by students —</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

type FieldProps = {
  autoCapitalize?: 'none' | 'sentences';
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  label: string;
  onChangeText: (value: string) => void;
  onToggleVisibility?: () => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  visible?: boolean;
};

function Field({ autoCapitalize = 'sentences', icon, keyboardType = 'default', label, onChangeText, onToggleVisibility, placeholder, secureTextEntry = false, value, visible = false }: FieldProps) {
  return (
    <View style={styles.field}>
      <Ionicons color="#6480A8" name={icon} size={24} />
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput autoCapitalize={autoCapitalize} keyboardType={keyboardType} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#A1B2CB" secureTextEntry={secureTextEntry} style={styles.fieldInput} value={value} />
      </View>
      {onToggleVisibility && <Pressable accessibilityLabel={visible ? 'Hide password' : 'Show password'} accessibilityRole="button" hitSlop={10} onPress={onToggleVisibility}><Ionicons color="#6480A8" name={visible ? 'eye-outline' : 'eye-off-outline'} size={24} /></Pressable>}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value || 'Not provided'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { backgroundColor: colors.canvas, flex: 1 },
  decorations: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  glow: { backgroundColor: '#DDE8FF', borderRadius: 999, position: 'absolute' },
  glowTop: { height: 360, left: -150, top: -190, width: 360 },
  glowRight: { height: 420, right: -230, top: 220, width: 420 },
  cloud: { backgroundColor: 'rgba(255,255,255,0.72)', borderRadius: 999, height: 80, position: 'absolute', width: 220 },
  cloudLeft: { bottom: 86, left: -120 },
  cloudRight: { bottom: 120, right: -130 },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  brandRow: { alignItems: 'center', flexDirection: 'row', marginBottom: spacing.lg, width: '100%' },
  logoMark: { height: 64, marginRight: spacing.sm, width: 76 },
  logoCap: { alignItems: 'center', left: 7, position: 'absolute', top: 0, width: 62 },
  capTop: { backgroundColor: '#214B8D', height: 21, transform: [{ rotate: '10deg' }, { skewX: '-20deg' }], width: 59 },
  capBase: { backgroundColor: '#2A61B5', borderRadius: 8, height: 19, marginTop: -3, width: 37 },
  chatBubble: { alignItems: 'center', backgroundColor: '#3479ED', borderRadius: 13, bottom: 0, height: 39, justifyContent: 'center', left: 20, position: 'absolute', width: 51 },
  chatDots: { flexDirection: 'row', gap: 4 },
  dot: { backgroundColor: colors.white, borderRadius: 4, height: 7, width: 7 },
  brandName: { ...typography.brand, flexShrink: 1, fontSize: 24, letterSpacing: -1 },
  brandAccent: { color: '#4172EA' },
  tagline: { ...typography.body, flexShrink: 1, fontSize: 12, lineHeight: 17 },
  intro: { marginBottom: spacing.lg },
  introTitle: { ...typography.title, fontSize: 36, lineHeight: 39 },
  introAccent: { color: '#3479ED' },
  introBody: { ...typography.body, fontSize: 17, lineHeight: 25, marginTop: spacing.sm },
  steps: { alignItems: 'flex-start', flexDirection: 'row', marginBottom: spacing.lg },
  step: { alignItems: 'center', flex: 1 },
  stepCircle: { alignItems: 'center', backgroundColor: '#E8EEFA', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  stepCircleActive: { backgroundColor: colors.white, borderColor: '#3479ED', borderWidth: 3 },
  stepNumber: { color: '#7991B6', fontSize: 18, fontWeight: '700' },
  stepNumberActive: { color: '#3479ED' },
  stepLabel: { color: colors.body, fontSize: 12, marginTop: 6, textAlign: 'center' },
  stepLabelActive: { color: '#3159B8', fontWeight: '700' },
  stepLine: { backgroundColor: '#D4DDEA', flex: 1, height: 1, marginTop: 24 },
  card: { backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 28, padding: spacing.lg, shadowColor: '#6A8DD1', shadowOffset: { height: 12, width: 0 }, shadowOpacity: 0.14, shadowRadius: 24 },
  field: { alignItems: 'center', borderColor: colors.border, borderRadius: 17, borderWidth: 1.5, flexDirection: 'row', marginBottom: spacing.md, minHeight: 68, paddingHorizontal: spacing.md },
  fieldContent: { flex: 1, marginLeft: spacing.md },
  fieldLabel: { color: '#6E83A5', fontSize: 14, marginBottom: 2 },
  fieldInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.ink,
    fontSize: 17,
    padding: 0,
  },
  sectionTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  sectionBody: { color: colors.body, fontSize: 15, lineHeight: 22, marginBottom: spacing.lg },
  avatarPicker: { alignItems: 'center', backgroundColor: '#F7F9FF', borderRadius: 16, flexDirection: 'row', marginBottom: spacing.md, padding: spacing.md },
  avatarCircle: { alignItems: 'center', backgroundColor: '#E4ECFF', borderRadius: 32, height: 64, justifyContent: 'center', marginRight: spacing.md, width: 64 },
  avatarTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  avatarBody: { color: colors.body, fontSize: 12, marginTop: 4 },
  bioField: { borderColor: colors.border, borderRadius: 17, borderWidth: 1.5, marginBottom: spacing.md, minHeight: 120, padding: spacing.md },
  bioInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.ink,
    fontSize: 16,
    minHeight: 75,
    padding: 0,
  },
  doneState: { alignItems: 'center', paddingVertical: spacing.sm },
  doneIcon: { alignItems: 'center', backgroundColor: '#DDF7EA', borderRadius: 42, height: 84, justifyContent: 'center', marginBottom: spacing.md, width: 84 },
  summary: { backgroundColor: '#F7F9FF', borderRadius: 16, marginBottom: spacing.md, padding: spacing.md, width: '100%' },
  summaryRow: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  summaryLabel: { color: colors.body, fontSize: 14 },
  summaryValue: { color: colors.ink, flexShrink: 1, fontSize: 14, fontWeight: '700', marginLeft: spacing.md, textAlign: 'right' },
  navigationRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 66 },
  backButton: { alignItems: 'center', flexDirection: 'row', padding: spacing.sm },
  backButtonText: { color: colors.primary, fontSize: 16, fontWeight: '700', marginLeft: 6 },
  continueButton: { flex: 1, marginLeft: spacing.sm },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 17, flexDirection: 'row', height: 66, justifyContent: 'center', marginTop: 3 },
  primaryButtonText: { color: colors.white, fontSize: 18, fontWeight: '700', marginRight: 13 },
  pressed: { opacity: 0.82 },
  dividerRow: { alignItems: 'center', flexDirection: 'row', marginVertical: spacing.md },
  divider: { backgroundColor: colors.border, flex: 1, height: 1 },
  or: { color: colors.body, fontSize: 15, marginHorizontal: spacing.md },
  googleButton: { alignItems: 'center', borderColor: colors.border, borderRadius: 17, borderWidth: 1.5, flexDirection: 'row', height: 62, justifyContent: 'center' },
  googleG: { color: '#4285F4', fontSize: 23, fontWeight: '800', marginRight: spacing.sm },
  googleText: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  loginRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  loginPrompt: { color: colors.body, fontSize: 15 },
  loginLink: { color: '#3159B8', fontSize: 15, fontWeight: '800' },
  features: { flexDirection: 'row', marginTop: spacing.xl },
  feature: { alignItems: 'center', flex: 1 },
  featureIcon: { alignItems: 'center', backgroundColor: '#EAF0FF', borderRadius: 24, height: 48, justifyContent: 'center', marginBottom: 7, width: 48 },
  featureTitle: { color: colors.ink, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  featureText: { color: colors.body, fontSize: 10, lineHeight: 14, marginTop: 4, textAlign: 'center' },
  footer: { color: '#7991B6', fontSize: 14, marginTop: spacing.lg, textAlign: 'center' },
  successBanner: { alignItems: 'center', backgroundColor: '#E8F8EF', borderColor: '#A7E0BE', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: spacing.md, padding: spacing.md },
  successBannerText: { color: '#166534', flex: 1, fontSize: 14, lineHeight: 20 },
  errorBanner: { alignItems: 'center', backgroundColor: '#FFF1F0', borderColor: '#F3B4AF', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 10, marginTop: spacing.md, padding: spacing.md },
  errorBannerText: { color: '#9B1C1C', flex: 1, fontSize: 14, lineHeight: 20 },
  resendButton: { alignSelf: 'center', marginTop: spacing.sm, padding: spacing.sm },
  resendButtonText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
