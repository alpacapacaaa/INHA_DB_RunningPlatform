import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { ComponentProps } from 'react';
import { colors } from '../theme';

interface EmptyStateProps {
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
}

export default function EmptyState({ icon = 'file-tray-outline', title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={40} color={colors.line} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.subtext,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
});
