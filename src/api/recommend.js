import jsonp from '../common/js/jsonp';
import {commonParams, options} from '../api/config';
import axios from 'axios';

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
}

export function getDissList(opts) {
  const url = '/api/getDissList';

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000, // 歌单类型
    picmid: 1,
    rnd: Math.random(),
    format: 'json'
  }, opts);

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}
