import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useLoading from '@/hooks/useLoading';
import { musicService } from '@/service';
import { menuStore, userInfoStore } from '@/store';

const MenuData = [
  {
    name: '首页',
    path: '/home',
    icon: 'icon-home',
  },
  {
    name: '工具箱',
    path: '/toolbox',
    icon: 'icon-toolbox',
  },
  {
    name: '关于',
    path: '/about',
    icon: 'icon-about',
  },
  {
    name: '个人中心',
    path: '/profile',
    icon: 'icon-profile',
  },
];

export default function MainLayout() {
  const { openLoading, closeLoading } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState([]);

  const onSelectMenu = (menu) => {
    setCurrentMenu(menu);
    navigate(menu.path);
  };

  useEffect(() => {
    console.log(location);
    const currentMenu = MenuData.find((item) => item.path === location.pathname);
    if (currentMenu) {
      setCurrentMenu(currentMenu);
    }
    menuStore.setStorage('path', location.pathname);
  }, [location]);

  useEffect(() => {
    openLoading();
    musicService.post('/login/status').then((res) => {
      // console.log(res);
      if (res?.data.profile) {
        userInfoStore.setStorage('profile', res?.data.profile);
        return;
      }
      userInfoStore.removeStorage('profile');
    }).finally(() => {
      closeLoading();
    });
  }, []);

  return <>
    <div className='m-2 flex-auto	pb-10'>
      <Outlet />
    </div>
    <div className="tabs tabs-boxed justify-around box-border fixed bottom-[-2px] w-full rounded-t-xl rounded-b-none">
      {
        MenuData.map((item) => {
          return <a
            key={item.name}
            className={`tab ${currentMenu.path === item.path ? 'tab-active' : ''}`}
            onClick={() => onSelectMenu(item)}
          >
            {/* <i className={`iconfont ${item.icon}`}></i> */}
            <span>{item.name}</span>
          </a>;
        })
      }
    </div>
  </>;
}