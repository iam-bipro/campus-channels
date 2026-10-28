import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = { onBack?: () => void };

export default function CreateCommunityScreen({ onBack }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [created, setCreated] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const create = () => {
    if (!name.trim()) return;
    setInviteCode(`${name.replace(/\s+/g, '').slice(0, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setCreated(true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.iconButton}><Ionicons color={colors.ink} name="arrow-back" size={24} /></Pressable>
        <Text style={styles.headerTitle}>Create community</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Ionicons color={colors.primary} name="people-circle-outline" size={42} /></View>
        <Text style={styles.title}>{created ? 'Community created' : 'Start a community'}</Text>
        <Text style={styles.description}>{created ? 'Share this invite code with classmates so they can request to join.' : 'Bring your department, club, or study group together.'}</Text>
        {created ? (
          <View style={styles.codeCard}><Text style={styles.codeLabel}>INVITE CODE</Text><Text selectable style={styles.code}>{inviteCode}</Text><Text style={styles.helper}>Your community is ready to share.</Text></View>
        ) : (
          <>
            <TextInput onChangeText={setName} placeholder="Community name" placeholderTextColor="#9AAAC3" style={styles.input} value={name} />
            <TextInput multiline onChangeText={setDescription} placeholder="What is this community about?" placeholderTextColor="#9AAAC3" style={[styles.input, styles.multiline]} value={description} />
            <Pressable accessibilityRole="button" disabled={!name.trim()} onPress={create} style={({ pressed }) => [styles.button, pressed && styles.pressed, !name.trim() && styles.disabled]}><Text style={styles.buttonText}>Create community</Text></Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  header: { alignItems: 'center', backgroundColor: colors.white, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 68, paddingHorizontal: spacing.md },
  iconButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  headerTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', marginLeft: spacing.sm },
  content: { alignItems: 'center', padding: spacing.xl },
  iconCircle: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 42, height: 84, justifyContent: 'center', width: 84 },
  title: { color: colors.ink, fontSize: 27, fontWeight: '800', marginTop: spacing.lg, textAlign: 'center' },
  description: { color: colors.body, fontSize: 16, lineHeight: 24, marginTop: spacing.sm, maxWidth: 440, textAlign: 'center' },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.ink, fontSize: 16, marginTop: spacing.lg, minHeight: 56, paddingHorizontal: spacing.md, width: '100%', maxWidth: 520 },
  multiline: { minHeight: 110, paddingTop: spacing.md, textAlignVertical: 'top' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, justifyContent: 'center', marginTop: spacing.lg, minHeight: 56, maxWidth: 520, width: '100%' },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.55 },
  codeCard: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, marginTop: spacing.xl, maxWidth: 420, padding: spacing.xl, width: '100%' },
  codeLabel: { color: colors.body, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  code: { color: colors.primaryDark, fontSize: 30, fontWeight: '900', letterSpacing: 2, marginTop: spacing.sm },
  helper: { color: colors.body, fontSize: 14, marginTop: spacing.md },
});
