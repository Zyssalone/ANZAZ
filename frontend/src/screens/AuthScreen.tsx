import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Leaf, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Radius, Shadow, Spacing } from '../theme';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

type Props = StackScreenProps<RootStackParamList, 'Auth'>;

const { height } = Dimensions.get('window');
const TABS = ['Log In', 'Sign Up'] as const;

export default function AuthScreen({ navigation }: Props) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tabRowWidth, setTabRowWidth] = useState(0);
  const [loading, setLoading] = useState(false);

  const cardY = useSharedValue(80);
  const cardOpacity = useSharedValue(0);
  const tabIndicatorX = useSharedValue(0);
  const btnScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
    opacity: cardOpacity.value,
  }));

  const tabIndicatorWidth = tabRowWidth > 0 ? (tabRowWidth - 6) / 2 : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    width: tabIndicatorWidth,
    transform: [{ translateX: tabIndicatorX.value }],
  }), [tabIndicatorWidth]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  useEffect(() => {
    cardY.value = withDelay(40, withSpring(0, { damping: 28, stiffness: 420, mass: 0.65 }));
    cardOpacity.value = withDelay(40, withTiming(1, { duration: 120 }));
  }, []);

  useEffect(() => {
    tabIndicatorX.value = activeTab === 0 ? 0 : tabIndicatorWidth;
  }, [activeTab, tabIndicatorWidth]);

  const switchTab = (idx: 0 | 1) => {
    setActiveTab(idx);
    tabIndicatorX.value = withSpring(idx === 0 ? 0 : tabIndicatorWidth, { damping: 26, stiffness: 520, mass: 0.55 });
  };

  const handleAuth = async () => {
    if (loading) return;
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail.includes('@')) {
      Alert.alert('Check your email', 'Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Check your password', 'Password must be at least 6 characters.');
      return;
    }
    if (activeTab === 1 && cleanName.length < 2) {
      Alert.alert('Check your name', 'Enter your full name before creating an account.');
      return;
    }

    btnScale.value = withSpring(0.97, { damping: 24, stiffness: 520, mass: 0.5 }, () => {
      btnScale.value = withSpring(1, { damping: 26, stiffness: 560, mass: 0.5 });
    });

    try {
      setLoading(true);
      if (activeTab === 0) {
        await login(cleanEmail, password);
      } else {
        await register(cleanName, cleanEmail, password);
      }
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      Alert.alert('Auth failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('zyad@anzaz.app');
    setPassword('demo1234');
    try {
      setLoading(true);
      await login('zyad@anzaz.app', 'demo1234');
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      Alert.alert('Demo login failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Leaf size={28} color="#fff" strokeWidth={2} />
        </View>
        <Text style={styles.headerTitle}>ANZAZ</Text>
        <Text style={styles.headerSub}>Morocco Biodiversity Platform</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.card, cardStyle, Shadow.lg]}>
            <View
              style={styles.tabRow}
              onLayout={(event) => setTabRowWidth(event.nativeEvent.layout.width)}
            >
              {tabIndicatorWidth > 0 && (
                <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
              )}
              {TABS.map((t, i) => (
                <TouchableOpacity
                  key={t}
                  style={styles.tab}
                  onPress={() => switchTab(i as 0 | 1)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.form}>
              {activeTab === 1 && (
                <View style={styles.inputWrap}>
                  <User size={16} color={Colors.textMuted} strokeWidth={1.75} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={Colors.textLight}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
              <View style={styles.inputWrap}>
                <Mail size={16} color={Colors.textMuted} strokeWidth={1.75} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputWrap}>
                <Lock size={16} color={Colors.textMuted} strokeWidth={1.75} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword
                    ? <Eye size={16} color={Colors.textMuted} strokeWidth={1.75} />
                    : <EyeOff size={16} color={Colors.textMuted} strokeWidth={1.75} />
                  }
                </TouchableOpacity>
              </View>

              {activeTab === 0 && (
                <TouchableOpacity style={styles.forgotWrap}>
                  <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              <Animated.View style={btnStyle}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={handleAuth}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>
                        {activeTab === 0 ? 'Log In' : 'Create Account'}
                      </Text>
                      <ArrowRight size={18} color="#fff" strokeWidth={2} />
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8} onPress={handleDemoLogin}>
                <Text style={styles.googleBtnText}>Demo account</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 0 ? (
              <Text style={styles.switchText}>
                New to ANZAZ?{' '}
                <Text style={styles.switchLink} onPress={() => switchTab(1)}>
                  Sign up free
                </Text>
              </Text>
            ) : (
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={styles.switchLink} onPress={() => switchTab(0)}>
                  Log in
                </Text>
              </Text>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { alignItems: 'center', paddingTop: 72, paddingBottom: 32, gap: 8 },
  headerLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 3 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  kav: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: Radius.md,
    padding: 3,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 3,
    left: 3,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 10,
    ...Shadow.sm,
  },
  tab: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 14, fontWeight: '500', color: Colors.textMuted },
  tabTextActive: { color: Colors.text, fontWeight: '600' },
  form: { gap: 12 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#fafafa',
  },
  input: { flex: 1, fontSize: 14, color: Colors.text },
  forgotWrap: { alignSelf: 'flex-end' },
  forgot: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  dividerText: { fontSize: 12, color: Colors.textMuted },
  googleBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  switchText: { textAlign: 'center', fontSize: 13, color: Colors.textMuted },
  switchLink: { color: Colors.primary, fontWeight: '600' },
});
