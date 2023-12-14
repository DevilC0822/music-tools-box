import axios from 'axios';
import useToast from '@/hooks/useToast';

class Service {
  instance;
  constructor({
    baseUrl = '',
    type = 'music',
  }) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 600000,
      withCredentials: true,
    });
    this.instance.interceptors.request.use((config) => {
      if (type === 'music') {
        // 添加时间戳
        config.params = {
          ...config.params,
          timestamp: Date.now(),
        };
        const cookie = localStorage.getItem('cookie');
        if (cookie) {
          if (config.method === 'get') {
            config.params = {
              ...config.params,
              cookie: encodeURIComponent(cookie),
            };
          }
          if (config.method === 'post') {
            config.data = {
              ...config.data,
              cookie: cookie,
            };
          }
        }
      }
      if (type === 'admin') {
        // config.headers['Content-Disposition'] = 'attachment';
        // config.headers['Content-Type'] = 'audio/mp3';
      }
      if (type === 'check') {
        // 
      }
      return config;
    });
    this.instance.interceptors.response.use((response) => {
      return response?.data;
    }, (error) => {
      const { openToast } = useToast();
      openToast(error?.message || '服务器异常', 'error');
      return Promise.reject(error);
    });
  }
  get(url, params) {
    return this.instance.get(url, { ...params });
  }
  post(url, data, params) {
    return this.instance.post(url, data, { ...params });
  }
}

const musicService = new Service({
  baseUrl: import.meta.env.VITE_MUSIC_AXIOS_BASE_URL,
  type: 'music',
});

const musicAdminService = new Service({
  baseUrl: import.meta.env.VITE_ADMIN_AXIOS_BASE_URL,
  type: 'admin',
});

const checkService = new Service({
  baseUrl: import.meta.env.VITE_CHECK_AXIOS_BASE_URL,
  type: 'check',
});

export {
  musicService,
  musicAdminService,
  checkService,
};