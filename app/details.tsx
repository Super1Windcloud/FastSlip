import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Container } from '@/components/Container'
import { ScreenContent } from '@/components/ScreenContent'

export default function Details() {
  const { name } = useLocalSearchParams()
  const { t } = useTranslation()
  const paramName = Array.isArray(name) ? name[0] : name
  const resolvedName = paramName ?? t('details.unknownUser')

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: t('details.title') }} />
      <Container>
        <ScreenContent
          path="app/details.tsx"
          title={t('details.description', { name: resolvedName })}
        />
      </Container>
    </View>
  )
}

const styles = {
  container: 'flex flex-1 bg-white',
}
