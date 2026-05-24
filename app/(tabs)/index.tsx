import * as MediaLibrary from 'expo-media-library'
import {
  Bed,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Copy,
  Headphones,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Utensils,
} from 'lucide-react-native'
import { useMemo, useRef, useState } from 'react'
import type { ImageSourcePropType } from 'react-native'
import {
  Alert,
  Image,
  Platform as NativePlatform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { captureRef } from 'react-native-view-shot'

type Platform = 'ctrip' | 'meituan'
type OrderStatus = '已完成' | '预订成功' | '待支付' | '已取消'

type OrderForm = {
  orderNo: string
  status: OrderStatus
  amount: string
  cancelPolicy: string
  hotelName: string
  hotelAddress: string
  checkInDate: string
  checkOutDate: string
  checkInNote: string
  checkOutNote: string
  roomType: string
  stayNote: string
  mealStatus: string
  mealNote: string
  guestName: string
  phone: string
  mobileTime: string
  hotelImage: string
}

const statusOptions: OrderStatus[] = ['已完成', '预订成功', '待支付', '已取消']

const defaultHotelImage = require('../../screenshot/template.png')

const initialForm: OrderForm = {
  orderNo: '1128148127564710',
  status: '预订成功',
  amount: '138',
  cancelPolicy: '05月23日20:00前 免费取消；05月23日20:00后 不可取消或修改',
  hotelName: '盒子空间心之港湾宾馆（上海海湾大学城店）',
  hotelAddress: '奉贤区海湾旅游区奉炮公路378弄81号',
  checkInDate: '2026年5月23日 周六',
  checkOutDate: '2026年5月24日 周日',
  checkInNote: '10:00后',
  checkOutNote: '14:00前',
  roomType: '特价投影大床 1间',
  stayNote: '双人床 | 2人入住 | 15-18m² | 禁烟 | Wi-Fi免费',
  mealStatus: '无早餐',
  mealNote: '不含早餐，可到店咨询前台',
  guestName: '佟姓名',
  phone: '138****8888',
  mobileTime: '10:06',
  hotelImage: '',
}

const meituanDefaults: Partial<OrderForm> = {
  orderNo: '5026028532982631487',
  amount: '116',
  mobileTime: '10:20',
  cancelPolicy: '今天5月23日20:00前可免费取消',
  hotelName: '盒子空间酒店(海湾大学城店)',
  checkInNote: '14:00后',
  checkOutNote: '14:00前',
}

export default function OrderGeneratorScreen() {
  const { width } = useWindowDimensions()
  const previewRef = useRef<View>(null)
  const [platform, setPlatform] = useState<Platform>('ctrip')
  const [form, setForm] = useState<OrderForm>(initialForm)
  const [isSaving, setIsSaving] = useState(false)

  const previewStyle = useMemo(
    () => [styles.phoneFrame, width >= 940 ? styles.phoneFrameWide : undefined],
    [width]
  )

  const update = (key: keyof OrderForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const selectPlatform = (nextPlatform: Platform) => {
    setPlatform(nextPlatform)
    if (nextPlatform === 'meituan') {
      setForm((current) => ({ ...current, ...meituanDefaults }))
      return
    }
    setForm((current) => ({ ...current, ...initialForm }))
  }

  const savePreview = async () => {
    if (!previewRef.current || isSaving) {
      return
    }

    if (NativePlatform.OS === 'web') {
      Alert.alert('暂不支持', '网页端不能直接保存到系统相册，请在手机端使用。')
      return
    }

    try {
      setIsSaving(true)
      const permission = await MediaLibrary.requestPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('无法保存', '请允许访问相册后再保存图片。')
        return
      }

      const uri = await captureRef(previewRef, {
        fileName: `hotel-order-${platform}-${Date.now()}`,
        format: 'png',
        quality: 1,
      })
      await MediaLibrary.saveToLibraryAsync(uri)
      Alert.alert('已保存', '订单截图已保存到相册。')
    } catch {
      Alert.alert('保存失败', '请稍后重试。')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.page, width >= 940 && styles.pageWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.builder}>
          <View style={styles.editor}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>酒店订单生成</Text>
                <Text style={styles.subtitle}>填写动态信息，实时生成携程或美团订单页面。</Text>
              </View>
            </View>

            <View style={styles.segment}>
              <PlatformButton
                active={platform === 'ctrip'}
                label="携程酒店订单"
                onPress={() => selectPlatform('ctrip')}
              />
              <PlatformButton
                active={platform === 'meituan'}
                label="美团酒店订单"
                onPress={() => selectPlatform('meituan')}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>订单信息</Text>
              <Field
                label="订单号"
                value={form.orderNo}
                onChangeText={(value) => update('orderNo', value)}
              />
              <Text style={styles.label}>订单状态</Text>
              <View style={styles.statusGrid}>
                {statusOptions.map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => update('status', status)}
                    style={[styles.statusChip, form.status === status && styles.statusChipActive]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        form.status === status && styles.statusChipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Field
                keyboardType="numeric"
                label="付款额度"
                prefix="¥"
                value={form.amount}
                onChangeText={(value) => update('amount', value)}
              />
              <Field
                multiline
                label="取消政策"
                value={form.cancelPolicy}
                onChangeText={(value) => update('cancelPolicy', value)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>酒店与入住</Text>
              <Field
                label="酒店名称"
                value={form.hotelName}
                onChangeText={(value) => update('hotelName', value)}
              />
              <Field
                multiline
                label="酒店地址"
                value={form.hotelAddress}
                onChangeText={(value) => update('hotelAddress', value)}
              />
              <View style={styles.fieldRow}>
                <Field
                  containerStyle={styles.fieldHalf}
                  label="入住时间"
                  value={form.checkInDate}
                  onChangeText={(value) => update('checkInDate', value)}
                />
                <Field
                  containerStyle={styles.fieldHalf}
                  label="离店时间"
                  value={form.checkOutDate}
                  onChangeText={(value) => update('checkOutDate', value)}
                />
              </View>
              <View style={styles.fieldRow}>
                <Field
                  containerStyle={styles.fieldHalf}
                  label="入住说明"
                  value={form.checkInNote}
                  onChangeText={(value) => update('checkInNote', value)}
                />
                <Field
                  containerStyle={styles.fieldHalf}
                  label="离店说明"
                  value={form.checkOutNote}
                  onChangeText={(value) => update('checkOutNote', value)}
                />
              </View>
              <Field
                label="房型"
                value={form.roomType}
                onChangeText={(value) => update('roomType', value)}
              />
              <Field
                multiline
                label="房型/入住说明"
                value={form.stayNote}
                onChangeText={(value) => update('stayNote', value)}
              />
              <View style={styles.fieldRow}>
                <Field
                  containerStyle={styles.fieldHalf}
                  label="餐食情况"
                  value={form.mealStatus}
                  onChangeText={(value) => update('mealStatus', value)}
                />
                <Field
                  containerStyle={styles.fieldHalf}
                  label="餐食说明"
                  value={form.mealNote}
                  onChangeText={(value) => update('mealNote', value)}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>联系人与截图</Text>
              <View style={styles.fieldRow}>
                <Field
                  containerStyle={styles.fieldHalf}
                  label="入住人"
                  value={form.guestName}
                  onChangeText={(value) => update('guestName', value)}
                />
                <Field
                  containerStyle={styles.fieldHalf}
                  keyboardType="phone-pad"
                  label="联系电话"
                  value={form.phone}
                  onChangeText={(value) => update('phone', value)}
                />
              </View>
              <Field
                label="手机时间"
                placeholder="10:06"
                value={form.mobileTime}
                onChangeText={(value) => update('mobileTime', value)}
              />
              <Field
                label="酒店大门图 URL"
                placeholder="https://..."
                value={form.hotelImage}
                onChangeText={(value) => update('hotelImage', value)}
              />
            </View>
          </View>

          <View style={styles.previewColumn}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>实时预览</Text>
              <Pressable
                disabled={isSaving}
                onPress={savePreview}
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              >
                <Text style={styles.saveButtonText}>{isSaving ? '保存中' : '保存到相册'}</Text>
              </Pressable>
            </View>
            <View collapsable={false} ref={previewRef} style={previewStyle}>
              {platform === 'ctrip' ? (
                <CtripPreview form={form} imageSource={defaultHotelImage} />
              ) : (
                <MeituanPreview form={form} imageSource={defaultHotelImage} />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function PlatformButton({
  active,
  label,
  onPress,
}: {
  active: boolean
  label: string
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.platformButton, active && styles.platformButtonActive]}
    >
      {active ? <Check color="#ffffff" size={16} strokeWidth={3} /> : null}
      <Text style={[styles.platformText, active && styles.platformTextActive]}>{label}</Text>
    </Pressable>
  )
}

function Field({
  containerStyle,
  keyboardType,
  label,
  multiline,
  onChangeText,
  placeholder,
  prefix,
  value,
}: {
  containerStyle?: object
  keyboardType?: 'default' | 'numeric' | 'phone-pad'
  label: string
  multiline?: boolean
  onChangeText: (value: string) => void
  placeholder?: string
  prefix?: string
  value: string
}) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMultiline]}>
        {prefix ? <Text style={styles.inputPrefix}>{prefix}</Text> : null}
        <TextInput
          keyboardType={keyboardType}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
        />
      </View>
    </View>
  )
}

function StatusBar({ brand, time }: { brand: Platform; time: string }) {
  return (
    <View style={styles.mobileStatus}>
      <Text style={styles.mobileTime}>{time || '10:06'}</Text>
      <View style={styles.brandPill}>
        {brand === 'meituan' ? (
          <>
            <Text style={styles.meituanBadge}>美团</Text>
            <Text style={styles.brandText}>美团</Text>
          </>
        ) : (
          <Text style={styles.ctripLogo}>携程旅行</Text>
        )}
      </View>
      <View style={styles.signalGroup}>
        <View style={[styles.signalBar, { height: 8 }]} />
        <View style={[styles.signalBar, { height: 12, opacity: 0.45 }]} />
        <View style={[styles.signalBar, { height: 16, opacity: 0.25 }]} />
        <Text style={styles.wifi}>⌁</Text>
        <Text style={styles.battery}>33</Text>
      </View>
    </View>
  )
}

function HotelImage({
  fallback,
  uri,
  style,
}: {
  fallback: ImageSourcePropType
  uri: string
  style: object
}) {
  return <Image source={uri ? { uri } : fallback} style={style} />
}

function CtripPreview({
  form,
  imageSource,
}: {
  form: OrderForm
  imageSource: ImageSourcePropType
}) {
  const statusColor =
    form.status === '已取消' ? '#8a8f98' : form.status === '待支付' ? '#f59e0b' : '#00875a'

  return (
    <View style={styles.ctripScreen}>
      <StatusBar brand="ctrip" time={form.mobileTime} />
      <View style={styles.ctripNav}>
        <ChevronLeft color="#111827" size={25} strokeWidth={2.6} />
        <Text numberOfLines={1} style={styles.ctripOrderTitle}>
          订单号 {form.orderNo}
        </Text>
        <ChevronRight color="#111827" size={18} strokeWidth={2.4} />
        <View style={styles.navTools}>
          <Headphones color="#111827" size={22} strokeWidth={2.4} />
          <Share2 color="#111827" size={22} strokeWidth={2.4} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.previewScroll}>
        <View style={styles.ctripHero}>
          <View style={styles.statusLine}>
            <Text style={[styles.ctripStatus, { color: statusColor }]}>{form.status}</Text>
            <ChevronRight color={statusColor} size={20} strokeWidth={2.5} />
          </View>
          <Text style={styles.ctripHeroText}>
            房间已预留，到店报{form.guestName}并出示证件即可入住
          </Text>
          <Text style={styles.linkText}>酒店确认函</Text>
        </View>

        <View style={styles.ctripPaymentCard}>
          <Text style={styles.paymentTitle}>
            {form.status === '待支付' ? '待支付' : '已在线付'}{' '}
            <Text style={styles.priceBlue}>¥{form.amount || '0'}</Text>
          </Text>
          <Text style={styles.underline}>费用明细</Text>
          <View style={styles.refundTag}>
            <Text style={styles.refundIcon}>◆</Text>
            <Text style={styles.refundText}>助力返现进行中</Text>
            <ChevronRight color="#111827" size={16} />
          </View>
          <View style={styles.divider} />
          <Text style={styles.cancelTitle}>取消政策</Text>
          <PolicyTimeline policy={form.cancelPolicy} />
          <Text style={styles.underline}>查看详情</Text>
        </View>

        <View style={styles.ctripHotelBlock}>
          <View style={styles.hotelHeaderRow}>
            <View style={styles.hotelNameWrap}>
              <Text style={styles.ctripHotelName}>{form.hotelName}</Text>
              <Text style={styles.underline}>酒店详情</Text>
            </View>
            <HotelImage
              fallback={imageSource}
              style={styles.ctripHotelImage}
              uri={form.hotelImage}
            />
          </View>
          <View style={styles.ctripActionRow}>
            <View style={styles.ctripAction}>
              <MessageCircle color="#111827" size={20} strokeWidth={2.2} />
              <Text style={styles.actionText}>发消息给店家</Text>
            </View>
            <View style={styles.ctripCall}>
              <Phone color="#111827" size={22} strokeWidth={2.2} />
            </View>
          </View>

          <View style={styles.infoLine}>
            <CalendarDays color="#111827" size={22} strokeWidth={2.1} />
            <View style={styles.infoBody}>
              <Text style={styles.dateText}>
                {form.checkInDate}—{form.checkOutDate}
                <Text style={styles.nightText}> | 1晚</Text>
              </Text>
              <Text style={styles.mutedText}>入住：{form.checkInNote}</Text>
              <Text style={styles.mutedText}>离店：{form.checkOutNote}</Text>
            </View>
          </View>

          <View style={styles.infoLine}>
            <Bed color="#111827" size={22} strokeWidth={2.1} />
            <View style={styles.infoBody}>
              <Text style={styles.roomTitle}>{form.roomType}</Text>
              <Text style={styles.mutedText}>{form.stayNote}</Text>
            </View>
          </View>

          <View style={styles.infoLine}>
            <Utensils color="#111827" size={22} strokeWidth={2.1} />
            <View style={styles.infoBody}>
              <Text style={styles.roomTitle}>{form.mealStatus}</Text>
              <Text style={styles.mutedText}>{form.mealNote}</Text>
            </View>
          </View>

          <View style={styles.guestBox}>
            <Text style={styles.guestText}>入住人：{form.guestName}</Text>
            <Text style={styles.guestText}>联系电话：{form.phone}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.ctripBottomBar}>
        {['取消订单', '修改订单', '原房续住', '更多（4）'].map((item) => (
          <View key={item} style={styles.ctripBottomButton}>
            <Text style={styles.ctripBottomText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function MeituanPreview({
  form,
  imageSource,
}: {
  form: OrderForm
  imageSource: ImageSourcePropType
}) {
  return (
    <View style={styles.meituanScreen}>
      <StatusBar brand="meituan" time={form.mobileTime} />
      <View style={styles.meituanNav}>
        <ChevronLeft color="#111827" size={28} strokeWidth={3} />
        <View style={styles.meituanIcons}>
          <Headphones color="#111827" size={23} strokeWidth={2.5} />
          <Share2 color="#111827" size={23} strokeWidth={2.5} />
          <Home color="#111827" size={23} strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.previewScroll}>
        <View style={styles.meituanTitleRow}>
          <CircleCheck color="#111827" size={29} strokeWidth={2.7} />
          <Text style={styles.meituanStatus}>{form.status}</Text>
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipAvatar}>
            <Text style={styles.tipEmoji}>√</Text>
          </View>
          <Text style={styles.tipText}>
            已享延迟退房权益，今天14:00后凭{form.guestName}
            及身份证入住，上海市今天22°C~29°C，可能下雨。
          </Text>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>开启消息通知，不错过订单提醒/优惠</Text>
          <Text style={styles.noticeButton}>开启</Text>
          <Text style={styles.closeText}>×</Text>
        </View>

        <View style={styles.meituanInfoCard}>
          <InfoRow action="详情" label="取消规则" value={form.cancelPolicy} />
          <InfoRow action="复制" label="订单号" value={form.orderNo} />
          <InfoRow action="明细" highlight label="在线支付" value={`¥${form.amount || '0'}`} />
          <InfoRow action="详情" label="离店返" value={`${form.amount || '0'}积分(价值1.1元)`} />
        </View>

        <View style={styles.meituanHotelCard}>
          <View style={styles.meituanHotelTop}>
            <HotelImage
              fallback={imageSource}
              style={styles.meituanHotelImage}
              uri={form.hotelImage}
            />
            <View style={styles.meituanHotelCopy}>
              <Text numberOfLines={2} style={styles.meituanHotelName}>
                {form.hotelName} <ChevronRight color="#111827" size={15} />
              </Text>
              <View style={styles.addressRow}>
                <Text numberOfLines={1} style={styles.meituanAddress}>
                  {form.hotelAddress}
                </Text>
                <View style={styles.copyBadge}>
                  <Copy color="#6b7280" size={12} />
                  <Text style={styles.copyBadgeText}>复制</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.meituanActionRow}>
            <View style={styles.outlineButton}>
              <MapPin color="#111827" size={20} strokeWidth={2.4} />
              <Text style={styles.outlineButtonText}>地图</Text>
            </View>
            <View style={styles.outlineButton}>
              <Phone color="#111827" size={20} strokeWidth={2.4} />
              <Text style={styles.outlineButtonText}>联系酒店</Text>
            </View>
          </View>

          <View style={styles.ticketDots} />

          <View style={styles.roomHeader}>
            <Bed color="#111827" size={20} strokeWidth={2.2} />
            <Text style={styles.meituanRoomTitle}>{form.roomType}</Text>
            <Text style={styles.detailLink}>详情</Text>
          </View>
          <Text style={styles.meituanRoomDesc}>{form.stayNote}</Text>
          <Text style={styles.meituanRoomDesc}>
            {form.mealStatus} | {form.mealNote}
          </Text>

          <View style={styles.meituanTimeline}>
            <TimelinePoint label="住" />
            <View>
              <Text style={styles.timelineDate}>
                {form.checkInDate} {form.checkInNote}
              </Text>
              <Text style={styles.timelineDate}>
                {form.checkOutDate} {form.checkOutNote}
              </Text>
            </View>
          </View>

          <View style={styles.meituanGuestBox}>
            <Text style={styles.meituanGuestText}>入住人 {form.guestName}</Text>
            <Text style={styles.meituanGuestText}>联系电话 {form.phone}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.meituanBottomBar}>
        {['取消订单', '修改订单', '发票/报销'].map((item) => (
          <View key={item} style={styles.meituanBottomButton}>
            <Text style={styles.meituanBottomText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function PolicyTimeline({ policy }: { policy: string }) {
  const parts = policy
    .split(/[；;]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <View style={styles.policyList}>
      {(parts.length ? parts : [policy]).map((item, index) => (
        <View key={item} style={styles.policyItem}>
          <View style={[styles.policyDot, index === 0 && styles.policyDotActive]} />
          <Text style={styles.policyText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function InfoRow({
  action,
  highlight,
  label,
  value,
}: {
  action: string
  highlight?: boolean
  label: string
  value: string
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={1} style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
        {value}
      </Text>
      <Text style={styles.infoAction}>{action} ›</Text>
    </View>
  )
}

function TimelinePoint({ label }: { label: string }) {
  return (
    <View style={styles.timelineMarks}>
      <View style={styles.timelineCircle}>
        <Text style={styles.timelineCircleText}>{label}</Text>
      </View>
      <View style={styles.timelineLine} />
      <View style={styles.timelineCircle}>
        <Text style={styles.timelineCircleText}>离</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  actionText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  battery: {
    backgroundColor: '#3fc66b',
    borderRadius: 5,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 18,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  brandPill: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
  },
  brandText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  builder: {
    gap: 22,
    width: '100%',
  },
  cancelTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 12,
  },
  closeText: {
    color: '#8a8f98',
    fontSize: 24,
    fontWeight: '500',
  },
  copyBadge: {
    alignItems: 'center',
    backgroundColor: '#f1f2f4',
    borderRadius: 5,
    flexDirection: 'row',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  copyBadgeText: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0,
  },
  ctripAction: {
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 54,
    justifyContent: 'center',
  },
  ctripActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  ctripBottomBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#edf0f5',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  ctripBottomButton: {
    alignItems: 'center',
    backgroundColor: '#0078f5',
    borderRadius: 4,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  ctripBottomText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ctripCall: {
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    borderRadius: 5,
    height: 54,
    justifyContent: 'center',
    width: 74,
  },
  ctripHero: {
    backgroundColor: '#ebfff8',
    paddingBottom: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  ctripHeroText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 25,
    marginTop: 8,
  },
  ctripHotelBlock: {
    backgroundColor: '#ffffff',
    borderTopColor: '#eef2f6',
    borderTopWidth: 9,
    padding: 22,
  },
  ctripHotelImage: {
    borderRadius: 5,
    height: 76,
    width: 76,
  },
  ctripHotelName: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 26,
  },
  ctripLogo: {
    color: '#2479e9',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  ctripNav: {
    alignItems: 'center',
    backgroundColor: '#f7fffd',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  ctripOrderTitle: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  ctripPaymentCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -9,
    padding: 22,
  },
  ctripScreen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  ctripStatus: {
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 0,
  },
  dateText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 24,
  },
  detailLink: {
    color: '#0052a8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginLeft: 'auto',
  },
  divider: {
    backgroundColor: '#edf0f3',
    height: 1,
    marginBottom: 20,
    marginTop: 22,
  },
  editor: {
    flex: 1,
    gap: 16,
    minWidth: 0,
  },
  field: {
    gap: 7,
    marginTop: 12,
  },
  fieldHalf: {
    flex: 1,
    minWidth: 150,
  },
  fieldRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  guestBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    gap: 4,
    marginTop: 18,
    padding: 12,
  },
  guestText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  header: {
    gap: 6,
  },
  hotelHeaderRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  hotelNameWrap: {
    flex: 1,
    gap: 9,
  },
  infoAction: {
    color: '#0052a8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    width: 48,
  },
  infoBody: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    color: '#8a8f98',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    width: 74,
  },
  infoLine: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 22,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 39,
  },
  infoValue: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  infoValueHighlight: {
    color: '#ff2d24',
    fontSize: 19,
    fontWeight: '900',
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    letterSpacing: 0,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputMultiline: {
    minHeight: 78,
    textAlignVertical: 'top',
  },
  inputPrefix: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    paddingLeft: 12,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#d8dde6',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  inputWrapMultiline: {
    alignItems: 'flex-start',
  },
  label: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  linkText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  meituanActionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 18,
  },
  meituanAddress: {
    color: '#7a7f87',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  meituanBadge: {
    backgroundColor: '#ffd000',
    borderRadius: 5,
    color: '#111827',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0,
    overflow: 'hidden',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  meituanBottomBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 13,
  },
  meituanBottomButton: {
    alignItems: 'center',
    borderColor: '#0052a8',
    borderRadius: 22,
    borderWidth: 1.5,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  meituanBottomText: {
    color: '#0052a8',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  meituanGuestBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    gap: 4,
    marginTop: 18,
    padding: 12,
  },
  meituanGuestText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  meituanHotelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 12,
    padding: 16,
  },
  meituanHotelCopy: {
    flex: 1,
    gap: 6,
  },
  meituanHotelImage: {
    borderRadius: 8,
    height: 58,
    width: 58,
  },
  meituanHotelName: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 24,
  },
  meituanHotelTop: {
    flexDirection: 'row',
    gap: 12,
  },
  meituanIcons: {
    flexDirection: 'row',
    gap: 24,
  },
  meituanInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 12,
    padding: 16,
  },
  meituanNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  meituanRoomDesc: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 22,
    marginLeft: 31,
    marginTop: 4,
  },
  meituanRoomTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  meituanScreen: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  meituanStatus: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  meituanTimeline: {
    borderTopColor: '#edf0f3',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    paddingTop: 16,
  },
  meituanTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  mobileStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 37,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 6,
  },
  mobileTime: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  mutedText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 22,
  },
  navTools: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 4,
  },
  nightText: {
    fontWeight: '900',
  },
  noticeButton: {
    borderColor: '#0052a8',
    borderRadius: 6,
    borderWidth: 1,
    color: '#0052a8',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  noticeCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 10,
    marginTop: 12,
    padding: 15,
  },
  noticeText: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 24,
  },
  outlineButton: {
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 43,
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  page: {
    padding: 16,
    paddingBottom: 32,
  },
  pageWide: {
    padding: 24,
  },
  paymentTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  phoneFrame: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#111827',
    borderRadius: 26,
    borderWidth: 6,
    height: 760,
    maxWidth: 430,
    overflow: 'hidden',
    width: '100%',
  },
  phoneFrameWide: {
    alignSelf: 'flex-start',
    width: 390,
  },
  platformButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d8dde6',
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  platformButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  platformText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  platformTextActive: {
    color: '#ffffff',
  },
  policyDot: {
    borderColor: '#c7ccd4',
    borderRadius: 999,
    borderWidth: 1.5,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  policyDotActive: {
    backgroundColor: '#1477ee',
    borderColor: '#d8e9ff',
    borderWidth: 4,
    height: 16,
    marginLeft: -2,
    width: 16,
  },
  policyItem: {
    flexDirection: 'row',
    gap: 14,
  },
  policyList: {
    gap: 12,
    marginBottom: 10,
  },
  policyText: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 24,
  },
  previewColumn: {
    gap: 10,
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  previewScroll: {
    flex: 1,
  },
  previewTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  priceBlue: {
    color: '#0078f5',
  },
  refundIcon: {
    color: '#ffb000',
    fontSize: 14,
  },
  refundTag: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f4f6f8',
    borderRadius: 3,
    flexDirection: 'row',
    gap: 5,
    marginTop: 18,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  refundText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  roomHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  roomTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  screen: {
    backgroundColor: '#f3f4f6',
    flex: 1,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  saveButtonDisabled: {
    opacity: 0.58,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  segment: {
    flexDirection: 'row',
    gap: 10,
  },
  signalBar: {
    backgroundColor: '#000000',
    borderRadius: 2,
    width: 4,
  },
  signalGroup: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 3,
  },
  statusChip: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderColor: '#d8dde6',
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 38,
    minWidth: 78,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  statusChipActive: {
    backgroundColor: '#e8f1ff',
    borderColor: '#1477ee',
  },
  statusChipText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  statusChipTextActive: {
    color: '#0052a8',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  ticketDots: {
    borderColor: '#edf0f3',
    borderStyle: 'dotted',
    borderWidth: 1,
    height: 1,
    marginHorizontal: -16,
    marginTop: 20,
  },
  timelineCircle: {
    alignItems: 'center',
    backgroundColor: '#0052a8',
    borderRadius: 999,
    height: 23,
    justifyContent: 'center',
    width: 23,
  },
  timelineCircleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  timelineDate: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 37,
  },
  timelineLine: {
    backgroundColor: '#dbeafe',
    flex: 1,
    width: 5,
  },
  timelineMarks: {
    alignItems: 'center',
    gap: 4,
  },
  tipAvatar: {
    alignItems: 'center',
    backgroundColor: '#fff7cc',
    borderColor: '#72a7ff',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  tipCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 10,
    marginTop: 16,
    padding: 16,
  },
  tipEmoji: {
    color: '#ffcc00',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tipText: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 25,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  underline: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  wifi: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 17,
  },
})
