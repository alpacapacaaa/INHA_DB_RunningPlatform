import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SectionCard from '../components/SectionCard';
import EmptyState from '../components/EmptyState';
import { mockCrewMeetings, getCourseById } from '../data/mockData';
import { colors } from '../theme';
import { formatPace } from '../lib/format';
import { useToast } from '../components/Toast';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Recruit'>;

export default function RecruitScreen({ navigation }: Props) {
  const { showToast } = useToast();
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const handleJoin = (meetingId: string, isPrivate: boolean) => {
    if (isPrivate) {
      Alert.prompt(
        '비밀번호 입력',
        '방장에게 비밀번호를 받아 입력하세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '입장',
            onPress: () => {
              setJoined((prev) => new Set([...prev, meetingId]));
              showToast('번개런 방에 참가했어요!');
            },
          },
        ],
        'plain-text',
      );
    } else {
      setJoined((prev) => new Set([...prev, meetingId]));
      showToast('번개런 방에 참가했어요!');
    }
  };

  const handleLeave = (meetingId: string) => {
    setJoined((prev) => { const next = new Set(prev); next.delete(meetingId); return next; });
    showToast('방에서 나왔어요.', 'info');
  };

  const navigateToCourse = (courseId: string) => {
    navigation.navigate('Course', { screen: 'CourseDetail', params: { courseId } } as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>모집</Text>
      </View>

      <SectionCard>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>비밀번호 번개런 방</Text>
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>운영중</Text>
          </View>
        </View>

        {mockCrewMeetings.length === 0 ? (
          <EmptyState icon="people-outline" title="운영중인 방이 없어요" />
        ) : (
          <View style={styles.meetingList}>
            {mockCrewMeetings.map((meeting) => {
              const course = getCourseById(meeting.courseId);
              const isJoined = joined.has(meeting.id);
              const isFull = meeting.currentParticipants >= meeting.maxParticipants && !isJoined;
              return (
                <View key={meeting.id} style={styles.meetingCard}>
                  <TouchableOpacity onPress={() => course && navigateToCourse(meeting.courseId)} activeOpacity={0.85}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.meetingTitle}>{meeting.title}</Text>
                        <Text style={styles.meetingMeta}>
                          {course?.name} · {meeting.weekday} · 목표 페이스 {formatPace(meeting.pace)}
                        </Text>
                      </View>
                      <View style={[styles.countPill, isFull && styles.countPillFull]}>
                        <Text style={[styles.countPillText, isFull && styles.countPillTextFull]}>
                          {meeting.currentParticipants + (isJoined ? 1 : 0)}/{meeting.maxParticipants}명
                        </Text>
                      </View>
                    </View>

                    <View style={styles.featureRow}>
                      <View style={styles.featureCard}>
                        <Ionicons name="lock-closed-outline" size={15} color={colors.accent} />
                        <Text style={styles.featureText}>{meeting.passwordHint}</Text>
                      </View>
                      <View style={styles.featureCard}>
                        <Ionicons name="bar-chart-outline" size={15} color={colors.accent} />
                        <Text style={styles.featureText}>요일, 페이스, 코스 투표</Text>
                      </View>
                      <View style={styles.featureCard}>
                        <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.subtext} />
                        <Text style={styles.featureText}>채팅, 강퇴, 신고</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.joinButton, isJoined && styles.leaveButton, isFull && styles.fullButton]}
                    onPress={() => isJoined ? handleLeave(meeting.id) : handleJoin(meeting.id, meeting.isPrivate)}
                    disabled={isFull}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.joinButtonText, isJoined && styles.leaveButtonText]}>
                      {isJoined ? '참가 취소' : isFull ? '정원 마감' : '참가하기'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>클랜형 운영</Text>
        <View style={styles.clanRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.accent} />
          <Text style={styles.clanText}>운영진 승인</Text>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.accent} />
          <Text style={styles.clanText}>신고 관리</Text>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  header: {},
  eyebrow: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  title: { marginTop: 4, fontSize: 28, fontWeight: '700', color: colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  livePill: { borderRadius: 999, backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 7 },
  livePillText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  meetingList: { marginTop: 14, gap: 12 },
  meetingCard: { borderRadius: 18, backgroundColor: colors.mutedCard, padding: 14, gap: 12 },
  meetingTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  meetingMeta: { marginTop: 5, fontSize: 13, color: colors.subtext },
  countPill: { borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 7 },
  countPillFull: { backgroundColor: '#FFE4E1' },
  countPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  countPillTextFull: { color: colors.danger },
  featureRow: { gap: 8 },
  featureCard: { flexDirection: 'row', gap: 8, borderRadius: 14, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 10 },
  featureText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.text },
  joinButton: { borderRadius: 14, backgroundColor: colors.primary, paddingVertical: 13, alignItems: 'center' },
  leaveButton: { backgroundColor: colors.mutedCard, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  fullButton: { backgroundColor: colors.mutedCard },
  joinButtonText: { fontSize: 14, fontWeight: '700', color: colors.card },
  leaveButtonText: { color: colors.subtext },
  clanRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  clanText: { fontSize: 14, fontWeight: '500', color: colors.subtext },
});
