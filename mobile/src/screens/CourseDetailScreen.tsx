import { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SectionCard from '../components/SectionCard';
import EmptyState from '../components/EmptyState';
import { getCourseById } from '../data/mockData';
import { colors } from '../theme';
import { difficultyLabel, formatDistance } from '../lib/format';
import type { CourseStackScreenProps } from '../navigation/types';

type Props = CourseStackScreenProps<'CourseDetail'>;

function getPreviewRegion(coordinates: { latitude: number; longitude: number }[]) {
  if (!coordinates.length) {
    return { latitude: 37.5273, longitude: 126.9327, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  }
  const latitudes = coordinates.map((c) => c.latitude);
  const longitudes = coordinates.map((c) => c.longitude);
  return {
    latitude: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
    longitude: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    latitudeDelta: Math.max((Math.max(...latitudes) - Math.min(...latitudes)) * 2.4, 0.01),
    longitudeDelta: Math.max((Math.max(...longitudes) - Math.min(...longitudes)) * 2.4, 0.01),
  };
}

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const course = getCourseById(courseId);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(course?.likes ?? 0);

  if (!course) {
    return <EmptyState icon="map-outline" title="코스를 찾을 수 없어요" />;
  }

  const previewRegion = getPreviewRegion(course.routeCoordinates);

  const handleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Shape Run에서 "${course.name}" 코스를 달려봐요! 거리: ${formatDistance(course.distance)}km` });
    } catch {
      // share cancelled
    }
  };

  const handleStartRun = () => {
    navigation.getParent()?.navigate('Run', {
      screen: 'RunTracker',
      params: { courseId: course.id },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>{course.name}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SectionCard>
        <View style={styles.heroIntro}>
          <View style={styles.heroLocationBadge}>
            <Text style={styles.heroLocationText}>{course.region}, {course.district}</Text>
          </View>
          <Text style={styles.heroTitle}>{course.name}</Text>
          <TouchableOpacity style={styles.likeRow} onPress={handleLike} activeOpacity={0.8}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.danger : colors.subtext} />
            <Text style={[styles.likeCount, liked && { color: colors.danger }]}>{likeCount.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewMapWrap}>
            <MapView style={StyleSheet.absoluteFillObject} initialRegion={previewRegion} scrollEnabled={false} zoomEnabled={false} rotateEnabled={false} pitchEnabled={false}>
              <Polyline coordinates={course.routeCoordinates} strokeColor={colors.accent} strokeWidth={5} lineCap="round" lineJoin="round" />
              <Marker coordinate={course.routeCoordinates[0]} title={`${course.name} 시작`} />
            </MapView>
            <View style={styles.previewOverlay}>
              <View style={styles.previewBadge}>
                <Ionicons name="navigate-outline" size={14} color={colors.accentDeep} />
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
        <Text numberOfLines={4} style={styles.courseIntro}>{course.description}</Text>
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

      {course.cautions.length > 0 && (
        <SectionCard>
          <Text style={styles.sectionTitle}>코스 주의사항</Text>
          <View style={styles.cautionList}>
            {course.cautions.map((caution) => (
              <View key={caution} style={styles.cautionItem}>
                <Ionicons name="warning-outline" size={15} color="#C2540A" style={{ marginTop: 2 }} />
                <Text style={styles.cautionText}>{caution}</Text>
              </View>
            ))}
          </View>
        </SectionCard>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleStartRun}>
        <Text style={styles.primaryButtonText}>달리기 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePill: { flex: 1, borderRadius: 18, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePillText: { fontSize: 15, fontWeight: '600', color: colors.text },
  heroIntro: { paddingHorizontal: 2, paddingTop: 2, gap: 12 },
  heroLocationBadge: { alignSelf: 'flex-start', borderRadius: 12, backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 7 },
  heroLocationText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  heroTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, color: colors.text },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  likeCount: { fontSize: 14, fontWeight: '700', color: colors.subtext },
  previewCard: { marginTop: 16, borderRadius: 18, backgroundColor: colors.mutedCard, padding: 8 },
  previewMapWrap: { height: 186, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.mutedCard },
  previewOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-start', padding: 12 },
  previewBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 12, paddingVertical: 8 },
  previewBadgeText: { fontSize: 12, fontWeight: '600', color: colors.accentDeep },
  quickBand: { marginTop: 14, flexDirection: 'row', alignItems: 'center', borderRadius: 16, backgroundColor: colors.mutedCard, paddingHorizontal: 14, paddingVertical: 14 },
  quickMetric: { flex: 1 },
  quickLabel: { fontSize: 11, color: colors.subtext, fontWeight: '600' },
  quickValue: { marginTop: 6, fontSize: 17, color: colors.text, fontWeight: '800' },
  quickDivider: { width: 1, alignSelf: 'stretch', backgroundColor: colors.line, marginHorizontal: 10 },
  courseIntro: { fontSize: 14, lineHeight: 22, color: colors.subtext },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  scoreList: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  scoreItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  scoreDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
  scoreValue: { fontSize: 20, fontWeight: '900', color: colors.text },
  cautionList: { gap: 10, marginTop: 12 },
  cautionItem: { flexDirection: 'row', gap: 10, borderRadius: 14, backgroundColor: colors.softWarn, padding: 14 },
  cautionText: { flex: 1, fontSize: 14, lineHeight: 22, color: '#9A3412' },
  primaryButton: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 17, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: colors.card },
});
