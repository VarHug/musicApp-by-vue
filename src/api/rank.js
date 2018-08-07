import {commonParams, setOptions} from '../api/config';
import axios from 'axios';
import { Promise } from 'core-js';
import jsonp from '../common/js/jsonp';

export function getTopList() {
  const url = '/api/getTop';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    topid,
    page: 'detail',
    type: 'top',
    tpl: 3,
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return jsonp(url, data, setOptions({
    name: 'getTopMusicList'
  }));
}
