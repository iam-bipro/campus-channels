import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import NoChannelsScreen from './src/screens/home/NoChannelsScreen';
import JoinCommunityScreen from './src/screens/home/JoinCommunityScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import AccountScreen from './src/screens/home/AccountScreen';
import CreateCommunityScreen from './src/screens/home/CreateCommunityScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'home' | 'no-channels' | 'join-community' | 'account' | 'create-community'>('login');

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
    <LoginScreen onAuthenticated={(hasCommunity) => setScreen(hasCommunity ? 'home' : 'no-channels')} onJoinNow={() => setScreen('signup')} />
  ) : screen === 'signup' ? (
    <SignUpScreen onAuthenticated={() => setScreen('no-channels')} onLogin={() => setScreen('login')} />
  ) : screen === 'home' ? (
    <HomeScreen onAccount={() => setScreen('account')} onCreateCommunity={() => setScreen('create-community')} onJoinCommunity={() => setScreen('join-community')} onLogout={() => setScreen('login')} />
  ) : screen === 'no-channels' ? (
    <NoChannelsScreen onAccount={() => setScreen('account')} onCreateCommunity={() => setScreen('create-community')} onJoinCommunity={() => setScreen('join-community')} onLogout={() => setScreen('login')} />
  ) : screen === 'account' ? (
    <AccountScreen onBack={() => setScreen('home')} />
  ) : screen === 'create-community' ? (
    <CreateCommunityScreen onBack={() => setScreen('home')} />
  ) : (
    <JoinCommunityScreen onBack={() => setScreen('no-channels')} />
  );
}
