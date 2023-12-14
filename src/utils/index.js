import dayjs from 'dayjs';

// 数字解密
const decryptNumRule1 = (num) => {
  if (!num) {
    return '';
  }
  // 1. 将字符串转换成数组以3.1415926为分隔符
  const arr = num.split('3.1415926');
  const date = dayjs().format('YYYY-MM-DD');
  const k = Number(date.split('-')[1]);
  const b = Number(date.split('-')[2]);
  // 2. 将数组中的每一项转换成数字 x = (y - b) / k
  const result = arr.map(item => {
    if (isNaN(Number(item))) {
      return item;
    }
    const y = Number(item);
    return (y - b) / k;
  });
  // 3. 将数组转换成字符串
  return result.join('');
};

const decryptNumRule2 = (num) => {
  if (!num) {
    return '';
  }
  // 1. 将字符串转换成数组以3.1415926为分隔符
  const arr = num.split('3.1415926');
  const date = dayjs().format('YYYY-MM-DD');
  const k = Number(date.split('-')[1]);
  const b = Number(date.split('-')[2]);
  // 2. 将数组中的每一项转换成数字 x = (y - b) / k
  const result = arr.map(item => {
    if (isNaN(parseInt(item, 16))) {
      console.log(item);
      return item;
    }
    const y = parseInt(item, 16);
    return `&#x${((y - b) / k).toString(16)};`;
  });
  // 3. 将数组转换成字符串
  return result.join('');
};

export const cacheToken = (token, categoryName) => {
  // 将token缓存到localStorage
  const cacheTokenList = JSON.parse(window.localStorage.getItem('tokenList') || '[]');
  const cacheIndex = cacheTokenList.findIndex((item) => item.name === categoryName);
  if (cacheIndex > -1) {
    cacheTokenList[cacheIndex].token = token;
  } else {
    cacheTokenList.push({
      name: categoryName,
      token,
    });
  }
  window.localStorage.setItem('tokenList', JSON.stringify(cacheTokenList));
};

export default {
  decryptNumRule1,
  decryptNumRule2,
  cacheToken,
};