import { useEffect, useRef } from 'react';
import useToast from '@/hooks/useToast';
import useLoading from '@/hooks/useLoading';
import { checkService } from '@/service';
import { cacheToken } from '@/utils';

const CHECK_CATEGORY = 'aliCloudPan';

function AliCloudPan() {
  const tokenInputRef = useRef(null);
  const sendKeyInputRef = useRef(null);
  const { openToast } = useToast();
  const { openLoading, closeLoading } = useLoading();
  const onCheck = () => {
    if (tokenInputRef.current.value === '') {
      openToast('请输入阿里云盘token', 'warning');
      return;
    }
    openLoading();
    checkService.get('/check/aliCloudPan', {
      params: {
        token: tokenInputRef.current.value,
        sendKey: sendKeyInputRef.current.value,
      },
    }).then((res) => {
      console.log(res);
      if (!res.success) {
        openToast(res.msg, 'error');
        return;
      }
      openToast(`签到成功, ${res?.data?.notice}`, 'success');
    }).finally(() => {
      cacheToken(tokenInputRef.current.value, CHECK_CATEGORY);
      closeLoading();
    });
  };
  useEffect(() => {
    const cachecookie = JSON.parse(window.localStorage.getItem('tokenList') || '[]').find((item) => item.name === CHECK_CATEGORY);
    if (cachecookie) {
      tokenInputRef.current.value = cachecookie.token;
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
          <span className="label-text">refresh_token</span>
        </div>
        <input ref={tokenInputRef} type="text" placeholder="请输入阿里云盘refresh_token" className="input input-bordered w-full box-border" />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">sendKey</span>
        </div>
        <input ref={sendKeyInputRef} type="text" placeholder="请输入Server酱的sendKey, 用于签到结果微信通知" className="input input-bordered w-full box-border" />
      </label>
      <button className="btn  btn-accent box-border w-full mt-4" onClick={onCheck}>签到</button>
      <p className='text-2xl mt-8'>refresh_token获取</p>
      <p className='text-sm mt-2'>1. 登录阿里云盘<a className='text-blue-600' href="https://www.aliyundrive.com/sign/in" target="_blank" rel="noreferrer">https://www.aliyundrive.com/sign/in</a></p>
      <p className='text-sm mt-2'>2. 复制以下指令，按F12打开开发者工具-控制台; <br />第一行命令用于自动复制refresh_token到剪贴板，<br />第二行命令用于测试是否成功获取到refresh_token</p>
      <div className="mockup-code mt-1">
        <pre className="text-success">
          <code>
            copy(JSON.parse(localStorage.token).refresh_token);
          </code>
        </pre>
        <pre className="text-success">
          <code>
            console.log(JSON.parse(localStorage.token).refresh_token);
          </code>
        </pre>
      </div>
      <p className='text-sm mt-2'>3. 将refresh_token粘贴到上方refresh_token输入框中</p>

      <p className='text-2xl mt-8'>sendKey获取-可选</p>
      <p className='text-sm mt-2'>1. 登录Server酱<a className='text-blue-600' href="https://sct.ftqq.com/login" target="_blank" rel="noreferrer">https://sct.ftqq.com/login</a></p>
      <p className='text-sm mt-2'>2. 点击顶部菜单<span className='font-bold text-red-400'>通道配置</span>，选择通知方式</p>
      <p className='text-sm mt-2'>3. 点击顶部菜单<span className='font-bold text-red-400'>Key&APi</span>，复制SendKey</p>
      <p className='text-sm mt-2'>4. 将SendKey粘贴到上方sendKey输入框中</p>
    </div>
  );
}

export default AliCloudPan;