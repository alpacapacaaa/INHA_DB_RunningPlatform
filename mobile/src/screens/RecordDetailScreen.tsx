import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { formatDistance, formatDuration, formatPace } from '../lib/format';
import type { HistoryStackScreenProps } from '../navigation/types';

type Props = HistoryStackScreenProps<'RecordDetail'>;

export default function RecordDetailScreen({ route, navigation }: Props) {
  const { record } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>러닝 기록 상세</Text>
        </View>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.heroSummary}>
        <View style={styles.heroMeta}>
          <Text style={styles.heroDate}>{record.date}</Text>
          <Text style={styles.heroTime}>{record.startTime} 출발</Text>
        </View>
        <Text style={styles.heroPrimary}>{formatDistance(record.distance)}km</Text>
        <Text style={styles.heroSecondary}>
          {formatDuration(record.duration)} · 평균 {formatPace(record.averagePace)}
        </Text>
        <View style={styles.heroStatRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{formatPace(record.fastestPace)}</Text>
            <Text style={styles.heroStatLabel}>최고 페이스</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{record.calories}</Text>
            <Text style={styles.heroStatLabel}>kcal</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{record.district ?? '-'}</Text>
            <Text style={styles.heroStatLabel}>지역</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>코스 정보</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>코스명</Text>
            <Text style={styles.infoValue}>{record.courseName ?? '자유 달리기'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>구간별 페이스</Text>
          <Text style={styles.sectionCaption}>{record.segmentPaces.length}개 구간</Text>
        </View>
        <View style={styles.segmentList}>
          {record.segmentPaces.map((pace, index) => (
            <View key={`${pace}-${index}`} style={styles.segmentItem}>
              <View style={styles.segmentBody}>
                <Text style={styles.segmentTitle}>{index + 1}구간</Text>
                <View style={styles.segmentTrack}>
                  <View style={[styles.segmentFill, { width: `${Math.max(24, 92 - index * 14)}%` }]} />
                </View>
              </View>
              <Text style={styles.segmentPace}>{formatPace(pace)}</Text>
            </View>
          ))}
        </View>
      </View>

      {record.reviewSummary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메모</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>{record.reviewSummary}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, gap: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePill: { flex: 1, borderRadius: 18, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePillText: { fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center' },
  heroSummary: { borderRadius: 28, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 22 },
  heroMeta: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  heroDate: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  heroTime: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  heroPrimary: { fontSize: 56, fontWeight: '900', letterSpacing: -2.2, color: colors.card },
  heroSecondary: { marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.78)', fontWeight: '500' },
  heroStatRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  heroStat: { flex: 1 },
  heroStatValue: { fontSize: 17, fontWeight: '800', color: colors.card },
  heroStatLabel: { marginTop: 4, fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.48)' },
  heroStatDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 8 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  sectionCaption: { fontSize: 12, color: colors.subtext },
  infoRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  infoItem: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  infoValue: { marginTop: 6, fontSize: 16, fontWeight: '600', color: colors.text },
  segmentList: { gap: 4 },
  segmentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingVertical: 14 },
  segmentBody: { flex: 1 },
  segmentTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  segmentTrack: { marginTop: 8, height: 7, borderRadius: 999, backgroundColor: colors.mutedCard, overflow: 'hidden' },
  segmentFill: { height: 7, borderRadius: 999, backgroundColor: colors.primary },
  segmentPace: { fontSize: 15, fontWeight: '700', color: colors.text },
  reviewCard: { borderRadius: 16, backgroundColor: colors.card, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  reviewText: { fontSize: 14, lineHeight: 22, color: colors.subtext },
});
