import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import BottomTabBar from '../components/BottomTabBar';
import CourseHomeScreen from '../screens/CourseHomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import RunScreen from '../screens/RunScreen';
import RunCompleteScreen from '../screens/RunCompleteScreen';
import CreateCourseScreen from '../screens/CreateCourseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RecordDetailScreen from '../screens/RecordDetailScreen';
import RecruitScreen from '../screens/RecruitScreen';
import MyPageScreen from '../screens/MyPageScreen';
import ShoesScreen from '../screens/ShoesScreen';
import LevelTestScreen from '../screens/LevelTestScreen';

import type {
  MainTabParamList,
  CourseStackParamList,
  RunStackParamList,
  HistoryStackParamList,
  MyPageStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const CourseStack = createNativeStackNavigator<CourseStackParamList>();
const RunStack = createNativeStackNavigator<RunStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const MyPageStack = createNativeStackNavigator<MyPageStackParamList>();

function CourseNavigator() {
  return (
    <CourseStack.Navigator screenOptions={{ headerShown: false }}>
      <CourseStack.Screen name="CourseHome" component={CourseHomeScreen} />
      <CourseStack.Screen name="CourseDetail" component={CourseDetailScreen} />
    </CourseStack.Navigator>
  );
}

function RunNavigator() {
  return (
    <RunStack.Navigator screenOptions={{ headerShown: false }}>
      <RunStack.Screen name="RunTracker" component={RunScreen} />
      <RunStack.Screen name="RunComplete" component={RunCompleteScreen} />
      <RunStack.Screen name="CreateCourse" component={CreateCourseScreen} />
    </RunStack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={{ headerShown: false }}>
      <HistoryStack.Screen name="HistoryHome" component={HistoryScreen} />
      <HistoryStack.Screen name="RecordDetail" component={RecordDetailScreen} />
    </HistoryStack.Navigator>
  );
}

function MyPageNavigator() {
  return (
    <MyPageStack.Navigator screenOptions={{ headerShown: false }}>
      <MyPageStack.Screen name="MyPageHome" component={MyPageScreen} />
      <MyPageStack.Screen name="Shoes" component={ShoesScreen} />
      <MyPageStack.Screen name="LevelTest" component={LevelTestScreen} />
    </MyPageStack.Navigator>
  );
}

function renderTabBar(props: BottomTabBarProps) {
  return <BottomTabBar {...props} />;
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Course" component={CourseNavigator} />
      <Tab.Screen name="History" component={HistoryNavigator} />
      <Tab.Screen name="Run" component={RunNavigator} />
      <Tab.Screen name="Recruit" component={RecruitScreen} />
      <Tab.Screen name="MyPage" component={MyPageNavigator} />
    </Tab.Navigator>
  );
}
