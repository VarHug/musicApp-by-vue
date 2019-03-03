import jsonp from '../common/js/jsonp';
import {commonParams, options} from '../api/config';
import * as http from '../common/js/http';

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
    sortId: 5, // 5:推荐,2:最新
    needNewCode: 0,
    categoryId: 10000000, // 歌单类型
    picmid: 1,
    rnd: Math.random(),
    format: 'json',
    sin: 0, // 起始index
    ein: 29 // 结束index
  }, opts);

  return http.get(url, data);
}
