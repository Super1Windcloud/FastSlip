import { Stack, useLocalSearchParams } from 'expo-router'
import { Check, Code2, Gauge, Smartphone } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const STACK_ICONS = [Smartphone, Code2, Gauge] as const

export default function Details() {
  const { name } = useLocalSearchParams()
  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const colors = getColors(isDark)
  const paramName = Array.isArray(name) ? name[0] : name
  const resolvedName = paramName ?? t('details.unknownUser')
  const stack = [0, 1, 2].map((item) => ({
    icon: STACK_ICONS[item],
    title: t(`details.stack.${item}.title`),
    description: t(`details.stack.${item}.description`),
  }))

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: t('details.title'),
          headerBlurEffect: isDark ? 'systemMaterialDark' : 'systemMaterialLight',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.primaryText,
        }}
      />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.summary, glass(colors)]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.tintSoft }]}>
              <Check color={colors.tint} size={24} strokeWidth={2.4} />
            </View>
            <Text style={[styles.eyebrow, { color: colors.tertiaryText }]}>
              {t('details.eyebrow')}
            </Text>
            <Text style={[styles.title, { color: colors.primaryText }]}>
              {t('details.description', { name: resolvedName })}
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {t('details.subtitle')}
            </Text>
          </View>

          <View style={styles.stack}>
            {stack.map((item) => {
              const Icon = item.icon
              return (
                <View key={item.title} style={[styles.stackItem, glass(colors)]}>
                  <View style={[styles.stackIcon, { backgroundColor: colors.tintSoft }]}>
                    <Icon color={colors.tint} size={20} strokeWidth={2.2} />
                  </View>
                  <View style={styles.stackText}>
                    <Text style={[styles.stackTitle, { color: colors.primaryText }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.stackDescription, { color: colors.secondaryText }]}>
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
  header: isDark ? 'rgba(9, 11, 16, 0.72)' : 'rgba(244, 247, 251, 0.72)',
  primaryText: isDark ? '#F7F8FB' : '#111827',
  secondaryText: isDark ? 'rgba(247, 248, 251, 0.7)' : 'rgba(17, 24, 39, 0.64)',
  tertiaryText: isDark ? 'rgba(247, 248, 251, 0.5)' : 'rgba(17, 24, 39, 0.46)',
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
    gap: 14,
    padding: 20,
    paddingBottom: 34,
  },
  summary: {
    borderRadius: 30,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  stack: {
    gap: 10,
  },
  stackItem: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  stackIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  stackText: {
    flex: 1,
    gap: 3,
  },
  stackTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  stackDescription: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
})
