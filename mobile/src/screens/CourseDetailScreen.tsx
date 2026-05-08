import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SectionCard from '../components/SectionCard';
import { Course } from '../types';
import { colors } from '../theme';
import { difficultyLabel, formatDistance } from '../lib/format';

interface CourseDetailScreenProps {
  course: Course;
  onBack: () => void;
  onStartRun: () => void;
}

function getPreviewRegion(course: Course) {
  const coordinates = course.routeCoordinates;

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
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 2.4, 0.01),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 2.4, 0.01),
  };
}

export default function CourseDetailScreen({ course, onBack, onStartRun }: CourseDetailScreenProps) {
  const previewRegion = getPreviewRegion(course);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>{course.name}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="flag-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SectionCard>
        <View style={styles.heroIntro}>
          <View style={styles.heroLocationBadge}>
            <Text style={styles.heroLocationText}>{course.region}, {course.district}</Text>
          </View>
          <Text style={styles.heroTitle}>{course.name}</Text>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewMapWrap}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={previewRegion}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Polyline
                coordinates={course.routeCoordinates}
                strokeColor="#2457F5"
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />
              <Marker coordinate={course.routeCoordinates[0]} title={`${course.name} 시작`} />
            </MapView>
            <View style={styles.previewOverlay}>
              <View style={styles.previewBadge}>
                <Ionicons name="navigate-outline" size={14} color={colors.green} />
                <Text style={styles.previewBadgeText}>{course.nearbyDistanceKm.toFixed(1)}km</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickBand}>
          <View style={styles.quickMetric}>
            <Text style={styles.quickLabel}>거리</Text>
            <Text style={styles.quickValue}>{formatDistance(course.distance)}km</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickMetric}>
            <Text style={styles.quickLabel}>난이도</Text>
            <Text style={styles.quickValue}>{difficultyLabel(course.difficulty)}</Text>
          </View>
          <View style={styles.quickDivider} />
          <View style={styles.quickMetric}>
            <Text style={styles.quickLabel}>후기 점수</Text>
            <Text style={styles.quickValue}>{course.reviewScore.toFixed(1)}</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <Text numberOfLines={3} style={styles.courseIntro}>{course.description}</Text>
      </SectionCard>

      <SectionCard>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>코스 평가</Text>
        </View>
        <View style={styles.scoreList}>
          <View style={styles.scoreItem}>
            <Text style={styles.infoLabel}>공식 평가</Text>
            <Text style={styles.scoreValue}>{course.officialScore.toFixed(1)}</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.infoLabel}>유저 후기</Text>
            <Text style={styles.scoreValue}>{course.reviewScore.toFixed(1)}</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>코스 주의사항</Text>
        <View style={styles.cautionList}>
          {course.cautions.map((caution) => (
            <View key={caution} style={styles.cautionItem}>
              <Text style={styles.cautionText}>{caution}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <TouchableOpacity style={styles.primaryButton} onPress={onStartRun}>
        <Text style={styles.primaryButtonText}>달리기 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: { flex: 1, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12 },
  titlePillText: { fontSize: 16, fontWeight: '600', color: colors.text },
  heroIntro: { paddingHorizontal: 2, paddingTop: 2 },
  heroLocationBadge: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: colors.mutedCard, paddingHorizontal: 12, paddingVertical: 8 },
  heroLocationText: { fontSize: 12, fontWeight: '600', color: colors.text },
  heroTitle: { marginTop: 14, fontSize: 26, fontWeight: '600', color: colors.text },
  previewCard: { marginTop: 16, borderRadius: 18, backgroundColor: colors.mutedCard, padding: 10 },
  previewMapWrap: { height: 186, borderRadius: 16, overflow: 'hidden', backgroundColor: '#DCE7D6' },
  previewOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-start', padding: 12, backgroundColor: 'rgba(255,255,255,0.04)' },
  previewBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewBadgeText: { fontSize: 12, fontWeight: '600', color: colors.green },
  quickBand: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  quickMetric: { flex: 1 },
  quickLabel: { fontSize: 11, color: colors.subtext, fontWeight: '600' },
  quickValue: { marginTop: 6, fontSize: 18, color: colors.text, fontWeight: '600' },
  quickDivider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.line, marginHorizontal: 10 },
  courseIntro: { fontSize: 14, lineHeight: 22, color: '#6B7280' },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  scoreList: { borderTopWidth: 1, borderTopColor: colors.line },
  scoreItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  scoreDivider: { height: 1, backgroundColor: colors.line },
  scoreValue: { fontSize: 21, fontWeight: '600', color: colors.text },
  cautionList: { gap: 10, marginTop: 12 },
  cautionItem: { borderRadius: 16, backgroundColor: colors.softOrange, padding: 14 },
  cautionText: { fontSize: 14, lineHeight: 22, color: '#9A3412' },
  primaryButton: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
