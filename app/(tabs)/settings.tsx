import { Bell, Globe2, Moon, ShieldCheck } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SETTING_ICONS = [Moon, Globe2, Bell, ShieldCheck] as const

export default function SettingsScreen() {
  const { t } = useTranslation()
  const isDark = useColorScheme() === 'dark'
  const colors = getColors(isDark)
  const items = [0, 1, 2, 3].map((item) => ({
    icon: SETTING_ICONS[item],
    title: t(`settings.items.${item}.title`),
    description: t(`settings.items.${item}.description`),
  }))

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primaryText }]}>{t('settings.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {t('settings.subtitle')}
            </Text>
          </View>

          <View style={styles.list}>
            {items.map((item) => {
              const Icon = item.icon
              return (
                <View key={item.title} style={[styles.row, glass(colors)]}>
                  <View style={[styles.icon, { backgroundColor: colors.tintSoft }]}>
                    <Icon color={colors.tint} size={20} strokeWidth={2.2} />
                  </View>
                  <View style={styles.text}>
                    <Text style={[styles.itemTitle, { color: colors.primaryText }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.itemDescription, { color: colors.secondaryText }]}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const getColors = (isDark: boolean) => ({
  background: isDark ? '#090B10' : '#F4F7FB',
  primaryText: isDark ? '#F7F8FB' : '#111827',
  secondaryText: isDark ? 'rgba(247, 248, 251, 0.7)' : 'rgba(17, 24, 39, 0.64)',
  glass: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.74)',
  glassBorder: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.92)',
  tint: isDark ? '#7DD3FC' : '#0A84FF',
  tintSoft: isDark ? 'rgba(125, 211, 252, 0.16)' : 'rgba(10, 132, 255, 0.12)',
})

const glass = (colors: ReturnType<typeof getColors>) => ({
  backgroundColor: colors.glass,
  borderColor: colors.glassBorder,
})

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 34,
  },
  header: {
    gap: 8,
    paddingTop: 14,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  list: {
    gap: 10,
  },
  row: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  text: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemDescription: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
})
