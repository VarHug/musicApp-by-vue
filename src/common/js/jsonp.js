import originJSONP from 'jsonp';

function formate(data) {
  let url = '';
  for (let key in data) {
    let val = data[key] !== undefined ? data[key] : '';
    url += `&${key}=${encodeURIComponent(val)}`;
  }
  return url ? url.substring(1) : '';
}

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + formate(data);

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
