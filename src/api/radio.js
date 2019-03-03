import jsonp from '../common/js/jsonp';
import {setOptions, getRadnom16, commonParams} from '../api/config';
import * as http from '../common/js/http';

export function getRadioList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg';

  const data = Object.assign({}, commonParams, {
    channel: 'radio',
    page: 'index',
    tpl: 'wk',
    new: '1',
    p: `0.${getRadnom16()}`,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  });

  return jsonp(url, data, setOptions({
    name: `MusicJsonCallback${getRadnom16()}`
  }));
}

export function getRadioSongList(radioId) {
  const url = '/api/getRadioSongList';

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    fromat: 'json',
    data: `{"songlist":{"module":"pf.radiosvr","method":"GetRadiosonglist","param":{"id":${radioId},"firstplay":1,"num":10}},"radiolist":{"module":"pf.radiosvr","method":"GetRadiolist","param":{"ct":"24"}},"comm":{"ct":"24"}}`
  });

  return http.get(url, data);
}
