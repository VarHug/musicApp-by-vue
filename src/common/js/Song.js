import {ERR_OK} from '@/api/config.js';
import {getSongsUrl, getLyric} from '@/api/song';
import { Promise } from 'core-js';
import {Base64} from 'js-base64';

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error('no lyric'));
        }
      });
    });
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  });
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0);
  // 氪金验证：!musicData.pay || musicData.pay.payalbumprice === 0
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then((res) => {
    songs = songs.filter((song) => {
      let purl = res[song.mid];
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl;
        return true;
      }
      return false;
    });
    // if (res.code === ERR_OK) {
    //   let midUrlInfo = res.url_mid.data.midurlinfo;
    //   midUrlInfo.forEach((info, index) => {
    //     let song = songs[index];
    //     // song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`;
    //     song.url = `${info.purl}`;
    //   });
    // }
    return songs;
  });
}

/**
 * 将歌手信息格式化，只取歌手姓名，并且将多个歌手姓名用/分开
 * @param {[{id:0,mid:'',name:''}]} singer
 * @returns {string}
 */
function filterSinger(singer) {
  if (!singer) {
    return '';
  }
  let singerName = [];
  singer.forEach(item => {
    singerName.push(item.name);
  });
  return singerName.join('/');
}

/**
 * 从电台列表中抽取出所需要格式的MusicData
 * @param {Object} listItem
 */
export function getRadioMusicData(listItem) {
  let musicData = {};

  musicData.songid = listItem.id;
  musicData.songmid = listItem.mid;
  musicData.singer = listItem.singer;
  musicData.songname = listItem.name;
  musicData.albumname = listItem.album.name;
  musicData.interval = listItem.interval;
  musicData.albummid = listItem.album.mid;
  musicData.url = '';

  return musicData;
}
