import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import NoChannelsScreen from './src/screens/home/NoChannelsScreen';
import JoinCommunityScreen from './src/screens/home/JoinCommunityScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import AccountScreen from './src/screens/home/AccountScreen';
import CreateCommunityScreen from './src/screens/home/CreateCommunityScreen';
import CommunityAdminScreen from './src/screens/home/CommunityAdminScreen';
import CommunityScreen from './src/screens/community/CommunityScreen';
import type { CommunitySummary } from './src/services/dataConnectService';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home' | 'no-channels' | 'join-community' | 'account' | 'create-community' | 'community-admin' | 'community'>('login');
  const [adminCommunity, setAdminCommunity] = useState({ id: '', name: '' });
  const [selectedCommunity, setSelectedCommunity] = useState<CommunitySummary | null>(null);
  const [pendingInvite, setPendingInvite] = useState<{ communityName: string; ownerEmail: string } | null>(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const communityName = params.get('joinCommunity');
    const ownerEmail = params.get('ownerEmail');
    return communityName && ownerEmail ? { communityName, ownerEmail } : null;
  });

  const completeAuth = () => setScreen(pendingInvite ? 'join-community' : 'no-channels');

  useEffect(() => {
    if (Platform.OS !== 'web' || document.getElementById('campus-channels-input-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'campus-channels-input-styles';
    style.textContent = `
      input,
      textarea {
        outline: none !important;
      }

      input::-ms-reveal,
      input::-ms-clear {
        display: none;
      }

      input::-webkit-credentials-auto-fill-button,
      input::-webkit-textfield-decoration-container {
        display: none !important;
        visibility: hidden;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return screen === 'login' ? (
    <LoginScreen onAuthenticated={completeAuth} onJoinNow={() => setScreen('signup')} />
  ) : screen === 'signup' ? (
    <SignUpScreen onAuthenticated={completeAuth} onLogin={() => setScreen('login')} />
  ) : screen === 'home' ? (
    <HomeScreen onAccount={() => setScreen('account')} onCreateCommunity={() => setScreen('create-community')} onJoinCommunity={() => setScreen('join-community')} onLogout={() => setScreen('login')} />
  ) : screen === 'no-channels' ? (
    <NoChannelsScreen onAccount={() => setScreen('account')} onCreateCommunity={() => setScreen('create-community')} onJoinCommunity={() => setScreen('join-community')} onLogout={() => setScreen('login')} onOpenCommunity={(community) => { setSelectedCommunity(community); setScreen('community'); }} />
  ) : screen === 'account' ? (
    <AccountScreen onBack={() => setScreen('no-channels')} />
  ) : screen === 'create-community' ? (
    <CreateCommunityScreen onBack={() => setScreen('no-channels')} onCreated={(id, name) => { setAdminCommunity({ id, name }); setScreen('community-admin'); }} />
  ) : screen === 'community-admin' ? (
    <CommunityAdminScreen communityId={adminCommunity.id} communityName={adminCommunity.name} onBack={() => setScreen('no-channels')} />
  ) : screen === 'community' && selectedCommunity ? (
    <CommunityScreen communityId={selectedCommunity.id} communityName={selectedCommunity.name} description={selectedCommunity.description} onBack={() => setScreen('no-channels')} />
  ) : (
    <JoinCommunityScreen initialCommunityName={pendingInvite?.communityName} initialOwnerEmail={pendingInvite?.ownerEmail} onBack={() => { setPendingInvite(null); setScreen('no-channels'); }} />
  );
}
