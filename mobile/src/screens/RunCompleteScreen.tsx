import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCourseById, mockShoes } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance, formatDuration, formatPace } from '../lib/format';
import type { RunStackScreenProps } from '../navigation/types';

type Props = RunStackScreenProps<'RunComplete'>;

export default function RunCompleteScreen({ route, navigation }: Props) {
  const { record, courseId } = route.params;
  const course = courseId ? getCourseById(courseId) : undefined;
  const shoe = mockShoes[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>러닝 완료</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSummary}>
        <Text style={styles.heroEyebrow}>완주 기록</Text>
        <Text style={styles.heroPrimary}>{formatDistance(record.distance)}km</Text>
        <Text style={styles.heroSecondary}>{formatDuration(record.duration)} · 평균 {formatPace(record.averagePace)}</Text>
        <View style={styles.heroStatRow}>
          <View>
            <Text style={styles.heroStatValue}>{formatPace(record.fastestPace)}</Text>
            <Text style={styles.heroStatLabel}>최고 페이스</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View>
            <Text style={styles.heroStatValue}>{record.calories}</Text>
            <Text style={styles.heroStatLabel}>kcal</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View>
            <Text style={styles.heroStatValue}>{record.segmentPaces.length}</Text>
            <Text style={styles.heroStatLabel}>구간</Text>
          </View>
        </View>
      </View>

      <View style={styles.routePreview}>
        <View style={styles.routeLineA} />
        <View style={styles.routeLineB} />
        <View style={styles.routeLineC} />
        <View style={styles.routeStart} />
        <View style={styles.routeEnd} />
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>기록된 코스</Text>
          <Text numberOfLines={1} style={styles.routeTitle}>{record.courseName ?? '자유 달리기'}</Text>
        </View>
      </View>

      <View style={styles.detailPanel}>
        <View style={styles.shoeRow}>
          <View style={[styles.shoeBadge, { backgroundColor: shoe.accentStart }]}>
            <MaterialCommunityIcons name="shoe-print" size={22} color={colors.card} />
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

      <View style={styles.actionRow}>
        {course && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CreateCourse', { record })}
          >
            <Text style={styles.secondaryButtonText}>코스 등록하기</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            navigation.getParent()?.getParent()?.navigate('Main', { screen: 'History' });
          }}
        >
          <Text style={styles.primaryButtonText}>기록 확인하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 28, gap: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePill: { flex: 1, borderRadius: 18, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePillText: { fontSize: 15, fontWeight: '600', color: colors.text },
  heroSummary: { borderRadius: 28, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 22 },
  heroEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.56)', fontWeight: '800', letterSpacing: 1.1 },
  heroPrimary: { marginTop: 8, fontSize: 56, fontWeight: '900', letterSpacing: -2.2, color: colors.card },
  heroSecondary: { marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.78)', fontWeight: '500' },
  heroStatRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heroStatValue: { fontSize: 18, fontWeight: '900', color: colors.card },
  heroStatLabel: { marginTop: 3, fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.48)' },
  heroStatDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.12)' },
  routePreview: { minHeight: 156, borderRadius: 28, backgroundColor: colors.mutedCard, overflow: 'hidden', padding: 16 },
  routeLineA: { position: 'absolute', left: 38, right: 70, top: 44, height: 6, borderRadius: 999, backgroundColor: colors.primary },
  routeLineB: { position: 'absolute', right: 66, top: 44, bottom: 54, width: 6, borderRadius: 999, backgroundColor: colors.primary },
  routeLineC: { position: 'absolute', left: 70, right: 66, bottom: 54, height: 6, borderRadius: 999, backgroundColor: colors.primary },
  routeStart: { position: 'absolute', left: 30, top: 36, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, borderWidth: 4, borderColor: colors.card },
  routeEnd: { position: 'absolute', right: 57, bottom: 46, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, borderWidth: 4, borderColor: colors.card },
  routeInfo: { position: 'absolute', left: 16, right: 16, bottom: 16, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.94)', paddingHorizontal: 14, paddingVertical: 12 },
  routeLabel: { fontSize: 11, fontWeight: '600', color: colors.subtext },
  routeTitle: { marginTop: 4, fontSize: 16, fontWeight: '700', color: colors.text },
  shoeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  detailPanel: { gap: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 16 },
  shoeBadge: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  shoeTitle: { marginTop: 4, fontSize: 16, fontWeight: '600', color: colors.text },
  shoeSub: { marginTop: 2, fontSize: 13, color: colors.subtext },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flexBasis: '47%', flexGrow: 1, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 12 },
  metricValue: { marginTop: 8, fontSize: 22, fontWeight: '600', color: colors.text },
  metricValueSmall: { marginTop: 8, fontSize: 15, fontWeight: '600', color: colors.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  sectionCaption: { fontSize: 12, color: colors.subtext },
  segmentList: { gap: 10 },
  segmentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 14 },
  segmentBody: { flex: 1 },
  segmentTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  segmentTrack: { marginTop: 8, height: 7, borderRadius: 999, backgroundColor: colors.mutedCard, overflow: 'hidden' },
  segmentFill: { height: 7, borderRadius: 999, backgroundColor: colors.primary },
  segmentPace: { fontSize: 15, fontWeight: '700', color: colors.text },
  actionRow: { flexDirection: 'row', gap: 12 },
  primaryButton: { flex: 1, borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 17, alignItems: 'center' },
  primaryButtonText: { fontSize: 15, fontWeight: '800', color: colors.card },
  secondaryButton: { flex: 1, borderRadius: 22, backgroundColor: colors.mutedCard, paddingVertical: 17, alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  secondaryButtonText: { fontSize: 15, fontWeight: '700', color: colors.text },
});
