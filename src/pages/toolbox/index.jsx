import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

function ToolBox() {
  const navigate = useNavigate();
  const onSingleImport = () => {
    navigate('/signle-import/singer');
  };
  const onAliCloudPan = () => {
    navigate('/check/ali-cloud-pan');
  };
  const onMihoyo = () => {
    navigate('/check/mihoyo');
  };
  return <div>
    <div className="text-sm text-slate-400 ml-2">导入</div>
    <div className="stats stats-vertical shadow flex flex-wrap mt-2">
      <div className="stat p-2 box-border">
        <p onClick={onSingleImport}>单曲导入</p>
      </div>
      <div className={`stat p-2 box-border ${styles.disabled}`}>
        <p>歌单导入</p>
      </div>
    </div>
    <div className="text-sm text-slate-400 ml-2 mt-4">签到</div>
    <div className="stats stats-vertical shadow flex flex-wrap mt-2">
      <div className="stat p-2 box-border">
        <p onClick={onAliCloudPan}>阿里云盘</p>
      </div>
      <div className={'stat p-2 box-border'}>
        <p onClick={onMihoyo}>米游社</p>
      </div>
    </div>
  </div>;
}

export default ToolBox;