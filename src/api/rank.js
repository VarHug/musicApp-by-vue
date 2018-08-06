import {commonParams} from '../api/config';
import axios from 'axios';
import { Promise } from 'core-js';

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
