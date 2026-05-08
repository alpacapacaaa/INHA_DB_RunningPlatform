import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export type TabKey = '코스' | '달리기' | '모집' | '히스토리' | '마이';

interface BottomTabBarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: 'map' | 'footsteps' | 'chat' | 'time' | 'person' }[] = [
  { key: '코스', label: '코스', icon: 'map' },
  { key: '달리기', label: '달리기', icon: 'footsteps' },
  { key: '모집', label: '모집', icon: 'chat' },
  { key: '히스토리', label: '히스토리', icon: 'time' },
  { key: '마이', label: '마이', icon: 'person' },
];

function renderIcon(icon: 'map' | 'footsteps' | 'chat' | 'time' | 'person', active: boolean) {
  const color = active ? '#FFFFFF' : colors.subtext;

  switch (icon) {
    case 'map':
      return <Ionicons name="map-outline" size={21} color={color} />;
    case 'footsteps':
      return <MaterialCommunityIcons name="shoe-print" size={21} color={color} />;
    case 'chat':
      return <Ionicons name="chatbubble-ellipses-outline" size={21} color={color} />;
    case 'time':
      return <Ionicons name="time-outline" size={21} color={color} />;
    case 'person':
      return <Ionicons name="person-outline" size={21} color={color} />;
  }
}

export default function BottomTabBar({ activeTab, onChange }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={styles.item} activeOpacity={0.9} onPress={() => onChange(tab.key)}>
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>{renderIcon(tab.icon, active)}</View>
              <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderWidth: 1,
    borderColor: '#ECEDEA',
    shadowColor: '#0F172A',
    shadowOpacity: 0.045,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.subtext,
  },
  labelActive: {
    color: colors.text,
  },
});
