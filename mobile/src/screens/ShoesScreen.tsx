import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { mockShoes } from '../data/mockData';
import { colors } from '../theme';
import { formatDistance } from '../lib/format';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';
import type { MyPageStackScreenProps } from '../navigation/types';

type Props = MyPageStackScreenProps<'Shoes'>;

const RETIRE_KM = 600;

export default function ShoesScreen({ navigation }: Props) {
  const { showToast } = useToast();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>신발 모아보기</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => showToast('신발 추가 기능은 준비 중이에요.', 'info')}>
          <Ionicons name="add" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {mockShoes.length === 0 ? (
        <EmptyState icon="footsteps-outline" title="등록된 신발이 없어요" description="+ 버튼으로 러닝화를 추가하세요" />
      ) : (
        <View style={styles.shoeList}>
          {mockShoes.map((shoe) => {
            const pct = Math.min((shoe.totalDistance / RETIRE_KM) * 100, 100);
            const nearRetire = pct >= 80;
            return (
              <View key={shoe.id} style={styles.shoeCard}>
                <View style={[styles.shoeBadge, { backgroundColor: shoe.accentStart }]}>
                  <MaterialCommunityIcons name="shoe-print" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.shoeInfo}>
                  <View style={styles.shoeNameRow}>
                    <Text style={styles.shoeBrand}>{shoe.brand}</Text>
                    {nearRetire && (
                      <View style={styles.warnPill}>
                        <Text style={styles.warnText}>교체 권장</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.shoeName}>{shoe.name}</Text>
                  <View style={styles.shoeStats}>
                    <Text style={styles.shoeDistance}>{formatDistance(shoe.totalDistance)}km</Text>
                    <Text style={styles.shoeDistanceMax}> / {RETIRE_KM}km</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.trackFill, { width: `${pct}%`, backgroundColor: nearRetire ? colors.danger : shoe.accentStart }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.tip}>
        <Ionicons name="information-circle-outline" size={16} color={colors.subtext} />
        <Text style={styles.tipText}>일반적으로 600~800km마다 교체를 권장해요.</Text>
      </View>
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
  shoeList: { gap: 16 },
  shoeCard: { flexDirection: 'row', gap: 16, backgroundColor: colors.card, borderRadius: 22, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  shoeBadge: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  shoeInfo: { flex: 1, gap: 6 },
  shoeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  shoeBrand: { fontSize: 12, fontWeight: '600', color: colors.subtext },
  warnPill: { borderRadius: 999, backgroundColor: '#FFE4E1', paddingHorizontal: 8, paddingVertical: 3 },
  warnText: { fontSize: 11, fontWeight: '700', color: colors.danger },
  shoeName: { fontSize: 17, fontWeight: '700', color: colors.text },
  shoeStats: { flexDirection: 'row', alignItems: 'baseline' },
  shoeDistance: { fontSize: 20, fontWeight: '800', color: colors.text },
  shoeDistanceMax: { fontSize: 13, color: colors.subtext },
  track: { height: 7, borderRadius: 999, backgroundColor: colors.mutedCard, overflow: 'hidden', marginTop: 4 },
  trackFill: { height: 7, borderRadius: 999 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  tipText: { fontSize: 13, color: colors.subtext, lineHeight: 20 },
});
