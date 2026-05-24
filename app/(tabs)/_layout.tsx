import { NativeTabs } from 'expo-router/unstable-native-tabs'

export default function TabsLayout() {
  return (
    <NativeTabs
      blurEffect="systemChromeMaterial"
      iconColor={{ default: '#3c3c43', selected: '#5b56a9' }}
      labelStyle={{
        default: { color: '#3c3c43', fontSize: 11, fontWeight: '500' },
        selected: { color: '#5b56a9', fontSize: 11, fontWeight: '600' },
      }}
      minimizeBehavior="automatic"
      shadowColor="rgba(60, 60, 67, 0.18)"
      tintColor="#5b56a9"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'face.smiling', selected: 'face.smiling.inverse' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favourite">
        <NativeTabs.Trigger.Label>Favourite</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'star', selected: 'star.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger hidden name="settings" />
    </NativeTabs>
  )
}
