import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { logout } from '../../services/authService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type HomeScreenProps = {
  onLogout?: () => void;
};

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>Campus <Text style={styles.accent}>Channels</Text></Text>
        <Pressable
          accessibilityLabel="Log out"
          accessibilityRole="button"
          onPress={async () => {
            await logout();
            onLogout?.();
          }}
          style={styles.logoutButton}
        >
          <Ionicons color={colors.primary} name="log-out-outline" size={22} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.iconCircle}><Ionicons color={colors.primary} name="people-outline" size={34} /></View>
        <Text style={styles.title}>Your communities</Text>
        <Text style={styles.description}>Your approved college channels will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  header: { alignItems: 'center', backgroundColor: colors.white, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 68, paddingHorizontal: spacing.md },
  brand: { ...typography.title, fontSize: 22 },
  accent: { color: '#4172EA' },
  logoutButton: { alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' },
  content: { alignItems: 'center', padding: spacing.xl },
  iconCircle: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 36, height: 72, justifyContent: 'center', width: 72 },
  title: { ...typography.title, fontSize: 27, marginTop: spacing.lg },
  description: { ...typography.body, marginTop: spacing.sm, textAlign: 'center' },
});
