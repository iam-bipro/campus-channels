import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import NoChannelsScreen from './src/screens/home/NoChannelsScreen';
import JoinCommunityScreen from './src/screens/home/JoinCommunityScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'signup' | 'no-channels' | 'join-community'>('login');

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
    <LoginScreen onAuthenticated={() => setScreen('no-channels')} onJoinNow={() => setScreen('signup')} />
  ) : screen === 'signup' ? (
    <SignUpScreen onAuthenticated={() => setScreen('no-channels')} onLogin={() => setScreen('login')} />
  ) : screen === 'no-channels' ? (
    <NoChannelsScreen onJoinCommunity={() => setScreen('join-community')} />
  ) : (
    <JoinCommunityScreen onBack={() => setScreen('no-channels')} />
  );
}
