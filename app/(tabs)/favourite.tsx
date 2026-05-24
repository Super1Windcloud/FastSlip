import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg'

export default function FavouriteScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroSafe}>
          <View style={styles.header}>
            <Text style={styles.headerSide}>{'<Back'}</Text>
            <Text style={styles.title}>Work Out</Text>
            <Text style={styles.headerSide}>Edit</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <Text style={styles.percent}>60%</Text>

        <View style={styles.segments}>
          {['Week', 'Month', 'Year'].map((item) => (
            <View key={item} style={[styles.segment, item === 'Month' && styles.segmentActive]}>
              <Text style={styles.segmentText}>{item}</Text>
            </View>
          ))}
        </View>

        <ProgressChart />

        <View style={styles.actions}>
          <View style={[styles.action, styles.reset]}>
            <Text style={styles.actionText}>Reset</Text>
          </View>
          <View style={[styles.action, styles.delete]}>
            <Text style={styles.actionText}>Delete</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function ProgressChart() {
  const verticals = Array.from({ length: 29 }, (_, index) => index)
  const horizontals = Array.from({ length: 11 }, (_, index) => index)

  return (
    <View style={styles.chartWrap}>
      <Svg height="236" viewBox="0 0 338 236" width="338">
        {horizontals.map((index) => {
          const y = 20 + index * 20
          return (
            <Line
              key={`h-${index}`}
              stroke={index === 10 ? '#17171c' : '#d5d8df'}
              strokeWidth={index === 10 ? 2 : 1}
              x1="34"
              x2="320"
              y1={y}
              y2={y}
            />
          )
        })}
        {verticals.map((index) => {
          const x = 34 + index * 10
          return (
            <Line
              key={`v-${index}`}
              stroke={index === 0 ? '#17171c' : '#d5d8df'}
              strokeWidth={index === 0 ? 2 : 1}
              x1={x}
              x2={x}
              y1="20"
              y2="220"
            />
          )
        })}
        {horizontals.map((index) => {
          const y = 20 + index * 20
          return (
            <Line
              key={`tick-y-${index}`}
              stroke="#17171c"
              strokeWidth="2"
              x1="29"
              x2="39"
              y1={y}
              y2={y}
            />
          )
        })}
        {verticals.map((index) => {
          const x = 34 + index * 10
          return (
            <Line
              key={`tick-x-${index}`}
              stroke="#17171c"
              strokeWidth="2"
              x1={x}
              x2={x}
              y1="216"
              y2="226"
            />
          )
        })}
        {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((label, index) => (
          <SvgText
            fill="#7e828a"
            fontSize="11"
            key={label}
            textAnchor="end"
            x="26"
            y={24 + index * 20}
          >
            {label}%
          </SvgText>
        ))}
        <Path
          d="M34 220 C 62 170, 80 150, 112 150 S 170 160, 204 138 S 255 92, 292 84"
          fill="none"
          stroke="#5b56a9"
          strokeWidth="2"
        />
        <Circle cx="292" cy="84" fill="#5b56a9" r="7" />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  hero: {
    backgroundColor: '#5b56a9',
    height: 168,
  },
  heroSafe: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
    paddingTop: 26,
  },
  headerSide: {
    color: '#ffffff',
    fontSize: 18,
    fontStyle: 'italic',
    minWidth: 54,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 32,
  },
  sectionTitle: {
    color: '#17171c',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
  },
  percent: {
    color: '#17171c',
    fontSize: 76,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 86,
    marginTop: 8,
  },
  segments: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  segment: {
    alignItems: 'center',
    backgroundColor: '#b2aed6',
    borderRadius: 16,
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#5b56a9',
  },
  segmentText: {
    color: '#ffffff',
    fontSize: 17,
    fontStyle: 'italic',
  },
  chartWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  actions: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  action: {
    alignItems: 'center',
    borderRadius: 16,
    height: 36,
    justifyContent: 'center',
    width: 174,
  },
  reset: {
    backgroundColor: '#ffc85e',
  },
  delete: {
    backgroundColor: '#f36f55',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 17,
    fontStyle: 'italic',
  },
})
