import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SectionCard from '../components/SectionCard';
import { mockCrewMeetings, getCourseById } from '../data/mockData';
import { colors } from '../theme';
import { formatPace } from '../lib/format';

interface RecruitScreenProps {
  onOpenCourse: (courseId: string) => void;
}

export default function RecruitScreen({ onOpenCourse }: RecruitScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Shape Run</Text>
        <Text style={styles.title}>모집</Text>
      </View>

      <SectionCard>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.sectionTitle}>비밀번호 번개런 방</Text>
          </View>
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>운영중</Text>
          </View>
        </View>

        <View style={styles.meetingList}>
          {mockCrewMeetings.map((meeting) => {
            const course = getCourseById(meeting.courseId);
            return (
              <TouchableOpacity key={meeting.id} style={styles.meetingCard} activeOpacity={0.95} onPress={() => onOpenCourse(meeting.courseId)}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.meetingTitle}>{meeting.title}</Text>
                    <Text style={styles.meetingMeta}>{course?.name} · {meeting.weekday} · 목표 페이스 {formatPace(meeting.pace)}</Text>
                  </View>
                  <View style={styles.countPill}>
                    <Text style={styles.countPillText}>{meeting.currentParticipants}/{meeting.maxParticipants}명</Text>
                  </View>
                </View>

                <View style={styles.featureRow}>
                  <View style={styles.featureCard}>
                    <Ionicons name="lock-closed-outline" size={16} color={colors.accent} />
                    <Text style={styles.featureText}>{meeting.passwordHint}</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Ionicons name="bar-chart-outline" size={16} color={colors.green} />
                    <Text style={styles.featureText}>요일, 페이스, 코스 투표</Text>
                  </View>
                  <View style={styles.featureCard}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.orange} />
                    <Text style={styles.featureText}>채팅, 강퇴, 신고</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>클랜형 운영</Text>
        <View style={styles.clanRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.green} />
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
  title: { marginTop: 4, fontSize: 28, fontWeight: '600', color: colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  sectionCaption: { marginTop: 4, fontSize: 13, color: colors.subtext },
  livePill: { borderRadius: 999, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8 },
  livePillText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  meetingList: { marginTop: 14, gap: 12 },
  meetingCard: { borderRadius: 18, backgroundColor: colors.mutedCard, padding: 14, gap: 12 },
  meetingTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  meetingMeta: { marginTop: 6, fontSize: 13, color: '#6B7280' },
  countPill: { borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 8 },
  countPillText: { fontSize: 12, fontWeight: '600', color: colors.text },
  featureRow: { gap: 10 },
  featureCard: { flexDirection: 'row', gap: 8, borderRadius: 16, backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 12 },
  featureText: { flex: 1, fontSize: 13, lineHeight: 20, color: colors.text },
  clanRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  clanText: { fontSize: 14, fontWeight: '500', color: '#58606B' },
});
