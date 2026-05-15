import type { ComponentProps } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { mockUserProfile } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';
import { useToast } from '../components/Toast';
import type { MyPageStackScreenProps } from '../navigation/types';

type Props = MyPageStackScreenProps<'MyPageHome'>;
type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  label: string;
  value: string;
  icon: IoniconName | 'shoe-print';
  onPress?: () => void;
  danger?: boolean;
}

const levelLabel = (level?: string) => {
  const map: Record<string, string> = { BEGINNER: '입문 러너', INTERMEDIATE: '중급 러너', ADVANCED: '고급 러너', ELITE: '엘리트' };
  return level ? (map[level] ?? level) : '레벨 미측정';
};

export default function MyPageScreen({ navigation }: Props) {
  const { showToast } = useToast();

  const menuItems: MenuItem[] = [
    { label: '러너 등급', value: levelLabel(mockUserProfile.level), icon: 'sparkles-outline', onPress: () => navigation.navigate('LevelTest') },
    { label: '러닝 테스트', value: mockUserProfile.levelTested ? '완료됨' : '테스트 하기', icon: 'timer-outline', onPress: () => navigation.navigate('LevelTest') },
    { label: '신발 모아보기', value: `${mockUserProfile.shoes.length}개`, icon: 'shoe-print', onPress: () => navigation.navigate('Shoes') },
    { label: '기록 모아보기', value: `${mockUserProfile.records.length}개`, icon: 'documents-outline', onPress: () => navigation.navigate('LevelTest') },
    { label: '코스 수정, 삭제하기', value: '관리하기', icon: 'create-outline', onPress: () => showToast('준비 중인 기능이에요.', 'info') },
    { label: '관리자 문의', value: '문의하기', icon: 'help-circle-outline', onPress: () => showToast('문의 기능은 준비 중이에요.', 'info') },
    {
      label: '탈퇴',
      value: '계정 삭제',
      icon: 'trash-outline',
      danger: true,
      onPress: () =>
        Alert.alert('탈퇴 확인', '정말 탈퇴하시겠어요? 모든 기록이 삭제됩니다.', [
          { text: '취소', style: 'cancel' },
          { text: '탈퇴', style: 'destructive', onPress: () => showToast('탈퇴 처리됐어요.', 'error') },
        ]),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>내 러닝</Text>
      </View>

      <View style={styles.profilePanel}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{mockUserProfile.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileLabel}>프로필</Text>
            <Text numberOfLines={1} style={styles.profileName}>{mockUserProfile.name}</Text>
            <Text numberOfLines={1} style={styles.profileMeta}>
              누적 {formatDistance(mockUserProfile.totalDistance)}km · 평균 페이스 {mockUserProfile.averagePace.toFixed(2)}
            </Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>{levelLabel(mockUserProfile.level)}</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>누적 거리</Text>
            <Text style={styles.summaryValue}>{formatDistance(mockUserProfile.totalDistance)}km</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>러닝 횟수</Text>
            <Text style={styles.summaryValue}>{mockUserProfile.records.length}회</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>보유 신발</Text>
            <Text style={styles.summaryValue}>{mockUserProfile.shoes.length}개</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuPanel}>
        <Text style={styles.sectionTitle}>관리 메뉴</Text>
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.75} onPress={item.onPress}>
              <View style={styles.menuIconWrap}>
                {item.icon === 'shoe-print' ? (
                  <MaterialCommunityIcons name="shoe-print" size={18} color={item.danger ? colors.danger : colors.text} />
                ) : (
                  <Ionicons name={item.icon as IoniconName} size={18} color={item.danger ? colors.danger : colors.text} />
                )}
              </View>
              <View style={styles.menuText}>
                <Text numberOfLines={1} style={[styles.menuTitle, item.danger && { color: colors.danger }]}>{item.label}</Text>
                <Text numberOfLines={1} style={styles.menuValue}>{item.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.line} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  eyebrow: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  title: { marginTop: 4, fontSize: 28, fontWeight: '700', color: colors.text },
  profilePanel: { gap: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800', color: colors.card },
  profileText: { flex: 1, minWidth: 0 },
  profileLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  profileName: { marginTop: 4, fontSize: 22, fontWeight: '700', color: colors.text },
  profileMeta: { marginTop: 4, fontSize: 13, color: colors.subtext },
  levelPill: { flexShrink: 0, borderRadius: 999, backgroundColor: colors.mutedCard, paddingHorizontal: 12, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  levelPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, borderRadius: 14, backgroundColor: colors.card, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  summaryLabel: { fontSize: 11, color: colors.subtext, fontWeight: '500' },
  summaryValue: { marginTop: 8, fontSize: 16, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  menuPanel: { gap: 14 },
  menuList: { gap: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingVertical: 14 },
  menuIconWrap: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.mutedCard, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, minWidth: 0 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  menuValue: { marginTop: 3, fontSize: 13, color: colors.subtext },
});
