import { Search } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SearchScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.back}>{'<Back'}</Text>
          <Text style={styles.title}>Search</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Search color="#5b56a9" size={56} strokeWidth={2} />
          <Text style={styles.emptyTitle}>Find habits</Text>
          <Text style={styles.emptyCopy}>Search your routines, reports, and favourites.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 26,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    color: '#232329',
    fontSize: 18,
    fontStyle: 'italic',
  },
  title: {
    color: '#17171c',
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: 0,
  },
  headerSpacer: {
    width: 54,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 84,
  },
  emptyTitle: {
    color: '#17171c',
    fontSize: 24,
    fontWeight: '800',
  },
  emptyCopy: {
    color: '#77777f',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
})
