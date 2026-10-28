import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import SideDrawer from '../../components/SideDrawer';
import { getFirebaseAuth } from '../../config/firebase';
import { CommunitySummary, getMyCommunitiesFromDataConnect } from '../../services/dataConnectService';

type NoChannelsScreenProps = {
  onJoinCommunity?: () => void;
  onLogout?: () => void;
  onAccount?: () => void;
  onCreateCommunity?: () => void;
  onOpenCommunity?: (community: CommunitySummary) => void;
};

const filters = ['All', 'Departments', 'Subjects', 'Bookmarks'];

export default function NoChannelsScreen({ onJoinCommunity, onLogout, onAccount, onCreateCommunity, onOpenCommunity }: NoChannelsScreenProps) {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [profileName, setProfileName] = React.useState('Your account');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [communities, setCommunities] = React.useState<CommunitySummary[]>([]);
  const [loadingCommunities, setLoadingCommunities] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    getMyCommunitiesFromDataConnect()
      .then((items) => {
        if (active) setCommunities(items);
      })
      .catch(() => {
        if (active) setCommunities([]);
      })
      .finally(() => {
        if (active) setLoadingCommunities(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleCommunities = communities.filter((community) => {
    const query = searchQuery.trim().toLowerCase();
    return !query || `${community.name} ${community.description || ''}`.toLowerCase().includes(query);
  });
  React.useEffect(() => {
    setProfileName(getFirebaseAuth().currentUser?.displayName || 'Your account');
  }, []);
  return (
    <SafeAreaView style={styles.screen}>
      <SideDrawer onAccount={onAccount} onClose={() => setDrawerVisible(false)} onCreateCommunity={onCreateCommunity} onJoinCommunity={onJoinCommunity} onLogout={onLogout} profileName={profileName} visible={drawerVisible} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Open menu" accessibilityRole="button" hitSlop={10} onPress={() => setDrawerVisible(true)} style={styles.iconButton}>
            <Ionicons color={colors.ink} name="menu-outline" size={29} />
          </Pressable>
          {searchOpen ? (
            <TextInput
              accessibilityLabel="Search channels"
              autoFocus
              onChangeText={setSearchQuery}
              onSubmitEditing={() => setSearchOpen(false)}
              placeholder="Search channels"
              placeholderTextColor="#8C9AB4"
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
          ) : <Text style={styles.brandName}>Campus <Text style={styles.brandAccent}>Channels</Text></Text>}
          <View style={styles.headerActions}>
            <Pressable accessibilityLabel={searchOpen ? 'Close search' : 'Search'} accessibilityRole="button" hitSlop={10} onPress={() => { setSearchOpen((open) => !open); if (searchOpen) setSearchQuery(''); }} style={styles.iconButton}>
              <Ionicons color={colors.ink} name={searchOpen ? 'close-outline' : 'search-outline'} size={25} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.filterContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter, index) => (
            <Pressable key={filter} accessibilityRole="button" accessibilityState={{ selected: activeFilter === filter }} onPress={() => setActiveFilter(filter)} style={[styles.filterChip, activeFilter === filter && styles.filterChipActive, index > 0 && styles.filterChipSpacing]}>
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {loadingCommunities ? (
          <View style={styles.emptyState}><Text style={styles.description}>Loading your communities…</Text></View>
        ) : visibleCommunities.length > 0 ? (
          <View style={styles.communityList}>
            {!!searchQuery && <Text style={styles.searchStatus}>Showing results for “{searchQuery}”.</Text>}
            <Text style={styles.sectionTitle}>Your communities</Text>
            {visibleCommunities.map((community) => (
              <Pressable key={community.id} accessibilityRole="button" onPress={() => onOpenCommunity?.(community)} style={({ pressed }) => [styles.communityCard, pressed && styles.pressed]}>
                <View style={styles.communityIcon}><Ionicons color={colors.primary} name="people-outline" size={24} /></View>
                <View style={styles.communityDetails}>
                  <Text style={styles.communityName}>{community.name}</Text>
                  {!!community.description && <Text numberOfLines={2} style={styles.communityDescription}>{community.description}</Text>}
                  <Text style={styles.communityMeta}>{community.memberCount || 1} member{community.memberCount === 1 ? '' : 's'}</Text>
                </View>
                <Ionicons color="#8C9AB4" name="chevron-forward" size={19} />
              </Pressable>
            ))}
            <Pressable accessibilityRole="button" onPress={onJoinCommunity} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryButtonText}>Join another community</Text>
              <Ionicons color={colors.primary} name="add" size={21} />
            </Pressable>
          </View>
        ) : <View style={styles.emptyState}>
          {!!searchQuery && <Text style={styles.searchStatus}>Searching for “{searchQuery}” in {activeFilter.toLowerCase()}.</Text>}
          <View style={styles.illustration}>
            <View style={styles.illustrationGlow} />
            <View style={styles.purpleBubble}>
              <View style={styles.bubbleLineWide} />
              <View style={styles.bubbleLineShort} />
            </View>
            <View style={styles.whiteBubble}>
              <View style={styles.bubbleLineLightWide} />
              <View style={styles.bubbleLineLightShort} />
            </View>
            <View style={styles.lock}>
              <View style={styles.lockShackle} />
              <View style={styles.lockBody}><View style={styles.lockKeyhole} /></View>
            </View>
          </View>
          <Text style={styles.title}>No Joined Channels Yet</Text>
          <Text style={styles.description}>
            You haven’t joined any college communities.{'\n'}
            Ask your department, seniors, or admin for{'\n'}
            an invite code
          </Text>
          <Pressable accessibilityRole="button" onPress={onJoinCommunity} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Join a Community</Text>
            <Ionicons color={colors.white} name="arrow-forward" size={24} />
          </Pressable>
          <Text style={styles.helperText}>Enter your invite code to get started.</Text>
        </View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.surface, flex: 1 },
  content: { flexGrow: 1, paddingBottom: spacing.xl },
  header: { alignItems: 'center', borderBottomColor: '#EFF2F8', borderBottomWidth: 1, flexDirection: 'row', minHeight: 72, paddingHorizontal: spacing.md },
  iconButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 40 },
  brandName: { color: colors.ink, flex: 1, fontSize: 22, fontWeight: '800', marginLeft: 4 },
  brandAccent: { color: '#4172EA' },
  searchInput: { color: colors.ink, flex: 1, fontSize: 16, fontWeight: '600', marginLeft: spacing.sm, minHeight: 44 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  filterScroll: { flexGrow: 0, height: 64 },
  filterContent: { alignItems: 'center', flexDirection: 'row', paddingHorizontal: spacing.md },
  filterChip: { alignItems: 'center', backgroundColor: '#F0F3F9', borderRadius: 24, height: 40, justifyContent: 'center', paddingHorizontal: 19 },
  filterChipSpacing: { marginLeft: 10 },
  filterChipActive: { backgroundColor: '#DDE8FF' },
  filterText: { color: '#6E7890', fontSize: 15, fontWeight: '600' },
  filterTextActive: { color: '#3159B8' },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingTop: 72 },
  communityList: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, width: '100%' },
  sectionTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', marginBottom: spacing.md },
  communityCard: { alignItems: 'center', backgroundColor: colors.white, borderColor: '#E5EAF3', borderRadius: 18, borderWidth: 1, flexDirection: 'row', marginBottom: spacing.md, minHeight: 88, padding: spacing.md },
  communityIcon: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 25, height: 50, justifyContent: 'center', marginRight: spacing.md, width: 50 },
  communityDetails: { flex: 1 },
  communityName: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  communityDescription: { color: colors.body, fontSize: 14, marginTop: 4 },
  communityMeta: { color: colors.primaryDark, fontSize: 13, fontWeight: '700', marginTop: 7 },
  secondaryButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: 14, borderWidth: 1.5, flexDirection: 'row', justifyContent: 'center', minHeight: 52, marginTop: spacing.sm },
  secondaryButtonText: { color: colors.primary, fontSize: 15, fontWeight: '800', marginRight: spacing.sm },
  illustration: { height: 245, marginBottom: 22, position: 'relative', width: 280 },
  illustrationGlow: { backgroundColor: '#EEF3FF', borderRadius: 130, height: 220, left: 28, position: 'absolute', top: 8, width: 220 },
  purpleBubble: { backgroundColor: '#6948E8', borderRadius: 23, height: 92, left: 112, padding: 21, position: 'absolute', top: 33, transform: [{ rotate: '-2deg' }], width: 150 },
  whiteBubble: { backgroundColor: colors.white, borderColor: '#3F79E8', borderRadius: 24, borderWidth: 5, height: 106, left: 25, padding: 23, position: 'absolute', top: 100, transform: [{ rotate: '-2deg' }], width: 165 },
  bubbleLineWide: { backgroundColor: '#E8E4FF', borderRadius: 3, height: 6, marginBottom: 12, width: 92 },
  bubbleLineShort: { backgroundColor: '#E8E4FF', borderRadius: 3, height: 6, width: 63 },
  bubbleLineLightWide: { backgroundColor: '#D6E4FF', borderRadius: 3, height: 6, marginBottom: 12, width: 104 },
  bubbleLineLightShort: { backgroundColor: '#D6E4FF', borderRadius: 3, height: 6, width: 72 },
  lock: { bottom: 8, position: 'absolute', right: 22 },
  lockShackle: { borderColor: '#4C74DF', borderRadius: 34, borderWidth: 11, height: 69, left: 17, position: 'absolute', top: -34, width: 68 },
  lockBody: { alignItems: 'center', backgroundColor: '#4B54DF', borderRadius: 13, height: 84, justifyContent: 'center', width: 86 },
  lockKeyhole: { backgroundColor: '#E9EEFF', borderRadius: 8, height: 23, width: 13 },
  title: { ...typography.title, color: '#101D38', fontSize: 27, textAlign: 'center' },
  description: { ...typography.body, color: '#6E7890', fontSize: 16, lineHeight: 25, marginTop: 13, textAlign: 'center' },
  searchStatus: { color: colors.primaryDark, fontSize: 14, marginBottom: spacing.md, textAlign: 'center' },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', marginTop: 27, minHeight: 60, paddingHorizontal: 26, width: '100%' },
  primaryButtonText: { color: colors.white, fontSize: 17, fontWeight: '800', marginRight: 13 },
  pressed: { opacity: 0.82 },
  helperText: { color: '#8C9AB4', fontSize: 14, marginTop: 34, textAlign: 'center' },
});
