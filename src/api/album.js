import jsonp from '../common/js/jsonp';
import {commonParams, setOptions} from '../api/config';
import axios from 'axios';

export function getAlbumList() {
  const url = '/api/getAlbum';

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: `{"albumlib":{"method":"get_album_by_tags","param":{"area":0,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":20,"click_albumid":0},"module":"music.web_album_library"}}`
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getAlbumInfo(albummid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg';

  const data = Object.assign({}, commonParams, {
    albummid: albummid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, setOptions({
    name: 'albuminfoCallback'
  }));
}
