import {commonParams} from '../api/config';
import axios from 'axios';

export function getDissTag() {
  const url = '/api/getDissTag';

  const data = Object.assign({}, commonParams, {
    g_tk: 377597455,
    platform: 'yqq',
    hostUin: 0,
    notice: 0,
    needNewCode: 0,
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getDissList(opts) {
  const url = '/api/getDissList';

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sortId: 5, // 5:推荐,2:最新
    needNewCode: 0,
    categoryId: 10000000, // 歌单类型
    picmid: 1,
    rnd: Math.random(),
    format: 'json',
    sin: 0, // 起始index
    ein: 29 // 结束index
  }, opts);

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getDissSongList(disstid) {
  const url = '/api/getCdInfo';

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 377597455
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
