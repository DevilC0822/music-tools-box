import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { musicAdminService, musicService } from '@/service';
import useToast from '@/hooks/useToast';
import useLoading from '@/hooks/useLoading';
import { debounce } from 'lodash';

const pageInfo = {
  limit: 20,
  offset: 0,
};

function SignleImport() {
  const { openToast } = useToast();
  const { openLoading, closeLoading } = useLoading();
  const location = useLocation();
  const [dataSources, setDataSources] = useState([]);
  const [singerId, setSingerId] = useState('');

  const getSongFile = async (song) => {
    return new Promise((resolve, reject) => {
      musicAdminService.get(`/song/file/?songId=${song._id}`, { responseType: 'blob' }).then((res) => {
        resolve(new Blob([res], { type: `audio/${song.fileType}` }));
      }).catch((err) => {
        reject(err);
      });
    });
  };

  const onImport = async (song) => {
    openLoading();
    const blob = await getSongFile(song);
    musicService.post('/cloud', {
      songFile: blob,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      if (res.code !== 200) {
        openToast('上传失败，请重试', 'error');
        return;
      }
      openToast('上传成功，请前往网易云App云盘查看', 'success');
    }).catch((err) => {
      console.log(err);
      openToast('出错了，请联系管理员或重试', 'error');
    }).finally(() => {
      closeLoading();
    });
  };
  const onDownLoadingToLocal = async (song) => {
    openLoading();
    const file = await getSongFile(song);
    const blob = new Blob([file], { type: `audio/${song.fileType}` });
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${song.name}`);
    document.body.appendChild(link);
    link.click();
    closeLoading();
  };

  const getDataSources = async (id = singerId) => {
    console.log(id);
    openLoading();
    const { limit, offset } = pageInfo;
    const res = await musicAdminService.get(`/song?limit=${limit}&offset=${offset}?singerId=${id}`);
    closeLoading();
    if (res.data.hasMore === false) {
      openToast('没有更多了', 'warning');
      window.removeEventListener('scroll', onScroll);
      return;
    }
    setDataSources((pre) => {
      return [...pre, ...res.data.list];
    });
    pageInfo.offset += pageInfo.limit;
  };

  const onScroll = debounce(() => {
    console.log('scroll');
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight === scrollHeight) {
      getDataSources();
    }
  }, 500);

  useEffect(() => {
    setSingerId(location.state.id);
    getDataSources(location.state.id);

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      setDataSources([]);
      pageInfo.offset = 0;
      pageInfo.limit = 20;
    };
  }, []);

  return <>
    {
      dataSources.map((song) => {
        return <div key={song._id} className="flex my-2">
          <div className="avatar mr-2">
            <div className="w-12 rounded-lg">
              <img src={`${song?.picUrl}?param=50y50`} />
            </div>
          </div>
          <div className="flex flex-auto justify-between max-w-[85%]">
            <div className="overflow-hidden max-w-[60%]">
              <div className="truncate text-sm">{song?.name}</div>
              <div className="text-xs	text-slate-400 mt-2">{song?.singer}</div>
            </div>
            {/* <button className="btn btn-secondary" onClick={() => { onImport(song); }}>导入</button> */}
            <div className="join">
              <button className="btn btn-sm btn-secondary join-item" onClick={() => { onImport(song); }}>云盘</button>
              <button className="btn btn-sm btn-secondary join-item" onClick={() => { onDownLoadingToLocal(song); }}>本地</button>
            </div>
          </div>
        </div>;
      })
    }
  </>;
}

export default SignleImport;