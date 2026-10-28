import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getFirebaseAuth } from '../../config/firebase';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = {
  communityId: string;
  communityName: string;
  description?: string | null;
  onBack?: () => void;
};

type Message = {
  id: string;
  author: string;
  text: string;
  time: string;
  mine?: boolean;
};

const channels = ['General', 'Announcements', 'Study help', 'Resources'];

export default function CommunityScreen({ communityId, communityName, description, onBack }: Props) {
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', author: 'Campus Channels', text: `Welcome to ${communityName}. Keep conversations helpful and college-focused.`, time: 'Now' },
  ]);
  const currentUser = getFirebaseAuth().currentUser?.displayName || 'You';

  const channelMessages = useMemo(
    () => messages.filter((message) => message.id.startsWith(activeChannel.toLowerCase().replace(/\s/g, '-')) || message.id === 'welcome'),
    [activeChannel, messages],
  );

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, {
      id: `${activeChannel.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      author: currentUser,
      text,
      time: 'Now',
      mine: true,
    }]);
    setDraft('');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.headerButton}>
            <Ionicons color={colors.ink} name="arrow-back" size={24} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text numberOfLines={1} style={styles.headerTitle}>{communityName}</Text>
            <Text style={styles.headerSubtitle}>Community chat</Text>
          </View>
          <Pressable accessibilityLabel="View community members" accessibilityRole="button" style={styles.headerButton}>
            <Ionicons color={colors.ink} name="people-outline" size={23} />
          </Pressable>
        </View>

        <View style={styles.communitySummary}>
          <View style={styles.communityIcon}><Ionicons color={colors.primary} name="people-outline" size={25} /></View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>{communityName}</Text>
            <Text numberOfLines={1} style={styles.summaryDescription}>{description || 'Your college community'}</Text>
          </View>
          <Text style={styles.communityId}>{communityId.slice(0, 6).toUpperCase()}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.channelRow} horizontal showsHorizontalScrollIndicator={false}>
          {channels.map((channel) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: activeChannel === channel }}
              key={channel}
              onPress={() => setActiveChannel(channel)}
              style={[styles.channelChip, activeChannel === channel && styles.channelChipActive]}
            >
              <Ionicons color={activeChannel === channel ? colors.primaryDark : colors.body} name={channel === 'General' ? 'chatbubble-ellipses-outline' : 'megaphone-outline'} size={17} />
              <Text style={[styles.channelText, activeChannel === channel && styles.channelTextActive]}>{channel}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          <Text style={styles.channelHeading}>#{activeChannel.toLowerCase()}</Text>
          <Text style={styles.channelHint}>Messages in this channel are visible to approved members.</Text>
          {channelMessages.map((message) => (
            <View key={message.id} style={[styles.messageRow, message.mine && styles.messageRowMine]}>
              {!message.mine && <View style={styles.messageAvatar}><Ionicons color={colors.primary} name="person-outline" size={18} /></View>}
              <View style={[styles.bubble, message.mine ? styles.bubbleMine : styles.bubbleOther]}>
                {!message.mine && <Text style={styles.author}>{message.author}</Text>}
                <Text style={[styles.messageText, message.mine && styles.messageTextMine]}>{message.text}</Text>
                <Text style={[styles.time, message.mine && styles.timeMine]}>{message.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <Pressable accessibilityLabel="Attach a file" accessibilityRole="button" style={styles.composerButton}>
            <Ionicons color={colors.body} name="attach-outline" size={23} />
          </Pressable>
          <TextInput
            accessibilityLabel="Message"
            onChangeText={setDraft}
            onSubmitEditing={sendMessage}
            placeholder={`Message #${activeChannel.toLowerCase()}`}
            placeholderTextColor="#9AAAC3"
            returnKeyType="send"
            style={styles.input}
            value={draft}
          />
          <Pressable accessibilityLabel="Send message" accessibilityRole="button" disabled={!draft.trim()} onPress={sendMessage} style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}>
            <Ionicons color={colors.white} name="send" size={18} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  flex: { flex: 1 },
  header: { alignItems: 'center', backgroundColor: colors.white, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 68, paddingHorizontal: spacing.sm },
  headerButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  headerCopy: { flex: 1, marginHorizontal: spacing.sm },
  headerTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: colors.body, fontSize: 12, marginTop: 2 },
  communitySummary: { alignItems: 'center', backgroundColor: colors.white, flexDirection: 'row', padding: spacing.md },
  communityIcon: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  summaryCopy: { flex: 1, marginLeft: spacing.sm },
  summaryTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  summaryDescription: { color: colors.body, fontSize: 13, marginTop: 3 },
  communityId: { color: colors.primaryDark, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  channelRow: { gap: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  channelChip: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 22, borderWidth: 1, flexDirection: 'row', minHeight: 44, paddingHorizontal: spacing.md },
  channelChipActive: { backgroundColor: colors.muted, borderColor: '#B9C9F7' },
  channelText: { color: colors.body, fontSize: 14, fontWeight: '700', marginLeft: 6 },
  channelTextActive: { color: colors.primaryDark },
  messages: { flexGrow: 1, padding: spacing.md },
  channelHeading: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  channelHint: { color: colors.body, fontSize: 13, marginTop: 4, marginBottom: spacing.lg },
  messageRow: { alignItems: 'flex-end', flexDirection: 'row', marginBottom: spacing.md, maxWidth: '88%' },
  messageRowMine: { alignSelf: 'flex-end' },
  messageAvatar: { alignItems: 'center', backgroundColor: colors.muted, borderRadius: 17, height: 34, justifyContent: 'center', marginRight: spacing.sm, width: 34 },
  bubble: { borderRadius: 18, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleOther: { backgroundColor: colors.white, borderBottomLeftRadius: 5 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 5 },
  author: { color: colors.primaryDark, fontSize: 12, fontWeight: '800', marginBottom: 4 },
  messageText: { color: colors.ink, fontSize: 15, lineHeight: 21 },
  messageTextMine: { color: colors.white },
  time: { color: colors.body, fontSize: 11, marginTop: 5, textAlign: 'right' },
  timeMine: { color: '#DDE5FF' },
  composer: { alignItems: 'center', backgroundColor: colors.white, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', padding: spacing.sm },
  composerButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 },
  input: { backgroundColor: '#F3F6FC', borderRadius: 22, color: colors.ink, flex: 1, fontSize: 15, minHeight: 44, paddingHorizontal: spacing.md },
  sendButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 22, height: 44, justifyContent: 'center', marginLeft: spacing.sm, width: 44 },
  sendButtonDisabled: { backgroundColor: '#B9C5E7' },
});
