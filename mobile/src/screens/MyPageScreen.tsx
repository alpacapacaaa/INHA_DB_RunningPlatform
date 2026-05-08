import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { mockUserProfile } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const sections: Array<{ label: string; value: string; icon: IoniconName | 'shoe-print' }> = [
  { label: '러너 등급', value: '블루 러너', icon: 'sparkles-outline' },
  { label: '러닝 테스트', value: '완료됨', icon: 'timer-outline' },
  { label: '관리자 문의', value: '문의하기', icon: 'help-circle-outline' },
  { label: '탈퇴', value: '계정 삭제', icon: 'trash-outline' },
  { label: '신발 모아보기', value: '2개', icon: 'shoe-print' },
  { label: '기록 모아보기', value: '3개', icon: 'documents-outline' },
  { label: '코스 수정, 삭제하기', value: '관리하기', icon: 'create-outline' },
];

export default function MyPageScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>내 러닝</Text>
      </View>

      <View style={styles.profilePanel}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>백</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileLabel}>프로필</Text>
            <Text numberOfLines={1} style={styles.profileName}>{mockUserProfile.name}</Text>
            <Text numberOfLines={1} style={styles.profileMeta}>누적 {formatDistance(mockUserProfile.totalDistance)}km · 평균 페이스 {mockUserProfile.averagePace.toFixed(2)}</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>중급 러너</Text>
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
          {sections.map((section) => (
            <View key={section.label} style={styles.menuItem}>
              <View style={styles.menuIconWrap}>
                {section.icon === 'shoe-print' ? (
                  <MaterialCommunityIcons name="shoe-print" size={18} color={colors.text} />
                ) : (
                  <Ionicons name={section.icon} size={18} color={section.label === '탈퇴' ? colors.danger : colors.text} />
                )}
              </View>
              <View style={styles.menuText}>
                <Text numberOfLines={1} style={[styles.menuTitle, section.label === '탈퇴' && { color: '#B91C1C' }]}>{section.label}</Text>
                <Text numberOfLines={1} style={styles.menuValue}>{section.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
            </View>
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
  title: { marginTop: 4, fontSize: 28, fontWeight: '600', color: colors.text },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  profilePanel: { gap: 16 },
  avatar: { width: 58, height: 58, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '600', color: '#FFFFFF' },
  profileText: { flex: 1, minWidth: 0 },
  profileLabel: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  profileName: { marginTop: 4, fontSize: 24, fontWeight: '600', color: colors.text },
  profileMeta: { marginTop: 6, fontSize: 14, color: '#6B7280' },
  levelPill: { flexShrink: 0, borderRadius: 999, backgroundColor: colors.mutedCard, paddingHorizontal: 12, paddingVertical: 8 },
  levelPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, borderRadius: 14, backgroundColor: colors.card, padding: 12 },
  summaryLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  summaryValue: { marginTop: 8, fontSize: 17, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  menuPanel: { gap: 14 },
  menuList: { marginTop: 14, gap: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14, paddingBottom: 4 },
  menuIconWrap: { width: 38, height: 38, borderRadius: 14, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, minWidth: 0 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  menuValue: { marginTop: 4, fontSize: 13, color: '#6B7280' },
});
