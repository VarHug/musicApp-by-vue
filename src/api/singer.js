import jsonp from '../common/js/jsonp';
import {commonParams, setOptions} from '../api/config';

/**
 * 获取16位随机数
 * @returns {string}
 */
function getRadnom16() {
  let num = '';
  for (let i = 0; i < 16; i++) {
    num += Math.random() * 10 | 0;
  }
  return num;
}

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });

  return jsonp(url, data, setOptions({
    name: 'getSingerList'
  }));
}

export function getSingerListNew() {
  let num = getRadnom16();
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: '{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}', // sin起始歌手index,cur_page当前页
    callback: `getUCGI${num}`
  });

  return jsonp(url, data, setOptions({
    name: `getUCGI${num}`
  }));
}
