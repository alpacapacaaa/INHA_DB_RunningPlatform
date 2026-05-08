import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RunRecord } from '../types';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';
import SectionCard from '../components/SectionCard';

interface CreateCourseScreenProps {
  record: RunRecord;
  onClose: () => void;
}

export default function CreateCourseScreen({ record, onClose }: CreateCourseScreenProps) {
  const [name, setName] = useState('');
  const [shapeType, setShapeType] = useState('');
  const [intro, setIntro] = useState('');
  const [caution, setCaution] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onClose}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>Shape Run</Text>
          <Text numberOfLines={1} style={styles.title}>코스 등록하기</Text>
        </View>
        <View style={styles.topSpacer} />
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>GPS 기록</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>출발 지역</Text>
            <Text style={styles.infoValue}>서울 · {record.district ?? '출발지'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>기록된 거리</Text>
            <Text style={styles.infoValue}>{formatDistance(record.distance)}km</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>코스 정보</Text>
        <TextInput value={name} onChangeText={setName} placeholder="코스 이름" style={styles.input} placeholderTextColor="#9CA3AF" />
        <TextInput value={shapeType} onChangeText={setShapeType} placeholder="모양 유형" style={styles.input} placeholderTextColor="#9CA3AF" />
        <TextInput
          value={intro}
          onChangeText={setIntro}
          placeholder="한줄 소개"
          style={[styles.input, styles.textarea]}
          placeholderTextColor="#9CA3AF"
          multiline
        />
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>주의할 점</Text>
        <TextInput
          value={caution}
          onChangeText={setCaution}
          placeholder="신호, 보행자, 야간 주의 구간"
          style={[styles.input, styles.warningArea]}
          placeholderTextColor="#C27B4E"
          multiline
        />
      </SectionCard>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>코스 등록 저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24, gap: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  titleBlock: { flex: 1, minWidth: 0 },
  topSpacer: { width: 42 },
  iconButton: { width: 42, height: 42, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  title: { marginTop: 4, fontSize: 28, fontWeight: '600', color: colors.text },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 },
  infoGrid: { flexDirection: 'row', gap: 12 },
  infoItem: { flex: 1, borderRadius: 18, backgroundColor: colors.mutedCard, padding: 14 },
  infoLabel: { fontSize: 12, color: colors.subtext, fontWeight: '500' },
  infoValue: { marginTop: 8, fontSize: 17, fontWeight: '600', color: colors.text },
  input: {
    borderRadius: 18,
    backgroundColor: '#F8F8F5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  textarea: { minHeight: 96, textAlignVertical: 'top' },
  warningArea: { minHeight: 110, textAlignVertical: 'top', backgroundColor: colors.softOrange },
  primaryButton: { borderRadius: 22, backgroundColor: colors.primary, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});
