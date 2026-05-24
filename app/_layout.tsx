import '../global.css'
import '@/locales'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Theme } from '@/components/theme'

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Theme>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </Theme>
    </SafeAreaProvider>
  )
}
