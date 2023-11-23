import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInfoStore } from '@/store';
import useToast from '@/hooks/useToast';
import useLoading from '@/hooks/useLoading';
import { musicService, musicAdminService } from '@/service';
import PlaylistShow from '@/components/PlaylistShow';
import CloudSongShow from '@/components/CloudSongShow';

const tabOptions = [
  {
    name: '创建歌单',
    value: 'created',
  },
  {
    name: '订阅歌单',
    value: 'subscribed',
  },
  {
    name: '云盘歌曲',
    value: 'cloud',
  },
];

function Profile() {
  const { openLoading, closeLoading } = useLoading();
  const { openToast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [userDetails, setUserDetails] = useState({
    profile: {},
    level: {},
    playlistInfo: {},
  });
  const [playlist, setPlaylist] = useState({
    created: [],
    subscribed: [],
    cloud: [],
    cloudCount: 0,
  });
  const [currentTab, setCurrentTab] = useState(tabOptions[0].value);

  const getUserPlaylistInfo = async () => {
    return new Promise((resolve, reject) => {
      musicService.post('/user/subcount').then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };
  const getUserInfoDetails = async (uid) => {
    return new Promise((resolve, reject) => {
      musicService.post('/user/detail', {
        uid,
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };
  const getUserLevelInfo = async () => {
    return new Promise((resolve, reject) => {
      musicService.post('/user/level').then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };
  const getUserPlaylist = async ({
    uid,
    limit = 30,
    offset = 0,
  } = {}) => {
    return new Promise((resolve, reject) => {
      musicService.post('/user/playlist', {
        uid,
        limit,
        offset,
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };
  const getCloud = async ({
    limit = 30,
    offset = 0,
  } = {}) => {
    return new Promise((resolve, reject) => {
      musicService.post('/user/cloud', {
        limit,
        offset,
      }).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  };

  const getUserDetails = (uid) => {
    openLoading();
    Promise.allSettled([
      getUserPlaylistInfo(),
      getUserLevelInfo(),
      getUserInfoDetails(uid),
      getUserPlaylist({ uid }),
      getCloud(),
    ]).then((res) => {
      console.log(res);
      const levelInfo = {
        ...res[1].value.data,
        isFull: res[1].value?.full ?? false,
      };
      setUserDetails({
        level: levelInfo,
        playlistInfo: res[0].value,
        profile: res[2].value.profile,
      });
      userInfoStore.setStorage('profile', res[2].value.profile);
      userInfoStore.setStorage('level', levelInfo);
      userInfoStore.setStorage('playlistInfo', res[0].value);
      setPlaylist({
        created: res[3].value.playlist.filter((item) => item.creator.userId === uid),
        subscribed: res[3].value.playlist.filter((item) => item.creator.userId !== uid),
        cloud: res[4].value.data,
        cloudCount: res[4].value.count,
      });
    }).finally(() => {
      setIsLogin(true);
      closeLoading();
    });
  };

  const onLogin = () => {
    navigate('/login');
  };

  const updateData = () => {
    console.log('updateData');
    openLoading();
    musicAdminService.get('/song/update/all').then((res) => {
      console.log(res);
      if (!res.success) {
        openToast('同步失败', 'error');
        return;
      }
      openToast('同步成功', 'success');
    }).finally(() => {
      closeLoading();
    });
  };

  useEffect(() => {
    const _profile = userInfoStore.getStorage('profile');
    if (_profile) {
      getUserDetails(_profile?.userId);
      setIsLogin(true);
    }
  }, []);

  return <>
    {
      isLogin && <div>
        <div className="w-full text-center stat p-2 box-border rounded-2xl border  border-solid	border-inherit bg-gradient-to-r from-sky-50 via-sky-100 to-sky-50 relative">
          {
            userDetails.profile?.userId === 545932469 && <button className='btn btn-accent absolute top-2 right-2 z-[1]' onClick={updateData}>同步</button>
          }
          <div className="avatar justify-center">
            <div className="w-24 rounded-full">
              <img src={userDetails.profile.avatarUrl} />
            </div>
          </div>
          <p className='text-lg font-bold mt-2'>{userDetails.profile?.nickname ?? '-'}</p>
          <p className='text-sm'>{userDetails.profile?.signature ?? '-'}</p>
          <div className="stats flex bg-transparent">
            <div className="stat p-0 my-2">
              <div className="stat-title">创建歌单数</div>
              <div className="stat-value">{userDetails.playlistInfo?.createdPlaylistCount ?? 0}</div>
            </div>
            <div className="stat p-0 my-2">
              <div className="stat-title">订阅歌单数</div>
              <div className="stat-value">{userDetails.playlistInfo?.subPlaylistCount ?? 0}</div>
            </div>
            <div className="stat p-0 my-2">
              <div className="stat-title">云盘歌曲数</div>
              <div className="stat-value">{playlist?.cloudCount ?? 0}</div>
            </div>
          </div>
        </div>
        <div className="tabs justify-center mt-4">
          {
            tabOptions.map((item) => {
              return <a
                key={item.value}
                className={`tab tab-lifted ${currentTab === item.value ? 'tab-active' : ''}`}
                onClick={() => setCurrentTab(item.value)}
              >{item.name}</a>;
            })
          }
        </div>
        <div className="card w-full bg-base-100 shadow mt-2">
          <div className="card-body p-2">
            {
              currentTab === 'cloud' ? <CloudSongShow data={playlist.cloud} /> : <PlaylistShow data={playlist[currentTab]} />
            }
          </div>
        </div>
      </div>
    }
    {
      !isLogin && <div className="w-full text-center flex flex-col justify-center items-center">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
            <span className="text-3xl">i</span>
          </div>
        </div>
        <button className="btn mt-2" onClick={onLogin}>登录</button>
      </div>
    }
  </>;
}

export default Profile;