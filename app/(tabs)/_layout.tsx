import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Home, Search, Smile, Star } from 'lucide-react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TAB_ICONS = {
  favourite: Star,
  index: Home,
  profile: Smile,
  search: Search,
}

type TabRoute = {
  key: string
  name: string
  params?: object
}

type TabDescriptor = {
  options: {
    href?: null | string
    tabBarLabel?: unknown
    title?: string
  }
}

type TabNavigation = {
  emit: (event: { canPreventDefault: true; target: string; type: 'tabPress' }) => {
    defaultPrevented: boolean
  }
  navigate: (name: string, params?: object) => void
}

type LiquidGlassTabBarProps = {
  descriptors: Record<string, TabDescriptor>
  navigation: TabNavigation
  state: {
    index: number
    routes: TabRoute[]
  }
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="favourite" options={{ title: 'Favourite' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  )
}

function LiquidGlassTabBar({ descriptors, navigation, state }: LiquidGlassTabBarProps) {
  const insets = useSafeAreaInsets()
  const [barWidth, setBarWidth] = useState(0)
  const visibleRoutes = useMemo(
    () => state.routes.filter((route) => descriptors[route.key]?.options.href !== null),
    [descriptors, state.routes]
  )
  const focusedRoute = state.routes[state.index]
  const focusedIndex = Math.max(
    0,
    visibleRoutes.findIndex((route) => route.key === focusedRoute?.key)
  )
  const indicator = useRef(new Animated.Value(focusedIndex)).current
  const pressScales = useRef<Record<string, Animated.Value>>(
    Object.fromEntries(state.routes.map((route) => [route.key, new Animated.Value(1)]))
  ).current
  const itemWidth = visibleRoutes.length > 0 ? barWidth / visibleRoutes.length : 0

  useEffect(() => {
    Animated.spring(indicator, {
      damping: 19,
      mass: 0.75,
      stiffness: 210,
      toValue: focusedIndex,
      useNativeDriver: true,
    }).start()
  }, [focusedIndex, indicator])

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.dockWrap,
        {
          bottom: Math.max(insets.bottom, 10) + 8,
        },
      ]}
    >
      <View style={styles.shadowShell}>
        <BlurView experimentalBlurMethod="dimezisBlurView" intensity={46} style={styles.blur}>
          <View style={styles.glassTint} />
          <View style={styles.topSpecular} />
          <View style={styles.bottomGlow} />

          <View
            style={styles.items}
            onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
          >
            {itemWidth > 0 ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.indicator,
                  {
                    width: itemWidth - 8,
                    transform: [
                      {
                        translateX: indicator.interpolate({
                          inputRange: visibleRoutes.map((_, index) => index),
                          outputRange: visibleRoutes.map((_, index) => index * itemWidth + 4),
                        }),
                      },
                    ],
                  },
                ]}
              >
                <BlurView intensity={65} style={styles.indicatorBlur}>
                  <View style={styles.indicatorTint} />
                  <View style={styles.indicatorHighlight} />
                </BlurView>
              </Animated.View>
            ) : null}

            {visibleRoutes.map((route) => {
              const options = descriptors[route.key].options
              const label =
                typeof options.title === 'string'
                  ? options.title
                  : typeof options.tabBarLabel === 'string'
                    ? options.tabBarLabel
                    : route.name
              const isFocused = focusedRoute?.key === route.key
              const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS] ?? Home
              const color = isFocused ? '#3f3a8f' : 'rgba(20, 20, 25, 0.68)'
              const scale = pressScales[route.key]

              const onPress = () => {
                const event = navigation.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: 'tabPress',
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params)
                }
              }

              const animatePress = (toValue: number) => {
                Animated.spring(scale, {
                  damping: 14,
                  mass: 0.5,
                  stiffness: 260,
                  toValue,
                  useNativeDriver: true,
                }).start()
              }

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  key={route.key}
                  onPress={onPress}
                  onPressIn={() => animatePress(0.9)}
                  onPressOut={() => animatePress(1)}
                  style={styles.itemPressable}
                >
                  <Animated.View style={[styles.item, { transform: [{ scale }] }]}>
                    <Icon
                      color={color}
                      fill={isFocused ? color : 'transparent'}
                      size={25}
                      strokeWidth={2}
                    />
                    <Text style={[styles.label, { color }]} numberOfLines={1}>
                      {label}
                    </Text>
                  </Animated.View>
                </Pressable>
              )
            })}
          </View>
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dockWrap: {
    left: 18,
    position: 'absolute',
    right: 18,
  },
  shadowShell: {
    borderRadius: 36,
    height: 72,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { height: 14, width: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 30,
      },
      default: {
        elevation: 12,
      },
    }),
  },
  blur: {
    borderColor: 'rgba(255, 255, 255, 0.48)',
    borderRadius: 36,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  glassTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  topSpecular: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 999,
    height: 1,
    left: 26,
    position: 'absolute',
    right: 26,
    top: 1,
  },
  bottomGlow: {
    backgroundColor: 'rgba(91, 86, 169, 0.12)',
    bottom: -18,
    height: 52,
    left: 34,
    position: 'absolute',
    right: 34,
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    padding: 6,
  },
  indicator: {
    bottom: 6,
    left: 0,
    position: 'absolute',
    top: 6,
  },
  indicatorBlur: {
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 30,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  indicatorTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
  },
  indicatorHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 999,
    height: 16,
    left: 14,
    position: 'absolute',
    right: 14,
    top: 5,
  },
  itemPressable: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
  },
})
