import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, SafeAreaView, Share, StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { getFirebaseAuth } from '../../config/firebase';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = {
  communityId: string;
  communityName: string;
  onBack?: () => void;
};

export default function CommunityAdminScreen({ communityId, communityName, onBack }: Props) {
  const shareInvite = async () => {
    const ownerEmail = getFirebaseAuth().currentUser?.email;
    if (!ownerEmail) {
      Alert.alert('Sign in required', 'Sign in again before sharing a community invite.');
      return;
    }
    const baseUrl = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : 'https://campus-channels.web.app';
    const inviteUrl = `${baseUrl}/?joinCommunity=${encodeURIComponent(communityName)}&ownerEmail=${encodeURIComponent(ownerEmail)}`;
    await Share.share({ message: `Join ${communityName} on Campus Channels: ${inviteUrl}`, url: inviteUrl, title: `Join ${communityName}` });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
          <Ionicons color={colors.ink} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Community admin</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Ionicons color={colors.primary} name="people-outline" size={40} /></View>
        <Text style={styles.title}>{communityName}</Text>
        <Text style={styles.subtitle}>You are the community owner.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin controls</Text>
          <AdminAction icon="person-add-outline" label="Manage members" />
          <AdminAction icon="link-outline" label="Share invite link" onPress={shareInvite} />
          <AdminAction icon="chatbubbles-outline" label="Manage channels" />
          <AdminAction icon="settings-outline" label="Community settings" />
        </View>
        <Text style={styles.idLabel}>Community ID</Text>
        <Text selectable style={styles.id}>{communityId}</Text>
      </View>
    </SafeAreaView>
  );
}

function AdminAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <Ionicons color={colors.primary} name={icon} size={22} />
      <Text style={styles.actionText}>{label}</Text>
      <Ionicons color="#8C9AB4" name="chevron-forward" size={18} />
    </Pressable>
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
  subtitle: { color: colors.body, fontSize: 16, marginTop: spacing.sm },
  card: { backgroundColor: colors.white, borderRadius: 18, marginTop: spacing.xl, maxWidth: 520, padding: spacing.md, width: '100%' },
  cardTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginBottom: spacing.sm },
  action: { alignItems: 'center', borderTopColor: '#EDF0F6', borderTopWidth: 1, flexDirection: 'row', minHeight: 56 },
  actionText: { color: colors.ink, flex: 1, fontSize: 16, marginLeft: spacing.md },
  pressed: { opacity: 0.7 },
  idLabel: { color: colors.body, fontSize: 12, fontWeight: '800', letterSpacing: 1, marginTop: spacing.xl },
  id: { color: colors.primaryDark, fontSize: 15, fontWeight: '700', marginTop: spacing.sm },
});
