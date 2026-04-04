import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import RunTracker from './pages/RunTracker';
import RunComplete from './pages/RunComplete';
import MyPage from './pages/MyPage';
import CreateCourse from './pages/CreateCourse';
import CrewList from './pages/CrewList';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'course/:id', Component: CourseDetail },
      { path: 'run', Component: RunTracker },
      { path: 'run/complete', Component: RunComplete },
      { path: 'my-page', Component: MyPage },
      { path: 'create-course', Component: CreateCourse },
      { path: 'crew', Component: CrewList },
    ],
  },
]);
