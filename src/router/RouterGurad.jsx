import routes from './index';
import { useEffect } from 'react';
import { useLocation, useRoutes, useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';


// 全局路由守卫
function guard(location, navigate, routes, openToast) {
  const { pathname } = location;

  if (pathname === '/') {
    navigate('/home');
    return false;
  }
  if (pathname === '/login') {
    return true;
  }
  // 路由匹配
  // const routedetail = routes.find((route) => route.path === pathname);

  // if (HOME_PAGES.includes(pathname)) {
  //   menuStore.setStorage('currentMenu', {
  //     selectedKeys: [pathname],
  //     openKeys: [pathname.split('/')[1]],
  //   });
  // }
  // 如果需要权限验证
  // if (routedetail?.auth ?? true) {
  //   const token = localStorage.getItem('logitech-token');
  //   if (!token) {
  //     // 未登录
  //     menuStore.setStorage('currentMenu', {
  //       selectedKeys: [''],
  //       openKeys: [''],
  //     });
  //     openToast('请先登录', 'error');
  //     navigate('/login', { state: { from: pathname } });
  //     // navigate(-1);
  //     return false;
  //   }
  // }
  return true;
}

const RouterGurad = () => {
  const { openToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    guard(location, navigate, routes, openToast);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);
  document.documentElement.scrollTo(0, 0);
  const Route = useRoutes(routes);
  return Route;
};

export default RouterGurad;
// d2a7b8fa-e28d-49dd-84a3-92686dc4f4fb
// d2a7b8fa-e28d-49dd-84a3-92686dc4f4fb

