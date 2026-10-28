import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { logout } from '../../services/authService';
import { getFirebaseAuth } from '../../config/firebase';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import SideDrawer from '../../components/SideDrawer';

type HomeScreenProps = {
  onLogout?: () => void;
  onAccount?: () => void;
  onCreateCommunity?: () => void;
  onJoinCommunity?: () => void;
};

export default function HomeScreen({ onLogout, onAccount, onCreateCommunity, onJoinCommunity }: HomeScreenProps) {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [profileName, setProfileName] = React.useState('Your account');
  React.useEffect(() => {
    setProfileName(getFirebaseAuth().currentUser?.displayName || 'Your account');
  }, []);
  return (
    <SafeAreaView style={styles.screen}>
      <SideDrawer onAccount={onAccount} onClose={() => setDrawerVisible(false)} onCreateCommunity={onCreateCommunity} onJoinCommunity={onJoinCommunity} onLogout={onLogout} profileName={profileName} visible={drawerVisible} />
      <View style={styles.header}>
        <Pressable accessibilityLabel="Open menu" accessibilityRole="button" onPress={() => setDrawerVisible(true)} style={styles.menuButton}>
          <Ionicons color={colors.ink} name="menu-outline" size={27} />
        </Pressable>
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
  menuButton: { alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' },
  logoutButton: { alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' },
  content: { alignItems: 'center', padding: spacing.xl },
  iconCircle: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 36, height: 72, justifyContent: 'center', width: 72 },
  title: { ...typography.title, fontSize: 27, marginTop: spacing.lg },
  description: { ...typography.body, marginTop: spacing.sm, textAlign: 'center' },
});
