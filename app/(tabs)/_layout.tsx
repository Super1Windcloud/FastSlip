import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { TAB_ACTIVE_COLOR } from '@/lib/colors'

export default function TabsLayout() {
  return (
    <NativeTabs
      blurEffect="systemChromeMaterial"
      iconColor={{ default: '#3c3c43', selected: TAB_ACTIVE_COLOR }}
      labelStyle={{
        default: { color: '#3c3c43', fontSize: 11, fontWeight: '500' },
        selected: { color: TAB_ACTIVE_COLOR, fontSize: 11, fontWeight: '600' },
      }}
      minimizeBehavior="automatic"
      shadowColor="rgba(60, 60, 67, 0.18)"
      tintColor={TAB_ACTIVE_COLOR}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>订单生成</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="home" sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transfer">
        <NativeTabs.Trigger.Label>转账生成</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="credit_card"
          sf={{ default: 'creditcard', selected: 'creditcard.fill' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger hidden name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="account_circle"
          sf={{ default: 'face.smiling', selected: 'face.smiling.inverse' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger hidden name="favourite">
        <NativeTabs.Trigger.Label>Favourite</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="star" sf={{ default: 'star', selected: 'star.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger hidden name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="search" sf="magnifyingglass" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger hidden name="settings" />
    </NativeTabs>
  )
}
