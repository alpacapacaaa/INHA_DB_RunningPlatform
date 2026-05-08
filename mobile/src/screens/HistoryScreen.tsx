import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockRunRecords } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance, formatDuration, formatPace } from '../lib/format';

const grouped = mockRunRecords.reduce<Record<string, typeof mockRunRecords>>((acc, record) => {
  if (!acc[record.date]) acc[record.date] = [];
  acc[record.date].push(record);
  return acc;
}, {});

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>러닝 기록</Text>
      </View>

      <View style={styles.historyTop}>
        <View style={styles.tabRow}>
          {['일별', '주간', '월간', '연간'].map((tab, index) => (
            <Text key={tab} style={[styles.tabText, index === 0 && styles.tabTextActive]}>{tab}</Text>
          ))}
        </View>
        <View style={styles.summaryBand}>
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>이번 주 거리</Text>
            <Text style={styles.summaryValue}>22.00km</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>러닝 횟수</Text>
            <Text style={styles.summaryValue}>3회</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryMetric}>
            <Text style={styles.summaryLabel}>평균 페이스</Text>
            <Text style={styles.summaryValue}>5'33"</Text>
          </View>
        </View>
      </View>

      {Object.entries(grouped).map(([date, records]) => (
        <View key={date} style={styles.recordGroup}>
          <View style={styles.groupHeader}>
            <View>
              <Text style={styles.groupDate}>{date}</Text>
              <Text style={styles.groupTitle}>오늘의 기록</Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{records.length}개 저장됨</Text>
            </View>
          </View>

          <View style={styles.recordList}>
            {records.map((record) => (
              <View key={record.id} style={styles.recordCard}>
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
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  eyebrow: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  title: { marginTop: 4, fontSize: 28, fontWeight: '600', color: colors.text },
  historyTop: { gap: 14 },
  tabRow: { flexDirection: 'row', gap: 22, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.subtext },
  tabTextActive: { color: colors.text },
  summaryBand: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  summaryMetric: { flex: 1 },
  summaryLabel: { fontSize: 11, color: colors.subtext, fontWeight: '500' },
  summaryValue: { marginTop: 6, fontSize: 17, color: colors.text, fontWeight: '600' },
  summaryDivider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.line, marginHorizontal: 10 },
  recordGroup: { gap: 12 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupDate: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  groupTitle: { marginTop: 4, fontSize: 20, fontWeight: '600', color: colors.text },
  countPill: { borderRadius: 999, backgroundColor: colors.mutedCard, paddingHorizontal: 12, paddingVertical: 8 },
  countPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  recordList: { marginTop: 14, gap: 12 },
  recordCard: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 14 },
  recordTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recordTopLabel: { fontSize: 12, color: colors.subtext, fontWeight: '600' },
  recordTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  metricRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  metricBox: { flex: 1 },
  metricLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  metricValue: { marginTop: 8, fontSize: 16, fontWeight: '600', color: colors.text },
  reviewPill: { marginTop: 12, borderRadius: 14, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 12 },
  reviewText: { fontSize: 14, lineHeight: 22, color: '#58606B' },
});
