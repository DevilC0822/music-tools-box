import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicAdminService } from '@/service';
import useLoading from '@/hooks/useLoading';

const pageInfo = {
  limit: 20,
  offset: 0,
};

function Singer() {
  const { openLoading, closeLoading } = useLoading();
  const navigate = useNavigate();
  const [dataSources, setDataSources] = useState([]);

  const getDataSources = async () => {
    try{
      openLoading();
      const { limit, offset } = pageInfo;
      const res = await musicAdminService.get(`/singer?limit=${limit}&offset=${offset}`);
      closeLoading();
      setDataSources((pre) => {
        return [...pre, ...res.data.list];
      });
      pageInfo.offset += pageInfo.limit;
    } catch {
      closeLoading();
    }
  };

  const onClickName = (id) => {
    navigate('/signle-import/song', { state: { id } });
  };

  useEffect(() => {
    console.log('---');
    getDataSources();
    return () => {
      setDataSources([]);
      pageInfo.offset = 0;
      pageInfo.limit = 20;
    };
  }, []);

  return <>
    <div className='stats stats-vertical shadow flex flex-wrap mt-2'>
      {
        dataSources.map((singer) => {
          return <div key={singer._id} onClick={() => { onClickName(singer._id); }} className="stat p-2 box-border">
            <p >{singer.name}</p>
          </div>;
        })
      }
    </div>
  </>;
}

export default Singer;