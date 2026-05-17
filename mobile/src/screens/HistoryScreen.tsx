import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { mockRunRecords } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance, formatDuration, formatPace } from '../lib/format';
import EmptyState from '../components/EmptyState';
import { RunRecord } from '../types';
import type { HistoryStackScreenProps } from '../navigation/types';

type Period = '일별' | '주간' | '월간' | '연간';
type Props = HistoryStackScreenProps<'HistoryHome'>;

const PERIODS: Period[] = ['일별', '주간', '월간', '연간'];

function filterByPeriod(records: RunRecord[], period: Period): RunRecord[] {
  const now = new Date();
  return records.filter((r) => {
    const d = new Date(r.date);
    if (period === '일별') {
      return d.toDateString() === now.toDateString();
    }
    if (period === '주간') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (period === '월간') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    return d.getFullYear() === now.getFullYear();
  });
}

export default function HistoryScreen({ navigation }: Props) {
  const [period, setPeriod] = useState<Period>('일별');

  const filtered = useMemo(() => filterByPeriod(mockRunRecords, period), [period]);

  const totalDistance = filtered.reduce((s, r) => s + r.distance, 0);
  const avgPace = filtered.length ? filtered.reduce((s, r) => s + r.averagePace, 0) / filtered.length : 0;

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, RunRecord[]>>((acc, record) => {
        if (!acc[record.date]) acc[record.date] = [];
        acc[record.date].push(record);
        return acc;
      }, {}),
    [filtered],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>러닝 기록</Text>
      </View>

      <View style={styles.historyTop}>
        <View style={styles.tabRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p)} activeOpacity={0.75}>
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryBand}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>총 거리</Text>
            <Text style={styles.summaryValue}>{formatDistance(totalDistance)}km</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>러닝 횟수</Text>
            <Text style={styles.summaryValue}>{filtered.length}회</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>평균 페이스</Text>
            <Text style={styles.summaryValue}>{filtered.length ? formatPace(avgPace) : '-'}</Text>
          </View>
        </View>
      </View>

      {filtered.length === 0 ? (
        <EmptyState icon="calendar-outline" title={`${period} 기록이 없어요`} description="이 기간에 달린 기록이 없어요" />
      ) : (
        Object.entries(grouped).map(([date, records]) => (
          <View key={date} style={styles.recordGroup}>
            <View style={styles.groupHeader}>
              <View>
                <Text style={styles.groupDate}>{date}</Text>
                <Text style={styles.groupTitle}>달린 날</Text>
              </View>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{records.length}개 저장됨</Text>
              </View>
            </View>

            <View style={styles.recordList}>
              {records.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.recordCard}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('RecordDetail', { record })}
                >
                  <View style={styles.recordTopLine}>
                    <Text style={styles.recordTopLabel}>{record.startTime} 출발</Text>
                    <Text style={styles.recordTopLabel}>{record.district ?? '출발지 자동 기록'}</Text>
                  </View>
                  <Text style={styles.recordTitle}>{record.courseName ?? '자유 달리기'}</Text>
                  <View style={styles.metricRow}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>거리</Text>
                      <Text style={styles.metricValue}>{formatDistance(record.distance)}km</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>페이스</Text>
                      <Text style={styles.metricValue}>{formatPace(record.averagePace)}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricLabel}>시간</Text>
                      <Text style={styles.metricValue}>{formatDuration(record.duration)}</Text>
                    </View>
                  </View>
                  {record.reviewSummary ? (
                    <View style={styles.reviewPill}>
                      <Text style={styles.reviewText}>{record.reviewSummary}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  eyebrow: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  title: { marginTop: 4, fontSize: 28, fontWeight: '700', color: colors.text },
  historyTop: { gap: 14 },
  tabRow: { flexDirection: 'row', gap: 22, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.subtext },
  tabTextActive: { color: colors.text },
  summaryBand: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  summaryMetric: { flex: 1 },
  summaryLabel: { fontSize: 11, color: colors.subtext, fontWeight: '500' },
  summaryValue: { marginTop: 6, fontSize: 17, color: colors.text, fontWeight: '600' },
  summaryDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: colors.line, marginHorizontal: 10 },
  recordGroup: { gap: 12 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupDate: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  groupTitle: { marginTop: 4, fontSize: 20, fontWeight: '700', color: colors.text },
  countPill: { borderRadius: 999, backgroundColor: colors.mutedCard, paddingHorizontal: 12, paddingVertical: 8 },
  countPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  recordList: { gap: 4 },
  recordCard: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 14, paddingBottom: 4 },
  recordTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recordTopLabel: { fontSize: 12, color: colors.subtext, fontWeight: '600' },
  recordTitle: { marginTop: 6, fontSize: 16, fontWeight: '700', color: colors.text },
  metricRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  metricBox: { flex: 1 },
  metricLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  metricValue: { marginTop: 6, fontSize: 15, fontWeight: '600', color: colors.text },
  reviewPill: { marginTop: 12, borderRadius: 12, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  reviewText: { fontSize: 13, lineHeight: 20, color: colors.subtext },
});
