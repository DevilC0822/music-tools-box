import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const MainLayout = lazy(() => import('@/components/MainLayout/index.jsx'));
const Login = lazy(() => import('@/pages/login/index.jsx'));
const Home = lazy(() => import('@/pages/home/index.jsx'));
const ToolBox = lazy(() => import('@/pages/toolbox/index.jsx'));
const About = lazy(() => import('@/pages/about/index.jsx'));
const Profile = lazy(() => import('@/pages/profile/index.jsx'));
const NotFound = lazy(() => import('@/components/NotFound/index.jsx'));

// ToolBox
const SignleImportSinger = lazy(() => import('@/pages/toolbox/SignleImport/singer/index.jsx'));
const SingleImportSong = lazy(() => import('@/pages/toolbox/SignleImport/song/index.jsx'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/home" />, // 重定向
  },
  {
    path: '/login',
    element: <Suspense><Login /></Suspense>,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'home',
        element: <Suspense><Home /></Suspense>,
      },
      {
        path: 'toolbox',
        element: <Suspense><ToolBox /></Suspense>,
      },
      {
        path: 'about',
        element: <Suspense><About /></Suspense>,
      },
      {
        path: 'profile',
        element: <Suspense><Profile /></Suspense>,
      },
      {
        path: 'signle-import/singer',
        element: <Suspense><SignleImportSinger /></Suspense>,
      },
      {
        path: 'signle-import/song',
        element: <Suspense><SingleImportSong /></Suspense>,
      },
      {
        path: '*',
        element: <Suspense><NotFound /></Suspense>,
      },
    ]
  }
];

export default routes;