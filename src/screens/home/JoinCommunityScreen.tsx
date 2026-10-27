import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type JoinCommunityScreenProps = {
  onBack?: () => void;
};

export default function JoinCommunityScreen({ onBack }: JoinCommunityScreenProps) {
  const [inviteCode, setInviteCode] = useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
          <Ionicons color={colors.ink} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Join a Community</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Ionicons color={colors.primary} name="people-outline" size={38} /></View>
        <Text style={styles.title}>Enter your invite code</Text>
        <Text style={styles.description}>Ask your department, seniors, or community admin for an invite code.</Text>
        <TextInput
          autoCapitalize="characters"
          onChangeText={setInviteCode}
          placeholder="e.g. CAMPUS2026"
          placeholderTextColor="#A1B2CB"
          style={styles.input}
          value={inviteCode}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!inviteCode.trim()) {
              Alert.alert('Enter an invite code', 'Add the code shared by your community admin.');
              return;
            }
            Alert.alert('Invite submitted', 'Your community join request is ready to be submitted.');
          }}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons color={colors.white} name="arrow-forward" size={22} />
        </Pressable>
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
  iconCircle: { alignItems: 'center', backgroundColor: '#E8EEFF', borderRadius: 40, height: 80, justifyContent: 'center', width: 80 },
  title: { ...typography.title, color: colors.ink, fontSize: 27, marginTop: spacing.lg, textAlign: 'center' },
  description: { ...typography.body, color: colors.body, lineHeight: 24, marginTop: spacing.sm, maxWidth: 420, textAlign: 'center' },
  input: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 16, borderWidth: 1.5, color: colors.ink, fontSize: 17, marginTop: spacing.xl, minHeight: 60, paddingHorizontal: spacing.md, width: '100%' },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 17, flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, minHeight: 60, width: '100%' },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: '800', marginRight: spacing.sm },
  pressed: { opacity: 0.82 },
});
