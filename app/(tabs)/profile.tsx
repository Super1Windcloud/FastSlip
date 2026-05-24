import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg'

const ACTIONS = [
  { label: 'Create New Habit', color: '#ffc85e' },
  { label: 'History', color: '#5b56a9' },
  { label: 'Reports', color: '#f36f55' },
  { label: 'Edit Profile', color: '#9ec8c1' },
]

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.back}>{'<Back'}</Text>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.avatarStage}>
          <View style={[styles.decor, styles.decorMintLarge]} />
          <View style={[styles.decor, styles.decorCoral]} />
          <View style={[styles.decor, styles.decorMintSmall]} />
          <View style={[styles.decor, styles.decorPurple]} />
          <View style={[styles.decor, styles.decorYellow]} />
          <View style={styles.avatarFrame}>
            <AvatarIllustration />
          </View>
        </View>

        <Text style={styles.name}>Jim Halpert</Text>

        <View style={styles.actions}>
          {ACTIONS.map((action) => (
            <View key={action.label} style={[styles.action, { backgroundColor: action.color }]}>
              <Text style={styles.actionText}>{action.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

function AvatarIllustration() {
  return (
    <Svg height="220" viewBox="0 0 220 220" width="220">
      <Circle cx="110" cy="110" fill="#ffffff" r="106" stroke="#17171c" strokeWidth="2" />
      <Path
        d="M53 98c-13-42 25-68 58-59 35-8 65 5 60 41 12 11 8 35-9 43H64c-13-5-18-14-11-25z"
        fill="#17171c"
      />
      <Path d="M69 137c15 24 66 25 83 1l7 52H61l8-53z" fill="#17171c" />
      <Path
        d="M82 124c4 30 51 31 56 0v-30H82v30z"
        fill="#ffffff"
        stroke="#17171c"
        strokeWidth="2"
      />
      <Ellipse cx="65" cy="120" fill="#ffffff" rx="15" ry="18" stroke="#17171c" strokeWidth="2" />
      <Ellipse cx="154" cy="120" fill="#ffffff" rx="15" ry="18" stroke="#17171c" strokeWidth="2" />
      <Path
        d="M74 83c8 16 27 20 39 8 11 13 25 13 39 2"
        fill="none"
        stroke="#17171c"
        strokeWidth="8"
      />
      <Rect x="75" y="88" width="43" height="37" fill="#ffffff" stroke="#17171c" strokeWidth="3" />
      <Rect x="124" y="88" width="43" height="37" fill="#ffffff" stroke="#17171c" strokeWidth="3" />
      <Line x1="118" x2="124" y1="104" y2="104" stroke="#17171c" strokeWidth="3" />
      <Circle cx="95" cy="106" fill="#17171c" r="5" />
      <Circle cx="146" cy="106" fill="#17171c" r="5" />
      <Path d="M112 116c5 4 8 4 12 0" fill="none" stroke="#17171c" strokeWidth="2" />
      <Path d="M98 141c13 7 30 7 43 0" fill="none" stroke="#17171c" strokeWidth="3" />
      <Path d="M77 191h67" stroke="#ffffff" strokeWidth="4" />
      <Path d="M66 167c23 20 65 22 93 0" fill="none" stroke="#ffffff" strokeWidth="5" />
    </Svg>
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
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  headerSpacer: {
    width: 54,
  },
  avatarStage: {
    alignItems: 'center',
    height: 300,
    justifyContent: 'center',
    marginTop: 12,
  },
  avatarFrame: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 112,
    height: 224,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 224,
    zIndex: 2,
  },
  decor: {
    position: 'absolute',
  },
  decorMintLarge: {
    backgroundColor: '#c4e2dc',
    borderRadius: 82,
    height: 164,
    right: 3,
    top: 18,
    width: 164,
  },
  decorCoral: {
    backgroundColor: '#f36f55',
    borderRadius: 21,
    height: 42,
    left: 20,
    top: 50,
    width: 42,
  },
  decorMintSmall: {
    backgroundColor: '#bfe0da',
    borderRadius: 8,
    height: 16,
    left: 5,
    top: 144,
    width: 16,
  },
  decorPurple: {
    backgroundColor: '#5b56a9',
    borderRadius: 56,
    bottom: 24,
    height: 112,
    left: 23,
    width: 112,
  },
  decorYellow: {
    backgroundColor: '#ffc85e',
    borderRadius: 31,
    bottom: 37,
    height: 62,
    right: 4,
    width: 62,
  },
  name: {
    color: '#17171c',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 2,
    textAlign: 'center',
  },
  actions: {
    gap: 14,
    marginTop: 24,
  },
  action: {
    alignItems: 'center',
    borderRadius: 14,
    height: 36,
    justifyContent: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 17,
    fontStyle: 'italic',
  },
})
