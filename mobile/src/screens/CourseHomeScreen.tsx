import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { mockCourses } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';
import { Course } from '../types';
import EmptyState from '../components/EmptyState';
import type { CourseStackScreenProps } from '../navigation/types';

type SortType = '좋아요순' | '거리순';
type Props = CourseStackScreenProps<'CourseHome'>;

function getPreviewRegion(course?: Course) {
  const coordinates = course?.routeCoordinates ?? [];
  if (!coordinates.length) {
    return { latitude: 37.5273, longitude: 126.9327, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  }
  const latitudes = coordinates.map((c) => c.latitude);
  const longitudes = coordinates.map((c) => c.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 2.2, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 2.2, 0.01),
  };
}

export default function CourseHomeScreen({ navigation }: Props) {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [activeTab, setActiveTab] = useState<'공식' | '사용자'>('공식');
  const [sortType, setSortType] = useState<SortType>('좋아요순');

  const regionOptions = ['서울', '부산', '제주'];
  const districtOptions = ['전체', '영등포구', '종로구', '광진구'];

  const visibleCourses = useMemo(() => {
    const filtered = mockCourses
      .filter((c) => c.region === selectedRegion)
      .filter((c) => selectedDistrict === '전체' || c.district === selectedDistrict)
      .filter((c) => (activeTab === '공식' ? c.isOfficial : !c.isOfficial));
    return filtered.sort((a, b) => (sortType === '좋아요순' ? b.likes - a.likes : a.distance - b.distance));
  }, [activeTab, selectedDistrict, selectedRegion, sortType]);

  const nearbyCourses = visibleCourses.filter((c) => c.nearbyDistanceKm <= 3);
  const heroCourse = nearbyCourses[0] ?? visibleCourses[0];
  const heroRegion = getPreviewRegion(heroCourse);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.heroShell}>
        <View style={styles.heroHeader}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>SR</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.84}>
              <Ionicons name="notifications-outline" size={19} color={colors.card} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.84}>
              <Ionicons name="options-outline" size={19} color={colors.card} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.eyebrow}>오늘의 코스</Text>
        <Text style={styles.title}>지도를 그리듯 뛰고, 여행하듯 발견해요.</Text>

        <View style={styles.heroMap}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={heroRegion}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {heroCourse?.routeCoordinates?.length ? (
              <Polyline coordinates={heroCourse.routeCoordinates} strokeColor={colors.accent} strokeWidth={6} lineCap="round" lineJoin="round" />
            ) : null}
            {heroCourse?.routeCoordinates?.length ? <Marker coordinate={heroCourse.routeCoordinates[0]} title={heroCourse.name} /> : null}
          </MapView>
          <View style={styles.heroMapShade} />
          <View style={styles.heroBadge}>
            <Ionicons name="navigate" size={13} color={colors.primary} />
            <Text style={styles.heroBadgeText}>가까운 코스</Text>
          </View>
          <View style={styles.heroCourseCard}>
            <View style={styles.heroTopLine}>
              <Text style={styles.heroSmall}>today pick</Text>
              <Text style={styles.heroAccent}>{heroCourse ? `${heroCourse.nearbyDistanceKm.toFixed(1)}km away` : 'ready'}</Text>
            </View>
            <Text numberOfLines={1} style={styles.heroTitle}>{heroCourse?.name ?? '오늘의 코스'}</Text>
            <View style={styles.heroMetrics}>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricValue}>{heroCourse ? formatDistance(heroCourse.distance) : '0.00'}</Text>
                <Text style={styles.heroMetricLabel}>km</Text>
              </View>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricValue}>{heroCourse?.difficulty ?? 'READY'}</Text>
                <Text style={styles.heroMetricLabel}>level</Text>
              </View>
              <View style={styles.heroMetric}>
                <Text style={styles.heroMetricValue}>{heroCourse?.reviewScore.toFixed(1) ?? '0.0'}</Text>
                <Text style={styles.heroMetricLabel}>review</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.filterTop}>
          <View>
            <Text style={styles.panelEyebrow}>course finder</Text>
            <Text style={styles.panelTitle}>조건을 고르면 코스가 좁혀져요</Text>
          </View>
          <Text style={styles.filterCount}>{visibleCourses.length}개</Text>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>지역</Text>
          <View style={styles.chipWrap}>
            {regionOptions.map((region) => (
              <TouchableOpacity key={region} onPress={() => setSelectedRegion(region)} style={[styles.chip, selectedRegion === region && styles.chipActive]} activeOpacity={0.84}>
                <Text style={[styles.chipText, selectedRegion === region && styles.chipTextActive]}>{region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>구</Text>
          <View style={styles.chipWrap}>
            {districtOptions.map((district) => (
              <TouchableOpacity key={district} onPress={() => setSelectedDistrict(district)} style={[styles.chip, selectedDistrict === district && styles.chipSoftActive]} activeOpacity={0.84}>
                <Text style={[styles.chipText, selectedDistrict === district && styles.chipSoftActiveText]}>{district}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.controlGrid}>
          <View style={styles.controlBlock}>
            <Text style={styles.filterLabel}>유형</Text>
            <View style={styles.segmentedGroup}>
              {(['공식', '사용자'] as const).map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.segmentedButton, activeTab === tab && styles.segmentedButtonActive]} activeOpacity={0.84}>
                  <Text style={[styles.segmentedText, activeTab === tab && styles.segmentedTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.controlBlock}>
            <Text style={styles.filterLabel}>정렬</Text>
            <View style={styles.segmentedGroup}>
              {(['좋아요순', '거리순'] as const).map((type) => (
                <TouchableOpacity key={type} onPress={() => setSortType(type)} style={[styles.segmentedButton, sortType === type && styles.segmentedButtonActive]} activeOpacity={0.84}>
                  <Text style={[styles.segmentedText, sortType === type && styles.segmentedTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>추천 코스</Text>
        <Text style={styles.sectionCaption}>{sortType}</Text>
      </View>

      <View style={styles.courseList}>
        {visibleCourses.length === 0 ? (
          <EmptyState icon="map-outline" title="조건에 맞는 코스가 없어요" description="지역이나 유형 필터를 바꿔보세요" />
        ) : null}

        {visibleCourses.map((course, index) => (
          <TouchableOpacity key={course.id} style={styles.courseCard} activeOpacity={0.94} onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}>
            <View style={[styles.courseThumb, { backgroundColor: course.coverColor }]}>
              <View style={styles.routeCanvas}>
                <View style={[styles.routeLine, styles.routeLineTop]} />
                <View style={[styles.routeLine, styles.routeLineRight]} />
                <View style={[styles.routeLine, styles.routeLineBottom]} />
                <View style={[styles.routeLine, styles.routeLineLeft]} />
                <View style={styles.routeDotStart} />
                <View style={styles.routeDotEnd} />
              </View>
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{course.region} · {course.district}</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
            </View>
            <View style={styles.courseBody}>
              <Text style={styles.courseShape}>{course.isOfficial ? '공식 코스' : '유저 코스'} · {course.shapeType}</Text>
              <Text numberOfLines={1} style={styles.courseName}>{course.name}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{formatDistance(course.distance)}km</Text>
                <Text style={styles.metaDot}>/</Text>
                <Text style={styles.metaText}>완주 {course.completedCount.toLocaleString()}회</Text>
                <Text style={styles.metaDot}>/</Text>
                <Text style={styles.metaText}>후기 {course.reviewScore.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.courseArrow}>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 46, gap: 18 },
  heroShell: { borderRadius: 32, backgroundColor: colors.primary, padding: 16, overflow: 'hidden', shadowColor: colors.shadow, shadowOpacity: 0.24, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 10 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brandMark: { width: 42, height: 42, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { fontSize: 14, fontWeight: '900', color: colors.primary },
  headerButtons: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 42, height: 42, borderRadius: 16, backgroundColor: 'rgba(255,252,242,0.11)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,252,242,0.10)' },
  eyebrow: { marginTop: 24, fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.52)' },
  title: { marginTop: 8, fontSize: 28, lineHeight: 36, fontWeight: '900', letterSpacing: -0.8, color: colors.card },
  heroMap: { marginTop: 20, minHeight: 330, borderRadius: 26, backgroundColor: '#1C1C1E', overflow: 'hidden' },
  heroMapShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.14)' },
  heroBadge: { position: 'absolute', left: 14, top: 14, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: colors.accent },
  heroBadgeText: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  heroCourseCard: { position: 'absolute', left: 12, right: 12, bottom: 12, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.88)', padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  heroTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  heroSmall: { fontSize: 11, color: 'rgba(255,255,255,0.56)', fontWeight: '800', letterSpacing: 0.8 },
  heroAccent: { fontSize: 12, color: colors.accent, fontWeight: '800' },
  heroTitle: { marginTop: 8, fontSize: 22, fontWeight: '900', letterSpacing: -0.4, color: colors.card },
  heroMetrics: { marginTop: 14, flexDirection: 'row', gap: 10 },
  heroMetric: { flex: 1, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', padding: 12 },
  heroMetricValue: { fontSize: 16, fontWeight: '900', color: colors.card },
  heroMetricLabel: { marginTop: 3, fontSize: 11, color: 'rgba(255,255,255,0.48)', fontWeight: '700' },
  filterPanel: { borderRadius: 28, backgroundColor: colors.card, padding: 16, gap: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  filterTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  panelEyebrow: { fontSize: 12, color: colors.accent, fontWeight: '800' },
  panelTitle: { marginTop: 5, fontSize: 17, lineHeight: 24, color: colors.text, fontWeight: '700' },
  filterCount: { fontSize: 13, fontWeight: '800', color: colors.accentDeep },
  filterBlock: { gap: 10 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: colors.subtext },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 16, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: colors.background, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, minHeight: 40, justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSoftActive: { backgroundColor: '#E3F8EC', borderColor: '#E3F8EC' },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.subtext },
  chipTextActive: { color: colors.card },
  chipSoftActiveText: { color: colors.accentDeep },
  controlGrid: { gap: 12 },
  controlBlock: { gap: 10 },
  segmentedGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmentedButton: { borderRadius: 16, paddingHorizontal: 15, paddingVertical: 10, backgroundColor: colors.background, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, minHeight: 40, justifyContent: 'center' },
  segmentedButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentedText: { fontSize: 13, fontWeight: '700', color: colors.subtext },
  segmentedTextActive: { color: colors.card },
  sectionHeader: { marginTop: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  sectionTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.3, color: colors.text },
  sectionCaption: { fontSize: 12, color: colors.subtext, fontWeight: '700' },
  courseList: { gap: 12 },
  courseCard: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.card, borderRadius: 24, padding: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, shadowColor: colors.shadow, shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  courseThumb: { width: 106, height: 112, borderRadius: 18, overflow: 'hidden', padding: 10 },
  routeCanvas: { position: 'absolute', left: 10, right: 10, top: 12, bottom: 12 },
  routeLine: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.55)' },
  routeLineTop: { left: 18, right: 26, top: 18, height: 5 },
  routeLineRight: { right: 24, top: 18, bottom: 26, width: 5 },
  routeLineBottom: { left: 30, right: 24, bottom: 26, height: 5 },
  routeLineLeft: { left: 30, top: 42, bottom: 26, width: 5 },
  routeDotStart: { position: 'absolute', left: 12, top: 12, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.accent, borderWidth: 3, borderColor: colors.card },
  routeDotEnd: { position: 'absolute', right: 18, bottom: 20, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.card },
  courseBadge: { alignSelf: 'flex-start', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 5 },
  courseBadgeText: { fontSize: 10, fontWeight: '700', color: colors.text },
  rankBadge: { position: 'absolute', right: 8, bottom: 8, width: 32, height: 32, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 11, fontWeight: '900', color: colors.accent },
  courseBody: { flex: 1, minWidth: 0 },
  courseShape: { fontSize: 12, fontWeight: '600', color: colors.subtext },
  courseName: { marginTop: 5, fontSize: 17, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 8 },
  metaText: { fontSize: 12, color: colors.subtext, fontWeight: '600' },
  metaDot: { marginHorizontal: 5, color: colors.line },
  courseArrow: { width: 36, height: 36, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
