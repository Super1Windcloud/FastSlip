import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DAYS = [
  { id: 'sun', label: 'S' },
  { id: 'mon', label: 'M' },
  { id: 'tue', label: 'T' },
  { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' },
  { id: 'fri', label: 'F' },
  { id: 'sat', label: 'S' },
]

const HABITS = [
  { name: 'Wake up early', count: '5/7', color: '#9ec8c1', track: '#d3e5e2', progress: 0.69 },
  { name: 'Work out', count: '2/7', color: '#5b56a9', track: '#b2aed6', progress: 0.31 },
  { name: 'Meditate', count: '3/7', color: '#f36f55', track: '#ffb3a6', progress: 0.44 },
  { name: 'Drink Water', count: '5/7', color: '#ffc85e', track: '#ffe8b4', progress: 0.44 },
  { name: 'Avoid Coffee', count: '2/7', color: '#9ec8c1', track: '#d3e5e2', progress: 0.31 },
  { name: 'Strech', count: '5/7', color: '#5b56a9', track: '#b2aed6', progress: 0.69 },
]

export default function HabitsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.back}>{'<Back'}</Text>
          <Text style={styles.title}>Habits</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.days}>
          {DAYS.map((day, index) => (
            <View
              key={day.id}
              style={[styles.dayBubble, index === DAYS.length - 1 && styles.dayBubbleActive]}
            >
              <Text style={styles.dayText}>{day.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.habitList}>
          {HABITS.map((habit) => (
            <View key={habit.name} style={[styles.habitCard, { backgroundColor: habit.track }]}>
              <View
                style={[
                  styles.habitFill,
                  { backgroundColor: habit.color, width: `${habit.progress * 100}%` },
                ]}
              />
              <View style={styles.habitCopy}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Text style={styles.habitMeta}>This week: {habit.count}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    paddingBottom: 28,
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
  days: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 22,
  },
  dayBubble: {
    alignItems: 'center',
    backgroundColor: '#ffc85e',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  dayBubbleActive: {
    backgroundColor: '#f36f55',
  },
  dayText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  habitList: {
    gap: 11,
    marginTop: 20,
  },
  habitCard: {
    borderRadius: 28,
    height: 72,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  habitFill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  habitCopy: {
    paddingHorizontal: 32,
  },
  habitName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 25,
  },
  habitMeta: {
    color: '#ffffff',
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 21,
  },
})
