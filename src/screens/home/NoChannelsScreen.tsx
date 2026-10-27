import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type NoChannelsScreenProps = {
  onJoinCommunity?: () => void;
};

const filters = ['All', 'Departments', 'Subjects', 'Bookmarks'];

export default function NoChannelsScreen({ onJoinCommunity }: NoChannelsScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Open menu" accessibilityRole="button" hitSlop={10} onPress={() => undefined} style={styles.iconButton}>
            <Ionicons color={colors.ink} name="menu-outline" size={29} />
          </Pressable>
          <Text style={styles.brandName}>Campus <Text style={styles.brandAccent}>Channels</Text></Text>
          <View style={styles.headerActions}>
            <Pressable accessibilityLabel="Search" accessibilityRole="button" hitSlop={10} onPress={() => undefined} style={styles.iconButton}>
              <Ionicons color={colors.ink} name="search-outline" size={25} />
            </Pressable>
            <Pressable accessibilityLabel="More options" accessibilityRole="button" hitSlop={10} onPress={() => undefined} style={styles.iconButton}>
              <Ionicons color={colors.ink} name="ellipsis-vertical" size={23} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.filterContent} horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter, index) => (
            <View key={filter} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
              <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{filter}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.emptyState}>
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
        </View>
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
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  filterContent: { gap: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  filterChip: { backgroundColor: '#F0F3F9', borderRadius: 24, paddingHorizontal: 19, paddingVertical: 11 },
  filterChipActive: { backgroundColor: '#DDE8FF' },
  filterText: { color: '#6E7890', fontSize: 15, fontWeight: '600' },
  filterTextActive: { color: '#3159B8' },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingTop: 72 },
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
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', marginTop: 27, minHeight: 60, paddingHorizontal: 26, width: '100%' },
  primaryButtonText: { color: colors.white, fontSize: 17, fontWeight: '800', marginRight: 13 },
  pressed: { opacity: 0.82 },
  helperText: { color: '#8C9AB4', fontSize: 14, marginTop: 34, textAlign: 'center' },
});
