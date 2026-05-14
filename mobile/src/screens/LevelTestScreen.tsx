import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useToast } from '../components/Toast';
import type { MyPageStackScreenProps } from '../navigation/types';

type Props = MyPageStackScreenProps<'LevelTest'>;

interface Question {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  { id: 1, text: '주간 러닝 빈도는?', options: [{ label: '거의 안 달림', value: 0 }, { label: '주 1~2회', value: 1 }, { label: '주 3~4회', value: 2 }, { label: '주 5회 이상', value: 3 }] },
  { id: 2, text: '평균 러닝 거리는?', options: [{ label: '3km 미만', value: 0 }, { label: '3~5km', value: 1 }, { label: '5~10km', value: 2 }, { label: '10km 이상', value: 3 }] },
  { id: 3, text: '평균 페이스는?', options: [{ label: '7분 이상', value: 0 }, { label: '6~7분', value: 1 }, { label: '5~6분', value: 2 }, { label: '5분 미만', value: 3 }] },
  { id: 4, text: '마라톤 완주 경험은?', options: [{ label: '없음', value: 0 }, { label: '5km 완주', value: 1 }, { label: '10km 완주', value: 2 }, { label: '하프/풀 완주', value: 3 }] },
];

function calcLevel(score: number): { label: string; description: string; color: string } {
  if (score <= 3) return { label: '입문 러너', description: '이제 막 달리기를 시작했어요. 꾸준함이 가장 중요해요!', color: '#34C759' };
  if (score <= 6) return { label: '중급 러너', description: '기본기가 갖춰진 러너예요. 더 긴 거리에 도전해보세요!', color: '#007AFF' };
  if (score <= 9) return { label: '고급 러너', description: '높은 수준의 러너예요. 레이스 참가를 고려해보세요!', color: '#FF9500' };
  return { label: '엘리트 러너', description: '최상위 수준의 러너예요. 대회 입상도 가능한 실력이에요!', color: '#FF3B30' };
}

export default function LevelTestScreen({ navigation }: Props) {
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ReturnType<typeof calcLevel> | null>(null);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
    setResult(calcLevel(totalScore));
  };

  const handleReset = () => { setAnswers({}); setResult(null); };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  if (result) {
    return (
      <View style={styles.container}>
        <View style={styles.resultInner}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>

          <View style={[styles.resultBadge, { backgroundColor: result.color }]}>
            <Ionicons name="trophy" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.resultLabel}>{result.label}</Text>
          <Text style={styles.resultDesc}>{result.description}</Text>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => { showToast('레벨이 저장됐어요!'); navigation.goBack(); }}>
              <Text style={styles.primaryBtnText}>저장하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
              <Text style={styles.secondaryBtnText}>다시 테스트</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>러너 레벨 테스트</Text>
        </View>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.intro}>
        <Text style={styles.introTitle}>나의 러닝 레벨을 확인해요</Text>
        <Text style={styles.introDesc}>4가지 질문으로 현재 러닝 수준을 측정해드려요.</Text>
      </View>

      {QUESTIONS.map((q) => (
        <View key={q.id} style={styles.questionCard}>
          <Text style={styles.questionNum}>Q{q.id}</Text>
          <Text style={styles.questionText}>{q.text}</Text>
          <View style={styles.optionList}>
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, selected && styles.optionBtnActive]}
                  onPress={() => handleSelect(q.id, opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>{opt.label}</Text>
                  {selected && <Ionicons name="checkmark" size={16} color={colors.card} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={!allAnswered} activeOpacity={0.88}>
        <Text style={styles.submitBtnText}>결과 확인하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32, gap: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePill: { flex: 1, borderRadius: 18, backgroundColor: colors.card, paddingHorizontal: 18, paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  titlePillText: { fontSize: 15, fontWeight: '600', color: colors.text, textAlign: 'center' },
  intro: { gap: 8 },
  introTitle: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  introDesc: { fontSize: 14, color: colors.subtext, lineHeight: 21 },
  questionCard: { backgroundColor: colors.card, borderRadius: 20, padding: 18, gap: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  questionNum: { fontSize: 12, fontWeight: '800', color: colors.accent },
  questionText: { fontSize: 16, fontWeight: '700', color: colors.text },
  optionList: { gap: 8 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, backgroundColor: colors.mutedCard, paddingHorizontal: 16, paddingVertical: 13 },
  optionBtnActive: { backgroundColor: colors.primary },
  optionText: { fontSize: 14, fontWeight: '600', color: colors.text },
  optionTextActive: { color: colors.card },
  submitBtn: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 17, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: colors.subtext },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: colors.card },
  resultInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  closeBtn: { position: 'absolute', top: 60, right: 24, width: 42, height: 42, borderRadius: 18, backgroundColor: colors.mutedCard, alignItems: 'center', justifyContent: 'center' },
  resultBadge: { width: 96, height: 96, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  resultLabel: { fontSize: 28, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  resultDesc: { fontSize: 15, color: colors.subtext, textAlign: 'center', lineHeight: 22 },
  resultActions: { width: '100%', gap: 12, marginTop: 12 },
  primaryBtn: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 17, alignItems: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: '800', color: colors.card },
  secondaryBtn: { borderRadius: 22, backgroundColor: colors.mutedCard, paddingVertical: 17, alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  secondaryBtnText: { fontSize: 16, fontWeight: '700', color: colors.text },
});
