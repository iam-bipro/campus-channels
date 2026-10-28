import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { updateAuthDisplayName } from '../../services/authService';
import { getCurrentUserProfile, updateCurrentUserProfile, UserProfile } from '../../services/dataConnectService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = { onBack?: () => void };

export default function AccountScreen({ onBack }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: '', rollNo: '', department: '', year: '', phone: '', bio: '' });
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUserProfile().then((data) => {
      if (data) {
        setProfile(data);
        setForm({ name: data.name, rollNo: data.rollNo, department: data.department, year: String(data.year || ''), phone: data.phone || '', bio: data.bio || '' });
      }
    }).catch(() => setStatus('We could not load your profile. Please try again.'));
  }, []);

  const save = async () => {
    if (!profile || !form.name.trim()) {
      setStatus('Enter your name before saving.');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      await updateCurrentUserProfile({ id: profile.id, name: form.name, rollNo: form.rollNo, department: form.department, year: Number(form.year) || 0, phone: form.phone, bio: form.bio, photoUrl: profile.photoUrl });
      await updateAuthDisplayName(form.name);
      setStatus('Profile updated successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.iconButton}><Ionicons color={colors.ink} name="arrow-back" size={24} /></Pressable>
        <Text style={styles.headerTitle}>Your account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}><Ionicons color={colors.primary} name="person-outline" size={35} /></View>
        <Text style={styles.title}>Edit your profile</Text>
        <Text style={styles.subtitle}>Keep your college details up to date.</Text>
        {profile ? (
          <>
            <Field label="Full name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
            <Field label="Roll number" value={form.rollNo} onChangeText={(rollNo) => setForm({ ...form, rollNo })} />
            <Field label="Department" value={form.department} onChangeText={(department) => setForm({ ...form, department })} />
            <Field label="Year" keyboardType="numeric" value={form.year} onChangeText={(year) => setForm({ ...form, year })} />
            <Field label="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(phone) => setForm({ ...form, phone })} />
            <Field label="Bio" multiline value={form.bio} onChangeText={(bio) => setForm({ ...form, bio })} />
            {!!status && <Text style={styles.status}>{status}</Text>}
            <Pressable accessibilityRole="button" disabled={saving} onPress={save} style={({ pressed }) => [styles.button, pressed && styles.pressed, saving && styles.disabled]}>
              {saving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Save changes</Text>}
            </Pressable>
          </>
        ) : <ActivityIndicator color={colors.primary} size="large" />}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, multiline, ...props }: { label: string; multiline?: boolean } & React.ComponentProps<typeof TextInput>) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} multiline={multiline} placeholder={`Enter ${label.toLowerCase()}`} placeholderTextColor="#9AAAC3" style={[styles.input, multiline && styles.multiline]} /></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  header: { alignItems: 'center', backgroundColor: colors.white, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 68, paddingHorizontal: spacing.md },
  iconButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  headerTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', marginLeft: spacing.sm },
  content: { alignItems: 'center', padding: spacing.xl },
  avatar: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 42, height: 84, justifyContent: 'center', width: 84 },
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: colors.body, fontSize: 15, marginTop: spacing.sm, textAlign: 'center' },
  field: { width: '100%', maxWidth: 520, marginTop: spacing.md },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700', marginBottom: 7 },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: 52, paddingHorizontal: spacing.md },
  multiline: { minHeight: 100, paddingTop: spacing.md, textAlignVertical: 'top' },
  status: { color: colors.primaryDark, fontSize: 14, marginTop: spacing.md, textAlign: 'center' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, justifyContent: 'center', marginTop: spacing.lg, minHeight: 56, maxWidth: 520, width: '100%' },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
});
