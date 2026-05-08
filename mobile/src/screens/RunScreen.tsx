import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Course, RunRecord } from '../types';
import { colors } from '../theme';
import { formatDistance, formatPace } from '../lib/format';

interface RunScreenProps {
  course?: Course;
  onComplete: (record: RunRecord) => void;
}

export default function RunScreen({ course, onComplete }: RunScreenProps) {
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

    return () => {
      if (interval) clearInterval(interval);
    };
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
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2500,
            distanceInterval: 5,
          },
          (position) => {
            if (!isMounted) return;

            const nextCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setCurrentCoordinate(nextCoordinate);
            setPermissionLabel('실시간 위치 추적 중');
            setLocationName(course ? `${course.region} · ${course.district}` : '자유 달리기 경로 추적 중');
            mapRef.current?.animateToRegion(
              {
                ...nextCoordinate,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              },
              600,
            );
          },
        );
      } catch {
        setPermissionLabel('실시간 추적을 시작하지 못했어요');
      }
    };

    startWatching();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [course, hasForegroundPermission, isPaused, isRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainSeconds}`;
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionLabel('위치 권한 필요');
      setHasForegroundPermission(false);
      return;
    }

    setPermissionLabel('위치 권한 허용됨');
    setHasForegroundPermission(true);

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextCoordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCurrentCoordinate(nextCoordinate);
      setLocationName(course ? `${course.region} · ${course.district}` : '현재 위치 확인됨');
      mapRef.current?.animateToRegion(
        {
          ...nextCoordinate,
          latitudeDelta: 0.014,
          longitudeDelta: 0.014,
        },
        600,
      );
    } catch {
      setPermissionLabel('현재 위치를 불러오지 못했어요');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: currentCoordinate.latitude,
          longitude: currentCoordinate.longitude,
          latitudeDelta: 0.018,
          longitudeDelta: 0.018,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {course?.routeCoordinates?.length ? (
          <Polyline coordinates={course.routeCoordinates} strokeColor="#2457F5" strokeWidth={5} lineCap="round" lineJoin="round" />
        ) : null}

        {course?.routeCoordinates?.length ? (
          <Marker coordinate={course.routeCoordinates[0]} title={course.name} description="코스 시작 지점" />
        ) : null}

        <Marker coordinate={currentCoordinate} pinColor="#1FA968" title="현재 위치" />
      </MapView>
      <View style={styles.mapScrim} />

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton}>
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
        <Text style={styles.sheetEyebrow}>실시간 러닝</Text>
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
          <Text style={styles.statusStripText}>{permissionLabel}</Text>
          <Text style={styles.statusStripText}>{course ? `${course.shapeType} 코스` : '자유 달리기'}</Text>
        </View>

        {!isRunning ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setIsRunning(true);
              setIsPaused(false);
            }}
          >
            <Text style={styles.primaryButtonText}>러닝 시작</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.secondaryButton, isPaused && styles.blueButton]} onPress={() => setIsPaused((prev) => !prev)}>
              <Text style={[styles.secondaryButtonText, isPaused && styles.blueButtonText]}>{isPaused ? '다시 시작' : '일시 정지'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() =>
                onComplete({
                  id: `record-${Date.now()}`,
                  courseId: course?.id,
                  courseName: course?.name ?? '자유 달리기',
                  date: '2026-05-05',
                  startTime: '21:00',
                  distance: Number(distance.toFixed(2)),
                  duration: elapsedTime,
                  averagePace: currentPace > 0 ? Number(currentPace.toFixed(2)) : 5.48,
                  fastestPace: currentPace > 0 ? Number((currentPace * 0.92).toFixed(2)) : 4.98,
                  segmentPaces: [5.32, 5.55, 5.64, 5.41],
                  calories: Math.round(distance * 67),
                  district: course?.district ?? '출발지 자동 기록',
                  reviewSummary: '코스 등록 대기',
                })
              }
            >
              <Text style={styles.dangerButtonText}>기록 완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DCE7D6' },
  mapScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  topRow: {
    position: 'absolute',
    top: 18,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePill: { flexShrink: 1, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, maxWidth: 214 },
  titlePillText: { fontSize: 16, fontWeight: '600', color: colors.text, textAlign: 'center' },
  stack: { gap: 10 },
  gpsBadge: {
    position: 'absolute',
    top: 86,
    left: 20,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green },
  gpsBadgeText: { fontSize: 12, fontWeight: '600', color: colors.green },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(246,246,241,0.98)',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D2D5DC',
    marginBottom: 12,
  },
  sheetEyebrow: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  sheetPrimary: { marginTop: 6, fontSize: 46, fontWeight: '700', color: colors.text },
  locationText: { marginTop: 4, fontSize: 13, fontWeight: '500', color: colors.subtext },
  primaryRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  bigMetric: { flex: 1, borderRadius: 18, backgroundColor: colors.card, padding: 14 },
  bigMetricLabel: { fontSize: 12, fontWeight: '500', color: colors.subtext },
  bigMetricValue: { marginTop: 8, fontSize: 23, fontWeight: '600', color: colors.text },
  statusStrip: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusStripText: { fontSize: 13, color: '#606774', fontWeight: '500' },
  primaryButton: { marginTop: 14, borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  secondaryButton: { flex: 1, borderRadius: 22, backgroundColor: colors.card, paddingVertical: 16, alignItems: 'center' },
  blueButton: { backgroundColor: colors.accent },
  secondaryButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  blueButtonText: { color: '#FFFFFF' },
  dangerButton: { flex: 1, borderRadius: 22, backgroundColor: colors.danger, paddingVertical: 16, alignItems: 'center' },
  dangerButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
