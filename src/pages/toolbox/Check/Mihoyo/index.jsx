import { useEffect, useRef } from 'react';
import useToast from '@/hooks/useToast';
import useLoading from '@/hooks/useLoading';
import { checkService } from '@/service';
import { cacheToken } from '@/utils';
import grabImg from '@/assets/img/grab.png';

const CHECK_CATEGORY = 'mihoyo';

function Mihoyo() {
  const cookieInputRef = useRef(null);
  const sendKeyInputRef = useRef(null);
  const { openToast } = useToast();
  const { openLoading, closeLoading } = useLoading();
  const onCheck = () => {
    if (cookieInputRef.current.value === '') {
      openToast('请输入米游社Cookie', 'warning');
      return;
    }
    openLoading();
    checkService.get('/check/mihoyo', {
      params: {
        cookie: cookieInputRef.current.value,
        sendKey: sendKeyInputRef.current.value,
      },
    }).then((res) => {
      if (!res.success) {
        openToast(res.msg, 'error');
        return;
      }
      openToast('签到成功', 'success');
    }).finally(() => {
      cacheToken(cookieInputRef.current.value, CHECK_CATEGORY);
      closeLoading();
    });
  };
  useEffect(() => {
    const cachecookie = JSON.parse(window.localStorage.getItem('tokenList') || '[]').find((item) => item.name === CHECK_CATEGORY);
    if (cachecookie) {
      cookieInputRef.current.value = cachecookie.token;
    }
    const cacheSendKey = JSON.parse(window.localStorage.getItem('sendKey') || '""');
    if (cacheSendKey) {
      sendKeyInputRef.current.value = cacheSendKey;
    }
  }, []);
  return (
    <div>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Cookie</span>
        </div>
        <input ref={cookieInputRef} type="text" placeholder="请输入米游社Cookie" className="input input-bordered w-full box-border" />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">sendKey</span>
        </div>
        <input ref={sendKeyInputRef} type="text" placeholder="请输入Server酱的sendKey, 用于签到结果微信通知" className="input input-bordered w-full box-border" />
      </label>
      <button className="btn  btn-accent box-border w-full mt-4" onClick={onCheck}>签到</button>
      <p className='text-2xl mt-8'>Cookie获取</p>
      <p className='text-sm mt-2'>使用手机抓包获取Cookie<br />
      <span className='font-bold text-red-400'>stuid=;stoken=;login_ticket=	</span>
      </p>
      <img className='w-full mt-2' src={grabImg} alt="" />

      <p className='text-2xl mt-8'>sendKey获取-可选</p>
      <p className='text-sm mt-2'>1. 登录Server酱<a className='text-blue-600' href="https://sct.ftqq.com/login" target="_blank" rel="noreferrer">https://sct.ftqq.com/login</a></p>
      <p className='text-sm mt-2'>2. 点击顶部菜单<span className='font-bold text-red-400'>通道配置</span>，选择通知方式</p>
      <p className='text-sm mt-2'>3. 点击顶部菜单<span className='font-bold text-red-400'>Key&APi</span>，复制SendKey</p>
      <p className='text-sm mt-2'>4. 将SendKey粘贴到上方sendKey输入框中</p>
    </div>
  );
}

export default Mihoyo;