import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getCourseById } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance, formatPace } from '../lib/format';
import type { RunStackScreenProps } from '../navigation/types';

type Props = RunStackScreenProps<'RunTracker'>;

export default function RunScreen({ route, navigation }: Props) {
  const courseId = route.params?.courseId;
  const course = courseId ? getCourseById(courseId) : undefined;

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentPace, setCurrentPace] = useState(0);
  const [permissionLabel, setPermissionLabel] = useState('위치 권한 준비');
  const [hasForegroundPermission, setHasForegroundPermission] = useState(false);
  const [locationName, setLocationName] = useState('위치 확인 전');
  const defaultCoordinate = course?.routeCoordinates[0] ?? { latitude: 37.5273, longitude: 126.9327 };
  const [currentCoordinate, setCurrentCoordinate] = useState(defaultCoordinate);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setDistance((prev) => prev + 0.0021);
        setCurrentPace((prev) => {
          const nextDistance = distance + 0.0021;
          if (nextDistance <= 0) return prev;
          return ((elapsedTime + 1) / 60) / nextDistance;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [distance, elapsedTime, isPaused, isRunning]);

  useEffect(() => {
    setCurrentCoordinate(course?.routeCoordinates[0] ?? { latitude: 37.5273, longitude: 126.9327 });
    setLocationName(course ? `${course.region} · ${course.district}` : '위치 확인 전');
  }, [course]);

  useEffect(() => {
    if (!hasForegroundPermission || !isRunning || isPaused) return;
    let subscription: Location.LocationSubscription | undefined;
    let isMounted = true;
    const startWatching = async () => {
      try {
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 2500, distanceInterval: 5 },
          (position) => {
            if (!isMounted) return;
            const nextCoordinate = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            setCurrentCoordinate(nextCoordinate);
            setPermissionLabel('실시간 위치 추적 중');
            setLocationName(course ? `${course.region} · ${course.district}` : '자유 달리기 경로 추적 중');
            mapRef.current?.animateToRegion({ ...nextCoordinate, latitudeDelta: 0.014, longitudeDelta: 0.014 }, 600);
          },
        );
      } catch { setPermissionLabel('실시간 추적을 시작하지 못했어요'); }
    };
    startWatching();
    return () => { isMounted = false; subscription?.remove(); };
  }, [course, hasForegroundPermission, isPaused, isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setPermissionLabel('위치 권한 필요'); setHasForegroundPermission(false); return; }
    setPermissionLabel('위치 권한 허용됨');
    setHasForegroundPermission(true);
    try {
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nextCoordinate = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setCurrentCoordinate(nextCoordinate);
      setLocationName(course ? `${course.region} · ${course.district}` : '현재 위치 확인됨');
      mapRef.current?.animateToRegion({ ...nextCoordinate, latitudeDelta: 0.014, longitudeDelta: 0.014 }, 600);
    } catch { setPermissionLabel('현재 위치를 불러오지 못했어요'); }
  };

  const handleComplete = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    navigation.replace('RunComplete', {
      record: {
        id: `record-${Date.now()}`,
        courseId: course?.id,
        courseName: course?.name ?? '자유 달리기',
        date: dateStr,
        startTime: timeStr,
        distance: Number(distance.toFixed(2)),
        duration: elapsedTime,
        averagePace: currentPace > 0 ? Number(currentPace.toFixed(2)) : 5.48,
        fastestPace: currentPace > 0 ? Number((currentPace * 0.92).toFixed(2)) : 4.98,
        segmentPaces: [5.32, 5.55, 5.64, 5.41],
        calories: Math.round(distance * 67),
        district: course?.district ?? '출발지 자동 기록',
        reviewSummary: '코스 등록 대기',
      },
      courseId: course?.id,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{ latitude: currentCoordinate.latitude, longitude: currentCoordinate.longitude, latitudeDelta: 0.018, longitudeDelta: 0.018 }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {course?.routeCoordinates?.length ? (
          <Polyline coordinates={course.routeCoordinates} strokeColor={colors.accent} strokeWidth={5} lineCap="round" lineJoin="round" />
        ) : null}
        {course?.routeCoordinates?.length ? <Marker coordinate={course.routeCoordinates[0]} title={course.name} description="코스 시작 지점" /> : null}
        <Marker coordinate={currentCoordinate} pinColor={colors.accent} title="현재 위치" />
      </MapView>
      <View style={styles.mapScrim} />

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text numberOfLines={1} style={styles.titlePillText}>{course?.name ?? '자유 달리기'}</Text>
        </View>
        <View style={styles.stack}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="layers-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={requestPermission}>
            <Ionicons name="locate-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.gpsBadge}>
        <View style={styles.dot} />
        <Text style={styles.gpsBadgeText}>{isRunning && !isPaused ? '러닝 추적 중' : '러닝 준비'}</Text>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetTopLine}>
          <Text style={styles.sheetEyebrow}>실시간 기록</Text>
          <Text style={styles.sheetStatus}>{permissionLabel}</Text>
        </View>
        <Text style={styles.sheetPrimary}>{formatDistance(distance)}km</Text>
        <Text style={styles.locationText}>{locationName}</Text>

        <View style={styles.primaryRow}>
          <View style={styles.bigMetric}>
            <Text style={styles.bigMetricLabel}>경과 시간</Text>
            <Text style={styles.bigMetricValue}>{formatTime(elapsedTime)}</Text>
          </View>
          <View style={styles.bigMetric}>
            <Text style={styles.bigMetricLabel}>현재 페이스</Text>
            <Text style={styles.bigMetricValue}>{formatPace(currentPace)}</Text>
          </View>
        </View>

        <View style={styles.statusStrip}>
          <Text style={styles.statusStripText}>{isPaused ? '일시 정지됨' : isRunning ? '기록 중' : '시작 대기'}</Text>
          <Text style={styles.statusStripText}>{course ? `${course.shapeType} 코스` : '자유 달리기'}</Text>
        </View>

        {!isRunning ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => { setIsRunning(true); setIsPaused(false); }}>
            <Text style={styles.primaryButtonText}>러닝 시작</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.secondaryButton, isPaused && styles.resumeButton]} onPress={() => setIsPaused((prev) => !prev)}>
              <Text style={[styles.secondaryButtonText, isPaused && styles.resumeButtonText]}>{isPaused ? '다시 시작' : '일시 정지'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>기록 완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mutedCard },
  mapScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.06)' },
  topRow: { position: 'absolute', top: 18, left: 20, right: 20, zIndex: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconButton: { width: 42, height: 42, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  titlePill: { flexShrink: 1, borderRadius: 18, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, maxWidth: 214 },
  titlePillText: { fontSize: 15, fontWeight: '800', color: colors.card, textAlign: 'center' },
  stack: { gap: 10 },
  gpsBadge: { position: 'absolute', top: 86, left: 20, zIndex: 5, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  gpsBadgeText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: colors.primary, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  sheetHandle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 12 },
  sheetTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '800', letterSpacing: 1.2 },
  sheetStatus: { fontSize: 12, color: colors.accent, fontWeight: '700' },
  sheetPrimary: { marginTop: 4, fontSize: 56, fontWeight: '900', letterSpacing: -2.2, color: colors.card },
  locationText: { marginTop: 2, fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.55)' },
  primaryRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  bigMetric: { flex: 1, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', padding: 14 },
  bigMetricLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  bigMetricValue: { marginTop: 8, fontSize: 22, fontWeight: '900', color: colors.card },
  statusStrip: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 12 },
  statusStripText: { fontSize: 13, color: 'rgba(255,255,255,0.64)', fontWeight: '600' },
  primaryButton: { marginTop: 14, borderRadius: 22, backgroundColor: colors.accent, paddingVertical: 17, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  secondaryButton: { flex: 1, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 16, alignItems: 'center' },
  resumeButton: { backgroundColor: colors.accent },
  secondaryButtonText: { fontSize: 16, fontWeight: '800', color: colors.card },
  resumeButtonText: { color: colors.primary },
  completeButton: { flex: 1, borderRadius: 22, backgroundColor: colors.card, paddingVertical: 16, alignItems: 'center' },
  completeButtonText: { fontSize: 16, fontWeight: '800', color: colors.primary },
});
