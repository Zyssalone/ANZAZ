import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Home, Map, Camera, BookOpen, User } from 'lucide-react-native';

import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { Colors, Shadow } from '../theme';

import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import JournalScreen from '../screens/JournalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CaptureScreen from '../screens/CaptureScreen';
import ResultScreen from '../screens/ResultScreen';
import SpeciesDetailScreen from '../screens/SpeciesDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function CaptureTabButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 22, stiffness: 420, mass: 0.55 }, () => {
      scale.value = withSpring(1, { damping: 24, stiffness: 500, mass: 0.5 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={styles.captureOuter}
    >
      <Animated.View style={[styles.captureInner, animStyle, Shadow.primary]}>
        <Camera size={26} color="#fff" strokeWidth={2} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function MainTabs() {
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.2 : 1.75} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Map size={22} color={color} strokeWidth={focused ? 2.2 : 1.75} />
          ),
        }}
      />
      <Tab.Screen
        name="CaptureTab"
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: () => (
            <CaptureTabButton onPress={() => navigation.navigate('Capture')} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={22} color={color} strokeWidth={focused ? 2.2 : 1.75} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={22} color={color} strokeWidth={focused ? 2.2 : 1.75} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="SpeciesDetail"
        component={SpeciesDetailScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  captureOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});
