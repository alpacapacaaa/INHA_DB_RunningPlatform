import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Course, RunRecord } from '../types';
import { colors } from '../theme';
import { formatDistance, formatDuration, formatPace } from '../lib/format';
import { mockShoes } from '../data/mockData';

interface RunCompleteScreenProps {
  course?: Course;
  record: RunRecord;
  onBackToRun: () => void;
  onCreateCourse: () => void;
}

export default function RunCompleteScreen({ record, onBackToRun, onCreateCourse }: RunCompleteScreenProps) {
  const shoe = mockShoes[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onBackToRun}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>러닝 완료</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="flag-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSummary}>
        <Text style={styles.heroEyebrow}>오늘의 러닝 기록</Text>
        <Text style={styles.heroPrimary}>{formatDistance(record.distance)}km</Text>
        <Text style={styles.heroSecondary}>{formatDuration(record.duration)} · 평균 {formatPace(record.averagePace)}</Text>
      </View>

      <View style={styles.detailPanel}>
        <View style={styles.shoeRow}>
          <View style={[styles.shoeBadge, { backgroundColor: shoe.accentStart }]}>
            <MaterialCommunityIcons name="shoe-print" size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.infoLabel}>함께한 러닝화</Text>
            <Text style={styles.shoeTitle}>{shoe.brand} {shoe.name}</Text>
            <Text style={styles.shoeSub}>누적 {formatDistance(shoe.totalDistance)}km</Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.infoLabel}>코스</Text>
            <Text style={styles.metricValueSmall}>{record.courseName ?? '자유 달리기'}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.infoLabel}>기록된 시간</Text>
            <Text style={styles.metricValueSmall}>{formatDuration(record.duration)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.infoLabel}>최고 페이스</Text>
            <Text style={styles.metricValue}>{formatPace(record.fastestPace)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.infoLabel}>칼로리</Text>
            <Text style={styles.metricValue}>{record.calories}kcal</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailPanel}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>구간별 평균 페이스</Text>
          <Text style={styles.sectionCaption}>{record.segmentPaces.length}개 구간</Text>
        </View>
        <View style={styles.segmentList}>
          {record.segmentPaces.map((pace, index) => (
            <View key={`${pace}-${index}`} style={styles.segmentItem}>
              <View style={styles.segmentBody}>
                <Text style={styles.segmentTitle}>{index + 1}구간</Text>
                <View style={styles.segmentTrack}>
                  <View style={[styles.segmentFill, { width: `${Math.max(28, 88 - index * 12)}%` }]} />
                </View>
              </View>
              <Text style={styles.segmentPace}>{formatPace(pace)}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onCreateCourse}>
        <Text style={styles.primaryButtonText}>코스 등록하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  titlePill: { flex: 1, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center' },
  titlePillText: { fontSize: 16, fontWeight: '600', color: colors.text },
  heroSummary: {
    borderRadius: 22,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroEyebrow: { fontSize: 12, color: 'rgba(255,255,255,0.62)', fontWeight: '500' },
  heroPrimary: { marginTop: 8, fontSize: 40, fontWeight: '700', color: '#FFFFFF' },
  heroSecondary: { marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.78)', fontWeight: '500' },
  shoeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  detailPanel: { gap: 14 },
  shoeBadge: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  shoeTitle: { marginTop: 4, fontSize: 17, fontWeight: '600', color: colors.text },
  shoeSub: { marginTop: 2, fontSize: 13, color: '#6B7280' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flexBasis: '47%', flexGrow: 1, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
  metricValue: { marginTop: 8, fontSize: 23, fontWeight: '600', color: colors.text },
  metricValueSmall: { marginTop: 8, fontSize: 16, fontWeight: '600', color: colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  sectionCaption: { fontSize: 12, color: colors.subtext },
  segmentList: { gap: 10 },
  segmentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14 },
  segmentBody: { flex: 1 },
  segmentTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  segmentTrack: { marginTop: 8, height: 8, borderRadius: 999, backgroundColor: '#DADFEA', overflow: 'hidden' },
  segmentFill: { height: 8, borderRadius: 999, backgroundColor: colors.accent },
  segmentPace: { fontSize: 16, fontWeight: '600', color: colors.accent },
  primaryButton: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
