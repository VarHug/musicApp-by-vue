export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
};

export const options = {
  param: 'jsonpCallback'
};

export function setOptions(opts) {
  return Object.assign(options, opts);
}

export const ERR_OK = 0;

/**
* 获取16位随机数
* @returns {string}
*/
export function getRadnom16() {
 let num = '';
 for (let i = 0; i < 16; i++) {
   num += Math.random() * 10 | 0;
 }
 return num;
}
