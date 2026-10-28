import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { logout } from '../services/authService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
  onLogout?: () => void;
  profileName?: string;
  onAccount?: () => void;
  onCreateCommunity?: () => void;
  onJoinCommunity?: () => void;
};

export default function SideDrawer({ visible, onClose, onLogout, profileName, onAccount, onCreateCommunity, onJoinCommunity }: SideDrawerProps) {
  const slide = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -300,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [slide, visible]);

  const handleLogout = async () => {
    await logout();
    onClose();
    onLogout?.();
  };

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Close menu" accessibilityRole="button" onPress={onClose} style={styles.backdrop} />
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slide }] }]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.brand}>Campus <Text style={styles.accent}>Channels</Text></Text>
            <Pressable accessibilityLabel="Close menu" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Ionicons color={colors.ink} name="close" size={25} />
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" onPress={() => { onClose(); onAccount?.(); }} style={styles.profile}>
            <View style={styles.avatar}><Ionicons color={colors.primary} name="person-outline" size={24} /></View>
            <View>
              <Text style={styles.profileTitle}>{profileName || 'Your account'}</Text>
              <Text style={styles.profileSubtitle}>View and edit profile</Text>
            </View>
          </Pressable>
          <View style={styles.menu}>
            <DrawerItem icon="home-outline" label="Home" onPress={onClose} />
            <DrawerItem icon="people-outline" label="My communities" onPress={onClose} />
            <DrawerItem icon="add-circle-outline" label="Create community" onPress={() => { onClose(); onCreateCommunity?.(); }} />
            <DrawerItem icon="enter-outline" label="Join community" onPress={() => { onClose(); onJoinCommunity?.(); }} />
            <DrawerItem icon="settings-outline" label="Settings" onPress={onClose} />
          </View>
          <Pressable accessibilityRole="button" onPress={handleLogout} style={styles.logout}>
            <Ionicons color="#B42318" name="log-out-outline" size={22} />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function DrawerItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <Ionicons color={colors.ink} name={icon} size={22} />
      <Text style={styles.itemText}>{label}</Text>
      <Ionicons color="#8C9AB4" name="chevron-forward" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: 'rgba(13, 25, 50, 0.32)', flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  drawer: { backgroundColor: colors.white, elevation: 10, flex: 1, maxWidth: 320, padding: spacing.lg, shadowColor: '#0B1D3A', shadowOffset: { height: 0, width: 4 }, shadowOpacity: 0.18, shadowRadius: 16, width: '82%' },
  drawerHeader: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: spacing.lg },
  brand: { color: colors.ink, fontSize: 22, fontWeight: '800' },
  accent: { color: '#4172EA' },
  closeButton: { alignItems: 'center', minHeight: 44, minWidth: 44, justifyContent: 'center' },
  profile: { alignItems: 'center', backgroundColor: '#F3F6FC', borderRadius: 16, flexDirection: 'row', marginTop: spacing.lg, padding: spacing.md },
  avatar: { alignItems: 'center', backgroundColor: '#DDE8FF', borderRadius: 24, height: 48, justifyContent: 'center', marginRight: spacing.sm, width: 48 },
  profileTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  profileSubtitle: { color: '#7890B2', fontSize: 13, marginTop: 3 },
  menu: { gap: 6, marginTop: spacing.lg },
  item: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', minHeight: 52, paddingHorizontal: spacing.sm },
  itemText: { color: colors.ink, flex: 1, fontSize: 16, marginLeft: spacing.md },
  pressed: { backgroundColor: '#F3F6FC' },
  logout: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', marginTop: 'auto', paddingTop: spacing.lg },
  logoutText: { color: '#B42318', fontSize: 16, fontWeight: '700', marginLeft: spacing.md },
});
