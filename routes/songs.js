let express = require('express')
let axios = require('axios')
let router = express.Router()

// /songs?keyword=周杰伦&page=2
router.get('/', function (req, res, next) {
  console.log(req.query)
  let {keyword, page} = req.query
  let num = 5
  axios.get(`http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=${num}&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=${page}&catZhida=0&remoteplace=sizer.newclient.next_song&w=${encodeURI(keyword)}`)
  .then(function (response) {
    let songs = response.data.data.song.list
    let result = songs.map((song) => {
      let {f} = song
      return {
        id: f.substring(0, f.indexOf('|')),
        name: song.fsong,
        singer: song.fsinger
      }
    })
    res.send(result)
  })
  .catch(function (error) {
    console.log(error)
    res.sendStatus(500)
  })
})

module.exports = router
