import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { mockCourses } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';
import SectionCard from '../components/SectionCard';
import { Course } from '../types';

type SortType = '좋아요순' | '거리순';

interface CourseHomeScreenProps {
  onSelectCourse: (courseId: string) => void;
}

function getPreviewRegion(course?: Course) {
  const coordinates = course?.routeCoordinates ?? [];

  if (!coordinates.length) {
    return {
      latitude: 37.5273,
      longitude: 126.9327,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }

  const latitudes = coordinates.map((coordinate) => coordinate.latitude);
  const longitudes = coordinates.map((coordinate) => coordinate.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 2.2, 0.01),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 2.2, 0.01),
  };
}

export default function CourseHomeScreen({ onSelectCourse }: CourseHomeScreenProps) {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');
  const [activeTab, setActiveTab] = useState<'공식' | '사용자'>('공식');
  const [sortType, setSortType] = useState<SortType>('좋아요순');

  const regionOptions = ['서울', '부산', '제주'];
  const districtOptions = ['전체', '영등포구', '종로구', '광진구'];

  const visibleCourses = useMemo(() => {
    const filtered = mockCourses
      .filter((course) => course.region === selectedRegion)
      .filter((course) => selectedDistrict === '전체' || course.district === selectedDistrict)
      .filter((course) => (activeTab === '공식' ? course.isOfficial : !course.isOfficial));

    return filtered.sort((a, b) => (sortType === '좋아요순' ? b.likes - a.likes : a.distance - b.distance));
  }, [activeTab, selectedDistrict, selectedRegion, sortType]);

  const nearbyCourses = visibleCourses.filter((course) => course.nearbyDistanceKm <= 3);
  const heroCourse = nearbyCourses[0] ?? visibleCourses[0];
  const heroRegion = getPreviewRegion(heroCourse);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Shape Run</Text>
          <Text style={styles.title}>드로잉 코스</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <SectionCard>
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
              <Polyline
                coordinates={heroCourse.routeCoordinates}
                strokeColor="#2457F5"
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />
            ) : null}
            {heroCourse?.routeCoordinates?.length ? (
              <Marker coordinate={heroCourse.routeCoordinates[0]} title={heroCourse.name} />
            ) : null}
          </MapView>
          <View style={styles.heroOverlay} />
          <View style={styles.heroBadge}>
            <Ionicons name="navigate-outline" size={14} color={colors.green} />
            <Text style={styles.heroBadgeText}>3km 이내</Text>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroTopLine}>
              <Text style={styles.heroSmall}>코스</Text>
              <Text style={styles.heroAccent}>{heroCourse ? `${heroCourse.nearbyDistanceKm.toFixed(1)}km 거리` : '가까운 코스'}</Text>
            </View>
            <Text style={styles.heroTitle}>{heroCourse?.name ?? '여의도 고구마런'}</Text>
            <Text style={styles.heroDescription}>
              {heroCourse ? `${heroCourse.district} · 좋아요 ${heroCourse.likes.toLocaleString()}개 · 후기 ${heroCourse.reviewScore.toFixed(1)}` : '주변 코스'}
            </Text>
          </View>
        </View>

        <View style={styles.heroMetaLine}>
          <Text style={styles.heroMetaText}>근처 {nearbyCourses.length}개</Text>
          <View style={styles.metaDivider} />
          <Text style={styles.heroMetaText}>{sortType}</Text>
          <View style={styles.metaDivider} />
          <Text style={styles.heroMetaText}>최근 8.42km</Text>
        </View>
      </SectionCard>

      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>필터</Text>
          <Text style={styles.filterCount}>{visibleCourses.length}개</Text>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>지역</Text>
          <View style={styles.chipWrap}>
            {regionOptions.map((region) => (
              <TouchableOpacity
                key={region}
                onPress={() => setSelectedRegion(region)}
                style={[styles.chip, selectedRegion === region && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedRegion === region && styles.chipTextActive]}>{region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>구</Text>
          <View style={styles.chipWrap}>
            {districtOptions.map((district) => (
              <TouchableOpacity
                key={district}
                onPress={() => setSelectedDistrict(district)}
                style={[styles.chip, selectedDistrict === district && styles.chipSoftActive]}
              >
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
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.segmentedButton, activeTab === tab && styles.segmentedButtonActive]}>
                  <Text style={[styles.segmentedText, activeTab === tab && styles.segmentedTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.controlBlock}>
            <Text style={styles.filterLabel}>정렬</Text>
            <View style={styles.segmentedGroup}>
              {(['좋아요순', '거리순'] as const).map((type) => (
                <TouchableOpacity key={type} onPress={() => setSortType(type)} style={[styles.segmentedButton, sortType === type && styles.segmentedButtonActive]}>
                  <Text style={[styles.segmentedText, sortType === type && styles.segmentedTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>코스</Text>
        </View>
      </View>

      <View style={styles.courseList}>
        {visibleCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={24} color={colors.subtext} />
            <Text style={styles.emptyTitle}>코스 없음</Text>
          </View>
        ) : null}

        {visibleCourses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard} activeOpacity={0.95} onPress={() => onSelectCourse(course.id)}>
            <View style={[styles.courseThumb, { backgroundColor: course.coverColor }]}>
              <View style={styles.routeCanvas}>
                <View style={styles.routeLineTop} />
                <View style={styles.routeLineRight} />
                <View style={styles.routeLineBottom} />
                <View style={styles.routeLineLeft} />
                <View style={styles.routeDotStart} />
                <View style={styles.routeDotEnd} />
              </View>
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{course.region} · {course.district}</Text>
              </View>
              <TouchableOpacity style={styles.reportButton}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.text} />
              </TouchableOpacity>
              <View style={styles.courseGlass}>
                <Text style={styles.courseShape}>{course.shapeType} 드로잉</Text>
                <Text style={styles.courseName}>{course.name}</Text>
              </View>
            </View>
            <View style={styles.courseMeta}>
              <Text style={styles.courseSubMeta}>완주 {course.completedCount.toLocaleString()}회</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{formatDistance(course.distance)}km</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>좋아요 {course.likes.toLocaleString()}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>후기 {course.reviewScore.toFixed(1)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 44, gap: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerText: { flex: 1, paddingRight: 14 },
  eyebrow: { fontSize: 13, fontWeight: '500', color: colors.subtext },
  title: { marginTop: 4, fontSize: 28, fontWeight: '600', color: colors.text },
  headerButtons: { flexDirection: 'row', gap: 8, flexShrink: 0 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroMap: {
    borderRadius: 22,
    backgroundColor: '#EEF6EB',
    padding: 16,
    minHeight: 286,
    overflow: 'hidden',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroBadge: {
    position: 'absolute',
    left: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  heroBadgeText: { fontSize: 12, color: colors.green, fontWeight: '600' },
  heroBottom: {
    marginTop: 172,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  heroTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroSmall: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  heroAccent: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  heroTitle: { marginTop: 8, fontSize: 23, fontWeight: '600', color: colors.text },
  heroDescription: { marginTop: 6, fontSize: 14, color: '#6B7280' },
  heroMetaLine: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroMetaText: { fontSize: 13, fontWeight: '500', color: colors.subtext },
  metaDivider: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#C7CBD1' },
  filterPanel: {
    borderRadius: 22,
    backgroundColor: colors.card,
    padding: 16,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.025,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  filterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  filterCount: { fontSize: 13, fontWeight: '500', color: colors.subtext },
  filterBlock: { gap: 10 },
  filterLabel: { fontSize: 12, fontWeight: '500', color: colors.subtext },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: colors.mutedCard,
    minHeight: 38,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary },
  chipSoftActive: { backgroundColor: colors.softBlue },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },
  chipSoftActiveText: { color: colors.accent },
  controlGrid: { gap: 12 },
  controlBlock: { gap: 10 },
  segmentedGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmentedButton: {
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: colors.mutedCard,
    minHeight: 38,
    justifyContent: 'center',
  },
  segmentedButtonActive: { backgroundColor: colors.primary },
  segmentedText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  segmentedTextActive: { color: '#FFFFFF' },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.text },
  courseList: { gap: 14 },
  courseCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.035,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  courseThumb: { borderRadius: 16, minHeight: 138, overflow: 'hidden', padding: 12 },
  routeCanvas: {
    position: 'absolute',
    left: 28,
    right: 28,
    top: 22,
    bottom: 20,
  },
  routeLineTop: { position: 'absolute', left: 28, right: 58, top: 20, height: 5, borderRadius: 999, backgroundColor: 'rgba(36,87,245,0.72)' },
  routeLineRight: { position: 'absolute', right: 54, top: 20, bottom: 32, width: 5, borderRadius: 999, backgroundColor: 'rgba(36,87,245,0.72)' },
  routeLineBottom: { position: 'absolute', left: 62, right: 54, bottom: 32, height: 5, borderRadius: 999, backgroundColor: 'rgba(36,87,245,0.72)' },
  routeLineLeft: { position: 'absolute', left: 62, top: 52, bottom: 32, width: 5, borderRadius: 999, backgroundColor: 'rgba(36,87,245,0.72)' },
  routeDotStart: { position: 'absolute', left: 20, top: 14, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.green, borderWidth: 3, borderColor: '#FFFFFF' },
  routeDotEnd: { position: 'absolute', right: 46, bottom: 24, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, borderWidth: 3, borderColor: '#FFFFFF' },
  courseBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  courseBadgeText: { fontSize: 12, fontWeight: '600', color: colors.text },
  reportButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseGlass: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  courseShape: { fontSize: 11, fontWeight: '500', color: colors.subtext },
  courseName: { marginTop: 6, fontSize: 18, fontWeight: '600', color: colors.text },
  courseMeta: { paddingHorizontal: 6, paddingTop: 12, gap: 4 },
  courseSubMeta: { fontSize: 13, color: '#6B7280' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: '#6B7280' },
  metaDot: { marginHorizontal: 6, color: '#9CA3AF' },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    backgroundColor: colors.card,
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
});
