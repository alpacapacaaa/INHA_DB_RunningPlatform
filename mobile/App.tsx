import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useMemo, useState } from 'react';
import BottomTabBar, { TabKey } from './src/components/BottomTabBar';
import CourseHomeScreen from './src/screens/CourseHomeScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import RunScreen from './src/screens/RunScreen';
import RunCompleteScreen from './src/screens/RunCompleteScreen';
import RecruitScreen from './src/screens/RecruitScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import CreateCourseScreen from './src/screens/CreateCourseScreen';
import { getCourseById, mockRunRecords } from './src/data/mockData';
import { RunRecord } from './src/types';
import { colors } from './src/theme';

type RunView = 'tracker' | 'complete' | 'create-course';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('코스');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeRunCourseId, setActiveRunCourseId] = useState<string | null>('1');
  const [runView, setRunView] = useState<RunView>('tracker');
  const [latestRecord, setLatestRecord] = useState<RunRecord>(mockRunRecords[0]);

  const selectedCourse = useMemo(
    () => (selectedCourseId ? getCourseById(selectedCourseId) : undefined),
    [selectedCourseId],
  );

  const activeRunCourse = useMemo(
    () => (activeRunCourseId ? getCourseById(activeRunCourseId) : undefined),
    [activeRunCourseId],
  );

  const handleOpenCourse = (courseId: string) => {
    setActiveTab('코스');
    setSelectedCourseId(courseId);
  };

  const handleStartRun = (courseId?: string) => {
    setActiveTab('달리기');
    setActiveRunCourseId(courseId ?? null);
    setRunView('tracker');
  };

  const renderScreen = () => {
    if (activeTab === '코스') {
      if (selectedCourse) {
        return (
          <CourseDetailScreen
            course={selectedCourse}
            onBack={() => setSelectedCourseId(null)}
            onStartRun={() => handleStartRun(selectedCourse.id)}
          />
        );
      }

      return <CourseHomeScreen onSelectCourse={handleOpenCourse} />;
    }

    if (activeTab === '달리기') {
      if (runView === 'complete') {
        return (
          <RunCompleteScreen
            course={activeRunCourse}
            record={latestRecord}
            onBackToRun={() => setRunView('tracker')}
            onCreateCourse={() => setRunView('create-course')}
          />
        );
      }

      if (runView === 'create-course') {
        return (
          <CreateCourseScreen
            record={latestRecord}
            onClose={() => {
              setRunView('tracker');
              setActiveTab('코스');
              setSelectedCourseId(null);
            }}
          />
        );
      }

      return (
        <RunScreen
          course={activeRunCourse}
          onComplete={(record) => {
            setLatestRecord(record);
            setRunView('complete');
          }}
        />
      );
    }

    if (activeTab === '모집') {
      return <RecruitScreen onOpenCourse={handleOpenCourse} />;
    }

    if (activeTab === '히스토리') {
      return <HistoryScreen />;
    }

    return <MyPageScreen />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.content}>{renderScreen()}</View>
        <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 94,
  },
});
