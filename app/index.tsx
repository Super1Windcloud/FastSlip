import { Link, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { ScreenContent } from '@/components/ScreenContent'

export default function Home() {
  const { t } = useTranslation()

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: t('home.title') }} />
      <Container>
        <ScreenContent path="app/index.tsx" title={t('home.title')} />
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title={t('home.showDetails')} />
        </Link>
      </Container>
    </View>
  )
}

const styles = {
  container: 'flex flex-1 bg-white',
}
