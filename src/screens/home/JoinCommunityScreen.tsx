import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getFirebaseAuth } from '../../config/firebase';
import { notifyCommunityOwnerOfJoinRequest } from '../../services/communityService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = {
  onBack?: () => void;
  initialCommunityName?: string;
  initialOwnerEmail?: string;
};

export default function JoinCommunityScreen({ onBack, initialCommunityName, initialOwnerEmail }: Props) {
  const [communityName, setCommunityName] = useState(initialCommunityName || '');
  const [ownerEmail, setOwnerEmail] = useState(initialOwnerEmail || '');
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!communityName.trim() || !ownerEmail.trim()) {
      Alert.alert('Invite link is incomplete', 'Ask the community admin to share a new invite link.');
      return;
    }

    setLoading(true);
    try {
      const user = getFirebaseAuth().currentUser;
      await notifyCommunityOwnerOfJoinRequest({
        communityName,
        ownerEmail,
        requesterName: user?.displayName || undefined,
      });
      Alert.alert('Request sent', 'The community admin has been notified by email. You can join after they approve your request.');
    } catch (error) {
      Alert.alert('Could not send request', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.title}>{communityName ? `Join ${communityName}` : 'Join a community'}</Text>
        <Text style={styles.description}>Send a join request to the community admin. They will receive an email and approve your access.</Text>
        {!initialCommunityName && (
          <TextInput
            autoCapitalize="words"
            onChangeText={setCommunityName}
            placeholder="Community name"
            placeholderTextColor="#A1B2CB"
            style={styles.input}
            value={communityName}
          />
        )}
        {!initialOwnerEmail && (
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setOwnerEmail}
            placeholder="Admin email"
            placeholderTextColor="#A1B2CB"
            style={[styles.input, !initialCommunityName && styles.secondaryInput]}
            value={ownerEmail}
          />
        )}
        <Pressable accessibilityRole="button" disabled={loading} onPress={submitRequest} style={({ pressed }) => [styles.button, pressed && styles.pressed, loading && styles.disabled]}>
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Request to join'}</Text>
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
  secondaryInput: { marginTop: spacing.sm },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 17, flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, minHeight: 60, width: '100%' },
  buttonText: { color: colors.white, fontSize: 17, fontWeight: '800', marginRight: spacing.sm },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
});
