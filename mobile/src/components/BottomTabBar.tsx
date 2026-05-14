import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';

type RouteKey = 'Course' | 'History' | 'Run' | 'Recruit' | 'MyPage';

const TAB_CONFIG: Record<RouteKey, { label: string; icon: 'map-outline' | 'calendar-outline' | 'people-outline' | 'person-outline' }> = {
  Course:  { label: '코스',    icon: 'map-outline' },
  History: { label: '기록',    icon: 'calendar-outline' },
  Recruit: { label: '모집',    icon: 'people-outline' },
  MyPage:  { label: '내 정보', icon: 'person-outline' },
  Run:     { label: '달리기',  icon: 'map-outline' },
};

const LEFT_ROUTES:  RouteKey[] = ['Course', 'History'];
const RIGHT_ROUTES: RouteKey[] = ['Recruit', 'MyPage'];

function SideTab({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: 'map-outline' | 'calendar-outline' | 'people-outline' | 'person-outline';
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.75} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? colors.text : colors.subtext} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index].name as RouteKey;

  const navigate = (route: RouteKey) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {LEFT_ROUTES.map((route) => {
          const cfg = TAB_CONFIG[route];
          return (
            <SideTab
              key={route}
              label={cfg.label}
              icon={cfg.icon}
              active={activeRoute === route}
              onPress={() => navigate(route)}
            />
          );
        })}

        <TouchableOpacity
          style={[styles.fab, activeRoute === 'Run' && styles.fabActive]}
          activeOpacity={0.85}
          onPress={() => navigate('Run')}
        >
          <MaterialCommunityIcons name="shoe-print" size={24} color={colors.card} />
        </TouchableOpacity>

        {RIGHT_ROUTES.map((route) => {
          const cfg = TAB_CONFIG[route];
          return (
            <SideTab
              key={route}
              label={cfg.label}
              icon={cfg.icon}
              active={activeRoute === route}
              onPress={() => navigate(route)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.subtext,
  },
  labelActive: {
    color: colors.text,
    fontWeight: '600',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    marginHorizontal: 6,
    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabActive: {
    backgroundColor: colors.accentDeep,
  },
});
