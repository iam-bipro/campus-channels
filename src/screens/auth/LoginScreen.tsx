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
import { hasApprovedCommunity, loginWithEmail, loginWithGoogle } from '../../services/authService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type LoginScreenProps = {
  onAuthenticated?: (hasCommunity: boolean) => void;
  onJoinNow?: () => void;
};

export default function LoginScreen({ onAuthenticated, onJoinNow }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email or college ID and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginWithEmail(email, password);
      onAuthenticated?.(await hasApprovedCommunity());
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
      const message = code === 'auth/configuration-not-found'
        ? 'Firebase Authentication is not enabled yet. In Firebase Console, open Authentication, click Get started, enable Email/Password, and try again.'
        : error instanceof Error ? error.message : 'Unable to log in right now.';
      Alert.alert('Login failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.background}>
      <View pointerEvents="none" style={styles.decorations}>
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowRight]} />
        <View style={[styles.cloud, styles.cloudLeft]} />
        <View style={[styles.cloud, styles.cloudRight]} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
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
            <Text style={styles.brandName}>
              Campus <Text style={styles.brandAccent}>Channels</Text>
            </Text>
            <Text style={styles.tagline}>Your College. Your Community.</Text>
            <Text style={styles.tagline}>Real People. Real Updates.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Sign in to your college community</Text>

            <View style={styles.input}>
              <Ionicons color="#6480A8" name="mail-outline" size={24} />
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email or College ID"
                placeholderTextColor="#8CA0BF"
                style={styles.inputText}
                value={email}
              />
            </View>

            <View style={styles.input}>
              <Ionicons color="#6480A8" name="lock-closed-outline" size={24} />
              <TextInput
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#8CA0BF"
                secureTextEntry={!showPassword}
                style={styles.inputText}
                value={password}
              />
              <Pressable
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                accessibilityRole="button"
                hitSlop={10}
                onPress={() => setShowPassword((visible) => !visible)}
              >
                <Ionicons
                  color="#6480A8"
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                />
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleLogin}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Log In</Text>
                  <Ionicons color={colors.white} name="arrow-forward" size={25} />
                </>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={async () => {
                try {
                  setIsSubmitting(true);
                  await loginWithGoogle();
                  onAuthenticated?.(await hasApprovedCommunity());
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'Unable to continue with Google.';
                  Alert.alert('Google sign-in failed', message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </>
              )}
            </Pressable>

            <View style={styles.joinRow}>
              <Text style={styles.joinPrompt}>Don’t have an account? </Text>
              <Pressable accessibilityRole="button" onPress={onJoinNow}>
                <Text style={styles.joinLink}>Join Now</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.features}>
            {[
              ['people-outline', 'Visible\nMembers'],
              ['shield-checkmark-outline', 'Approval\nto Join'],
              ['notifications-outline', 'Push\nNotifications'],
              ['document-text-outline', 'Organized\nSharing'],
            ].map(([icon, label]) => (
              <View key={label} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons color={colors.primary} name={icon as never} size={24} />
                </View>
                <Text style={styles.featureText}>{label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footer}>— Built for students, by students —</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  flex: { flex: 1 },
  background: { flex: 1, backgroundColor: colors.canvas },
  decorations: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  glow: { backgroundColor: '#DDE8FF', borderRadius: 999, position: 'absolute' },
  glowTop: { height: 360, left: -150, top: -190, width: 360 },
  glowRight: { height: 420, right: -230, top: 220, width: 420 },
  cloud: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    height: 80,
    position: 'absolute',
    width: 220,
  },
  cloudLeft: { bottom: 86, left: -120 },
  cloudRight: { bottom: 120, right: -130 },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : 30,
    paddingBottom: spacing.xl,
  },
  header: { alignItems: 'center', marginBottom: spacing.lg },
  logoMark: { height: 88, justifyContent: 'flex-end', marginBottom: 8, width: 116 },
  logoCap: { alignItems: 'center', left: 18, position: 'absolute', top: 0, width: 80 },
  capTop: {
    backgroundColor: '#214B8D',
    height: 30,
    transform: [{ rotate: '10deg' }, { skewX: '-20deg' }],
    width: 76,
  },
  capBase: { backgroundColor: '#2A61B5', borderRadius: 12, height: 25, marginTop: -4, width: 48 },
  chatBubble: {
    alignItems: 'center',
    backgroundColor: '#3479ED',
    borderRadius: 18,
    bottom: 0,
    height: 55,
    justifyContent: 'center',
    left: 29,
    position: 'absolute',
    width: 72,
  },
  chatDots: { flexDirection: 'row', gap: 6 },
  dot: { backgroundColor: colors.white, borderRadius: 5, height: 10, width: 10 },
  brandName: { ...typography.brand, letterSpacing: -1.5 },
  brandAccent: { color: '#4172EA' },
  tagline: { ...typography.body, fontSize: 16, lineHeight: 23 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 28,
    maxWidth: 660,
    padding: spacing.xl,
    shadowColor: '#6A8DD1',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    width: '100%',
  },
  title: { ...typography.title, alignSelf: 'center' },
  subtitle: { ...typography.body, alignSelf: 'center', marginTop: 7, marginBottom: spacing.lg },
  input: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 66,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  inputText: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.ink,
    flex: 1,
    fontSize: 17,
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 17,
    flexDirection: 'row',
    height: 66,
    justifyContent: 'center',
    marginTop: 3,
  },
  primaryButtonText: { color: colors.white, fontSize: 18, fontWeight: '700', marginRight: 13 },
  pressed: { opacity: 0.82 },
  dividerRow: { alignItems: 'center', flexDirection: 'row', marginVertical: spacing.md },
  divider: { backgroundColor: colors.border, flex: 1, height: 1 },
  or: { color: colors.body, fontSize: 15, marginHorizontal: spacing.md },
  googleButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 17,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 62,
    justifyContent: 'center',
  },
  googleG: { color: '#4285F4', fontSize: 23, fontWeight: '800', marginRight: spacing.sm },
  googleText: { color: '#4661CC', fontSize: 17, fontWeight: '700' },
  joinRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  joinPrompt: { color: colors.body, fontSize: 15 },
  joinLink: { color: '#3159B8', fontSize: 15, fontWeight: '800' },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    maxWidth: 660,
    width: '100%',
  },
  feature: { alignItems: 'center', flex: 1 },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: '#EAF0FF',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 7,
    width: 48,
  },
  featureText: { color: colors.ink, fontSize: 12, fontWeight: '600', lineHeight: 16, textAlign: 'center' },
  footer: { color: '#7991B6', fontSize: 14, marginTop: spacing.lg },
});
