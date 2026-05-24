import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  MessageCircle,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react-native'
import type React from 'react'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type TransferPlatform = 'wechat' | 'alipay'

type TransferForm = {
  accountName: string
  amount: string
  billTitle: string
  category: string
  counterparty: string
  createTime: string
  receiveTime: string
  reason: string
  remark: string
  status: string
  transferNo: string
  wechatNote: string
  alipayOrderNo: string
  alipayPayer: string
  mobileTime: string
}

const initialForm: TransferForm = {
  accountName: '姐姐',
  amount: '1000.00',
  billTitle: '转账-来自姐姐',
  category: '转账红包',
  counterparty: '转转（深圳）网络科技有限公司',
  createTime: '2026-02-20 13:16:20',
  receiveTime: '2026年2月10日 12:43:59',
  reason: '回收单号:2023654491199258645',
  remark: '转账',
  status: '已存入零钱',
  transferNo: '1000050001202602100423760830696',
  wechatNote: '微信转账',
  alipayOrderNo: '2026022022001461201438673905',
  alipayPayer: '支付宝账户（尾号 8899）',
  mobileTime: '16:26',
}

const platformDefaults: Record<TransferPlatform, Partial<TransferForm>> = {
  wechat: {
    accountName: '姐姐',
    amount: '1000.00',
    billTitle: '转账-来自姐姐',
    mobileTime: '16:26',
    status: '已存入零钱',
  },
  alipay: {
    accountName: '转转（深圳）网络科技有限公司',
    amount: '249.00',
    billTitle: '账单详情',
    mobileTime: '16:21',
    status: '交易成功',
  },
}

export default function TransferGeneratorScreen() {
  const { width } = useWindowDimensions()
  const [platform, setPlatform] = useState<TransferPlatform>('wechat')
  const [form, setForm] = useState<TransferForm>(initialForm)
  const [includeInStats, setIncludeInStats] = useState(true)

  const previewStyle = useMemo(
    () => [styles.phoneFrame, width >= 940 ? styles.phoneFrameWide : undefined],
    [width]
  )

  const update = (key: keyof TransferForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const selectPlatform = (nextPlatform: TransferPlatform) => {
    setPlatform(nextPlatform)
    setForm((current) => ({ ...current, ...platformDefaults[nextPlatform] }))
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.page, width >= 940 && styles.pageWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.builder, width >= 940 && styles.builderWide]}>
          <View style={styles.editor}>
            <View style={styles.header}>
              <Text style={styles.title}>转账账单生成</Text>
              <Text style={styles.subtitle}>填写动态信息，生成微信或支付宝转账账单页面。</Text>
            </View>

            <View style={styles.segment}>
              <PlatformButton
                active={platform === 'wechat'}
                label="微信转账"
                onPress={() => selectPlatform('wechat')}
              />
              <PlatformButton
                active={platform === 'alipay'}
                label="支付宝转账"
                onPress={() => selectPlatform('alipay')}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>基础信息</Text>
              <Field
                label="收款/对方名称"
                value={form.accountName}
                onChangeText={(value) => update('accountName', value)}
              />
              <Field
                keyboardType="numeric"
                label="金额"
                prefix="+"
                value={form.amount}
                onChangeText={(value) => update('amount', value)}
              />
              <Field
                label="状态"
                value={form.status}
                onChangeText={(value) => update('status', value)}
              />
              <Field
                label="手机时间"
                value={form.mobileTime}
                onChangeText={(value) => update('mobileTime', value)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>微信账单信息</Text>
              <Field
                label="账单标题"
                value={form.billTitle}
                onChangeText={(value) => update('billTitle', value)}
              />
              <Field
                label="转账说明"
                value={form.wechatNote}
                onChangeText={(value) => update('wechatNote', value)}
              />
              <Field
                label="转账时间"
                value={form.createTime}
                onChangeText={(value) => update('createTime', value)}
              />
              <Field
                label="收款时间"
                value={form.receiveTime}
                onChangeText={(value) => update('receiveTime', value)}
              />
              <Field
                multiline
                label="转账单号"
                value={form.transferNo}
                onChangeText={(value) => update('transferNo', value)}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>支付宝账单信息</Text>
              <Field
                label="创建时间"
                value={form.createTime}
                onChangeText={(value) => update('createTime', value)}
              />
              <Field
                multiline
                label="理由"
                value={form.reason}
                onChangeText={(value) => update('reason', value)}
              />
              <Field
                label="转账备注"
                value={form.remark}
                onChangeText={(value) => update('remark', value)}
              />
              <Field
                label="对方账户"
                value={form.counterparty}
                onChangeText={(value) => update('counterparty', value)}
              />
              <Field
                label="账单分类"
                value={form.category}
                onChangeText={(value) => update('category', value)}
              />
              <Field
                label="支付宝订单号"
                value={form.alipayOrderNo}
                onChangeText={(value) => update('alipayOrderNo', value)}
              />
            </View>
          </View>

          <View style={styles.previewColumn}>
            <Text style={styles.previewTitle}>实时预览</Text>
            <View style={previewStyle}>
              {platform === 'wechat' ? (
                <WechatBillPreview form={form} />
              ) : (
                <AlipayBillPreview
                  form={form}
                  includeInStats={includeInStats}
                  onToggleStats={setIncludeInStats}
                />
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
  prefix,
  value,
}: {
  containerStyle?: object
  keyboardType?: 'default' | 'numeric'
  label: string
  multiline?: boolean
  onChangeText: (value: string) => void
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
          placeholderTextColor="#9ca3af"
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
        />
      </View>
    </View>
  )
}

function MobileStatus({ time }: { time: string }) {
  return (
    <View style={styles.mobileStatus}>
      <Text style={styles.mobileTime}>{time || '16:26'}</Text>
      <View style={styles.signalGroup}>
        <View style={[styles.signalBar, { height: 8 }]} />
        <View style={[styles.signalBar, { height: 12, opacity: 0.55 }]} />
        <View style={[styles.signalBar, { height: 16, opacity: 0.25 }]} />
        <Text style={styles.wifi}>⌒</Text>
        <Text style={styles.battery}>69</Text>
      </View>
    </View>
  )
}

function WechatBillPreview({ form }: { form: TransferForm }) {
  const transferNo = form.transferNo.replace(/\s/g, '')
  const transferNoTop = transferNo.slice(0, 28) || transferNo
  const transferNoBottom = transferNo.length > 28 ? transferNo.slice(28) : ''

  return (
    <View style={styles.wechatScreen}>
      <MobileStatus time={form.mobileTime} />
      <View style={styles.wechatNav}>
        <X color="#1f2329" size={30} strokeWidth={2.4} />
        <Text style={styles.wechatNavTitle}>账单</Text>
        <Text style={styles.wechatNavRight}>全部账单</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.previewScroll}>
        <View style={styles.wechatHero}>
          <View style={styles.avatarPhoto}>
            <Text style={styles.avatarPhotoText}>{form.accountName.slice(0, 1) || '姐'}</Text>
          </View>
          <Text style={styles.wechatBillTitle}>{form.billTitle}</Text>
          <Text style={styles.wechatAmount}>+{form.amount || '0.00'}</Text>
        </View>

        <View style={styles.wechatDetails}>
          <WechatDetailRow label="当前状态" value={form.status} />
          <WechatDetailRow label="转账说明" value={form.wechatNote} />
          <WechatDetailRow label="转账时间" value={formatWechatTime(form.createTime)} />
          <WechatDetailRow label="收款时间" value={form.receiveTime} />
          <View style={styles.wechatDetailRow}>
            <Text style={styles.wechatDetailLabel}>转账单号</Text>
            <View style={styles.wechatTransferNoWrap}>
              <Text style={styles.wechatDetailValue}>{transferNoTop}</Text>
              {transferNoBottom ? (
                <Text style={styles.wechatDetailValue}>{transferNoBottom}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.wechatService}>
          <Text style={styles.wechatServiceTitle}>账单服务</Text>
          <View style={styles.wechatServiceDivider} />
          <View style={styles.wechatServiceGrid}>
            <ServiceAction
              icon={<MessageCircle color="#6076a4" size={22} />}
              label="定位到聊天位置"
            />
            <ServiceAction
              icon={<ShieldCheck color="#6076a4" size={22} />}
              label="申请转账电子凭证"
            />
            <ServiceAction icon={<RotateCcw color="#6076a4" size={22} />} label="查看往来转账" />
          </View>
        </View>

        <Text style={styles.wechatFooter}>本服务由财付通提供</Text>
      </ScrollView>
    </View>
  )
}

function WechatDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.wechatDetailRow}>
      <Text style={styles.wechatDetailLabel}>{label}</Text>
      <Text style={styles.wechatDetailValue}>{value}</Text>
    </View>
  )
}

function ServiceAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.serviceAction}>
      {icon}
      <Text style={styles.serviceActionText}>{label}</Text>
    </View>
  )
}

function AlipayBillPreview({
  form,
  includeInStats,
  onToggleStats,
}: {
  form: TransferForm
  includeInStats: boolean
  onToggleStats: (value: boolean) => void
}) {
  return (
    <View style={styles.alipayScreen}>
      <MobileStatus time={form.mobileTime} />
      <View style={styles.alipayNav}>
        <ChevronLeft color="#202124" size={30} strokeWidth={2.7} />
        <Text style={styles.alipayNavTitle}>账单详情</Text>
        <View style={styles.alipayNavSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.previewScroll}>
        <View style={styles.alipaySummaryCard}>
          <View style={styles.alipayAvatar}>
            <CircleUserRound color="#ffffff" size={42} strokeWidth={2.4} />
          </View>
          <Text style={styles.alipayMerchant}>{form.accountName}</Text>
          <Text style={styles.alipayAmount}>+{form.amount || '0.00'}</Text>
          <Text style={styles.alipayStatus}>{form.status}</Text>

          <View style={styles.alipayInfoTable}>
            <AlipayInfoRow label="创建时间" value={form.createTime} />
            <AlipayInfoRow label="理由" value={form.reason} />
            <AlipayInfoRow label="转账备注" value={form.remark} />
            <AlipayInfoRow label="对方账户" value={form.counterparty} />
          </View>
          <View style={styles.moreRow}>
            <Text style={styles.moreText}>更多</Text>
            <ChevronDown color="#a3a3a3" size={18} strokeWidth={2.2} />
          </View>
        </View>

        <View style={styles.alipayManageCard}>
          <Text style={styles.alipaySectionTitle}>账单管理</Text>
          <View style={styles.alipayTip}>
            <Text style={styles.alipayTipText}>本笔登上月收入榜，看看分析吧</Text>
            <ChevronRight color="#c79125" size={20} />
          </View>
          <AlipayOptionRow label="账单分类" value={form.category} />
          <AlipayOptionRow label="标签" value="请选择" />
          <View style={styles.recommendBox}>
            <Text style={styles.recommendLabel}>为您推荐</Text>
            <View style={styles.recommendChip}>
              <Text style={styles.redPacket}>🧧</Text>
              <Text style={styles.recommendChipText}>{form.category}</Text>
              <Text style={styles.recommendPlus}>＋</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.alipayRowLabel}>计入收支</Text>
            <Switch
              onValueChange={onToggleStats}
              thumbColor="#ffffff"
              trackColor={{ false: '#c8cdd4', true: '#1477ff' }}
              value={includeInStats}
            />
          </View>

          <View style={styles.memoRow}>
            <View>
              <Text style={styles.alipayRowLabel}>备注</Text>
              <Text style={styles.memoPlaceholder}>点击写备注</Text>
            </View>
            <Camera color="#333333" size={27} strokeWidth={2.3} />
          </View>

          <View style={styles.alipayBottomLinks}>
            <View style={styles.alipayBottomLink}>
              <ReceiptText color="#0a4f93" size={23} strokeWidth={2.3} />
              <Text style={styles.alipayBottomText}>查看往来记录</Text>
            </View>
            <View style={styles.alipayBottomLink}>
              <ReceiptText color="#0a4f93" size={23} strokeWidth={2.3} />
              <Text style={styles.alipayBottomText}>往来流水证明</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

function AlipayInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.alipayInfoRow}>
      <Text style={styles.alipayInfoLabel}>{label}</Text>
      <Text style={styles.alipayInfoValue}>{value}</Text>
    </View>
  )
}

function AlipayOptionRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.alipayOptionRow}>
      <Text style={styles.alipayRowLabel}>{label}</Text>
      <View style={styles.alipayOptionValue}>
        <Text style={styles.alipayOptionText}>{value}</Text>
        <ChevronRight color="#a5a7ac" size={21} strokeWidth={2.4} />
      </View>
    </View>
  )
}

function formatWechatTime(value: string) {
  if (value.includes('年')) {
    return value
  }

  const [date, time] = value.split(' ')
  const [year, month, day] = (date || '').split('-')
  if (!year || !month || !day || !time) {
    return value
  }

  return `${year}年${Number(month)}月${Number(day)}日 ${time}`
}

const styles = StyleSheet.create({
  alipayAmount: {
    color: '#34363a',
    fontSize: 50,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 62,
    marginTop: 16,
  },
  alipayAvatar: {
    alignItems: 'center',
    backgroundColor: '#4aaef7',
    borderRadius: 999,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  alipayBottomLink: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  alipayBottomLinks: {
    borderTopColor: '#edf0f4',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 18,
  },
  alipayBottomText: {
    color: '#0a4f93',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  alipayInfoLabel: {
    color: '#9a9da2',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    width: 94,
  },
  alipayInfoRow: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
  },
  alipayInfoTable: {
    alignSelf: 'stretch',
    marginTop: 34,
  },
  alipayInfoValue: {
    color: '#33363b',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
  },
  alipayManageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 18,
  },
  alipayMerchant: {
    color: '#33363b',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 27,
    marginTop: 20,
    textAlign: 'center',
  },
  alipayNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  alipayNavSpacer: {
    width: 30,
  },
  alipayNavTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  alipayOptionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
  },
  alipayOptionText: {
    color: '#9a9da2',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  alipayOptionValue: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  alipayRowLabel: {
    color: '#33363b',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0,
  },
  alipayScreen: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  alipaySectionTitle: {
    color: '#33363b',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
  },
  alipayStatus: {
    color: '#33363b',
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: 0,
    marginTop: 10,
  },
  alipaySummaryCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 18,
    paddingTop: 30,
  },
  alipayTip: {
    alignItems: 'center',
    backgroundColor: '#fbf8f2',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  alipayTipText: {
    color: '#c79125',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  avatarPhoto: {
    alignItems: 'center',
    backgroundColor: '#dce8ef',
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarPhotoText: {
    color: '#7a5960',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  battery: {
    backgroundColor: '#38c768',
    borderRadius: 5,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 18,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  builder: {
    gap: 22,
    width: '100%',
  },
  builderWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  formSection: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    gap: 6,
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
  memoPlaceholder: {
    color: '#c3c5c9',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 18,
  },
  memoRow: {
    alignItems: 'flex-end',
    borderBottomColor: '#edf0f4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 14,
  },
  mobileStatus: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 42,
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
  moreRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  moreText: {
    color: '#a3a3a3',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  page: {
    padding: 16,
    paddingBottom: 32,
  },
  pageWide: {
    padding: 24,
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
  previewColumn: {
    gap: 10,
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
  recommendBox: {
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
    padding: 14,
  },
  recommendChip: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  recommendChipText: {
    color: '#33363b',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
  },
  recommendLabel: {
    color: '#33363b',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  recommendPlus: {
    color: '#33363b',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  redPacket: {
    fontSize: 17,
  },
  screen: {
    backgroundColor: '#f3f4f6',
    flex: 1,
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
  serviceAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 44,
  },
  serviceActionText: {
    color: '#6076a4',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
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
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  wechatAmount: {
    color: '#111418',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 64,
    marginTop: 34,
  },
  wechatBillTitle: {
    color: '#111418',
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 22,
  },
  wechatDetailLabel: {
    color: '#777a80',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    width: 94,
  },
  wechatDetailRow: {
    flexDirection: 'row',
    gap: 18,
    minHeight: 42,
  },
  wechatDetailValue: {
    color: '#15181c',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 25,
  },
  wechatDetails: {
    borderTopColor: '#e7e7e7',
    borderTopWidth: 1,
    marginHorizontal: 28,
    paddingTop: 36,
  },
  wechatFooter: {
    color: '#b0b2b6',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 168,
    textAlign: 'center',
  },
  wechatHero: {
    alignItems: 'center',
    paddingBottom: 72,
    paddingTop: 52,
  },
  wechatNav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  wechatNavRight: {
    color: '#1d1f23',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  wechatNavTitle: {
    color: '#1d1f23',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  wechatScreen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  wechatService: {
    backgroundColor: '#ffffff',
    borderTopColor: '#eeeeee',
    borderTopWidth: 9,
    marginTop: 36,
    paddingHorizontal: 28,
    paddingTop: 30,
  },
  wechatServiceDivider: {
    backgroundColor: '#eeeeee',
    height: 1,
    marginTop: 22,
  },
  wechatServiceGrid: {
    columnGap: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 26,
    rowGap: 16,
  },
  wechatServiceTitle: {
    color: '#111418',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0,
  },
  wechatTransferNoWrap: {
    flex: 1,
  },
  wifi: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 17,
  },
})
