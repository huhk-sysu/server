let express = require('express')
let axios = require('axios')
let router = express.Router()

// 为狗逼韩文转换编码
function turn (str) {
  str = str.replace(/&amp;/g, '&')
  return str.replace(/&#\d+;/g, (value) => {
    value = value.substring(2, value.length - 1)
    return unescape('%u' + Number(value).toString(16))
  })
}

// /songs?keyword=周杰伦&page=2&num=5
router.get('/', function (req, res, next) {
  let {keyword, page, num} = req.query
  axios.get(`http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=${num}&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=${page}&catZhida=0&remoteplace=sizer.newclient.next_song&w=${encodeURI(keyword)}`)
  .then(function (response) {
    let songs = response.data.data.song.list
    let result = songs.map((song) => {
      if (song.albumName_hilight.length === 0) {
        let {f} = song
        return {
          id: f.substring(0, f.indexOf('@@')),
          title: song.fsong,
          singer: song.fsinger.length !== 0 ? song.fsinger : '未知歌手',
          album: ''
        }
      } else {
        let {f} = song
        f = turn(f).split('|')
        return {
          id: f[0],
          title: f[1],
          singer: f[3].length !== 0 ? f[3] : '未知歌手',
          album: f[5]
        }
      }
    })
    res.send({result, finish: result.length <= 4})
  })
  .catch(function (error) {
    console.log(error)
    res.sendStatus(500)
  })
})

module.exports = router
