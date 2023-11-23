class CustomStore {
  prefix;
  constructor(prefix, defaultValue) {
    this.prefix = prefix;
    const storageValue = window.localStorage.getItem(prefix);
    localStorage.setItem(prefix, storageValue || JSON.stringify(defaultValue));
  }
  setStorage(key, value) {
    if (value === '' || value === null || value === undefined) {
      value = null;
    }
    if (key === undefined) {
      window.localStorage.setItem(this.prefix, JSON.stringify(value));
      return;
    }
    const storageValue = window.localStorage.getItem(this.prefix);
    if (storageValue === null || storageValue === undefined) {
      return;
    }
    const obj = JSON.parse(storageValue);
    obj[key] = value;
    window.localStorage.setItem(this.prefix, JSON.stringify(obj));
  }
  getStorage(key) {
    if (key === undefined) {
      const value = window.localStorage.getItem(this.prefix);
      if (value === null || value === undefined) {
        return null;
      }
      return JSON.parse(value);
    }
    const value = window.localStorage.getItem(this.prefix);
    if (value === null || value === undefined) {
      return null;
    }
    const obj = JSON.parse(value);
    return obj[key] || null;
  }
  removeStorage(key) {
    if (key === undefined) {
      window.localStorage.removeItem(this.prefix);
      return;
    }
    const value = window.localStorage.getItem(this.prefix);
    if (value === null || value === undefined) {
      return;
    }
    const obj = JSON.parse(value);
    delete obj[key];
    window.localStorage.setItem(this.prefix, JSON.stringify(obj));
  }
}

const menuStore = new CustomStore('current-menu', {
  path: '/home',
});

const userInfoStore = new CustomStore('user-info', {});

export { menuStore, userInfoStore };

