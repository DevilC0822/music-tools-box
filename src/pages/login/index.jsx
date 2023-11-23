/* eslint-disable react/display-name */
import { useEffect, useState, useImperativeHandle, forwardRef, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '@/hooks/useToast';
import { musicService } from '@/service';
import styles from './index.module.scss';

let timer = null;

const PhoneLogin = () => {
  return <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">手机号</span>
      </label>
      <input type="text" placeholder="请输入手机号" className="input input-bordered input-primary" />
    </div>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">密码</span>
      </label>
      <input type="password" placeholder="请输入密码" className="input input-bordered input-primary" />
    </div>
  </>;
};
const EmailLogin = () => {
  return <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">邮箱</span>
      </label>
      <input type="text" placeholder="请输入邮箱" className="input input-bordered input-primary" />
    </div>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">密码</span>
      </label>
      <input type="password" placeholder="请输入密码" className="input input-bordered input-primary" />
    </div>
  </>;
};
const ScanLogin = forwardRef((props, ref) => {
  const { openToast } = useToast();
  const [unikey, setUnikey] = useState('');
  const [qRCodeUrl, setQRCodeUrl] = useState('');
  const [msg, setMsg] = useState('请使用网易云App扫一扫');

  const getQRCodeKey = async () => {
    return new Promise((resolve, reject) => {
      musicService.get('/login/qr/key').then(res => {
        setUnikey(res.data.unikey);
        resolve(res.data.unikey);
      }).catch(err => {
        reject(err);
      });
    });
  };
  const getQRCode = async (key) => {
    return new Promise((resolve, reject) => {
      musicService.get('/login/qr/create', {
        params: {
          key: key || unikey,
          qrimg: true,
        }
      }).then(res => {
        setQRCodeUrl(res.data.qrimg);
        resolve(key || unikey);
      }).catch(err => {
        reject(err);
      });
    });
  };
  const checkQRCode = async (key) => {
    return new Promise((resolve, reject) => {
      musicService.get('/login/qr/check', {
        params: {
          key: key || unikey,
        }
      }).then(res => {
        // 状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回502,则需加上noCookie参数,如&noCookie=true
        if (res.code === 803) {
          clearInterval(timer);
          // 保存cookie
          window.localStorage.setItem('cookie', res.cookie);
          openToast('登录成功', 'success');
          props.onLoginSuccess();
          return;
        }
        if (res.code === 800) {
          setMsg('二维码过期');
          return;
        }
        if (res.code === 801) {
          setMsg('等待扫码');
          return;
        }
        if (res.code === 802) {
          setMsg('待确认');
          return;
        }
      }).catch(err => {
        reject(err);
      });
    });
  };
  const init = async () => {
    clearInterval(timer);
    const key = await getQRCodeKey();
    await getQRCode(key);
    timer = setInterval(() => {
      checkQRCode(key);
    }, 1000);
  };
  useEffect(() => {
    init();
  }, []);
  useImperativeHandle(ref, () => {
    return {
      init,
    };
  });
  return <>
    <div className="form-control w-full">
      <label className="label justify-center">
        <span className="label-text text-xl font-bold">扫码登录</span>
      </label>
      <div className="avatar justify-center">
        <div className="w-3/4 rounded">
          <img src={qRCodeUrl} />
        </div>
      </div>
      <p className='text-center mt-4 text-lg'>{msg}</p>
    </div>
  </>;
});

const loginMethodsOptions = [
  {
    name: '手机号密码登录',
    value: 'phone',
    disabled: true,
  },
  {
    name: '邮箱密码登录',
    value: 'email',
    disabled: true,
  },
  {
    name: '扫码登录',
    value: 'scan',
    disabled: false,
  },
];

function Login() {
  const scanRef = useRef(null);
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('scan');

  const onSlectLoginMethod = (item) => {
    if (item.disabled) return;
    setLoginMethod(item.value);
  };

  const goHome = () => {
    navigate('/');
  };
  const onLoginSuccess = () => {
    navigate('/');
  };

  const loginMethodsMap = useMemo(() => {
    return {
      phone: <PhoneLogin />,
      email: <EmailLogin />,
      scan: <ScanLogin ref={scanRef} onLoginSuccess={onLoginSuccess} />,
    };
  }, []);

  return <div className={styles.LoginBg}>
    <div className="card w-full glass">
      <div className="card-body p-6">
        <h2 className="card-title">登录</h2>
        {
          loginMethodsMap[loginMethod]
        }
        <div className="card-actions justify-between items-center mt-2">
          <div className="dropdown">
            <label tabIndex={0} className="btn">换种方式登录</label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
              {
                loginMethodsOptions.filter((item) => item.value !== loginMethod).map((item) => {
                  return <li
                    key={item.value}
                    className={`${item.disabled ? 'disabled' : ''}`}
                    onClick={() => onSlectLoginMethod(item)}
                  >
                    <a disabled={item.disabled}>{item.name}</a>
                  </li>;
                })
              }
            </ul>
          </div>
          {
            loginMethod === 'scan' && <button className="btn btn-primary" onClick={() => {
              scanRef.current.init();
            }}>刷新二维码</button>
          }
          {
            loginMethod !== 'scan' && <button className="btn btn-primary">Login</button>
          }
        </div>
      </div>
    </div>
    <button className="btn btn-secondary mt-10" onClick={goHome}>返回首页</button>
  </div>;
}

export default Login;