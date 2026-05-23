import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

export const EditScreenInfo = ({ path }: { path: string }) => {
  const { t } = useTranslation()

  return (
    <View>
      <View className={styles.getStartedContainer}>
        <Text className={styles.getStartedText}>{t('editScreenInfo.title')}</Text>
        <View className={styles.codeHighlightContainer + styles.homeScreenFilename}>
          <Text>{path}</Text>
        </View>
        <Text className={styles.getStartedText}>{t('editScreenInfo.description')}</Text>
      </View>
    </View>
  )
}

const styles = {
  codeHighlightContainer: `rounded-md px-1`,
  getStartedContainer: `items-center mx-12`,
  getStartedText: `text-lg leading-6 text-center`,
  helpContainer: `items-center mx-5 mt-4`,
  helpLink: `py-4`,
  helpLinkText: `text-center`,
  homeScreenFilename: `my-2`,
}
