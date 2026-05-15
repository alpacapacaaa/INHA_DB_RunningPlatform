import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Ionicons name="footsteps-outline" size={32} color={colors.card} />
          </View>
          <Text style={styles.appName}>Shape Run</Text>
          <Text style={styles.tagline}>지도를 그리듯 뛰고, 여행하듯 발견해요</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeRow}>
            {(['login', 'signup'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                  {m === 'login' ? '로그인' : '회원가입'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {mode === 'signup' && (
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={colors.subtext}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>이메일</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요"
              placeholderTextColor={colors.subtext}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor={colors.subtext}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
            <Text style={styles.submitBtnText}>{mode === 'login' ? '로그인' : '가입하기'}</Text>
          </TouchableOpacity>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.terms}>
          가입하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 28 },
  hero: { alignItems: 'center', gap: 12 },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 32, fontWeight: '900', color: colors.card, letterSpacing: -0.8 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 24,
    gap: 16,
  },
  modeRow: { flexDirection: 'row', borderRadius: 16, backgroundColor: colors.mutedCard, padding: 4, gap: 4 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 13, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.card },
  modeBtnText: { fontSize: 14, fontWeight: '600', color: colors.subtext },
  modeBtnTextActive: { color: colors.text },
  inputWrap: { gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  input: {
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.mutedCard,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  submitBtn: {
    marginTop: 4,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: colors.card },
  forgotBtn: { alignItems: 'center' },
  forgotText: { fontSize: 13, color: colors.subtext, fontWeight: '500' },
  terms: { fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 17 },
});
