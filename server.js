var bodyParser = require('body-parser')
const express = require('express')
const app = express()


app.use('/public', express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const API_KEY = 'bffafdd3'
const GetTopRowMoviesURL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=spider&type=movie`
const GetShowsUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&s=show&type=series`


app.get('/', async (req, res)=>{
  try{
    let responses = await fetch(GetTopRowMoviesURL)
    let dataInJson = await responses.json()
    let dataWithMore = await Promise.all(dataInJson.Search.map(async(x,i)=>{
      let moreInfo = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${x.imdbID}`)
      let moreInfoInJson = await moreInfo.json()
      return x = {
        Title: x.Title,
        Year: x.Year,
        imdbID: x.imdbID,
        Type: x.Type,
        Poster: x.Poster,
        Rank: i+1,
        MoreInfo: moreInfoInJson
      }
    }))
    let shows = await fetch(GetShowsUrl)
    let showsInJson = await shows.json()
    let showsWithMore = await Promise.all(
      showsInJson.Search.map(async(x,i)=>{
        let moreInfo = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${x.imdbID}`)
        let moreInfoInJson = await moreInfo.json()
        return x = {
          Title: x.Title,
          Year: x.Year,
          imdbID: x.imdbID,
          Type: x.Type,
          Poster: x.Poster,
          Rank: i+1,
          MoreInfo: moreInfoInJson
        }
      })
    )


    res.render('index.ejs', {
      movies: dataWithMore,
      shows: showsWithMore
    })
  }catch(err){
    console.log(err)
  }
})
app.post('/getInfo', async (req, res)=>{
  let reqBodyImdbId = req.body.imdbID
  let getSpecificItem = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${reqBodyImdbId}`)
  let getSpecificItemInJson = await getSpecificItem.json()
  res.json({itemInfo: getSpecificItemInJson})
})
app.post('/search',async (req, res)=>{
  let reqString = req.body.input
  let getSpecificItemMovie = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${reqString}&type=movie`)
  let getSpecificItemInJsonMovie = await getSpecificItemMovie.json()
  let getSpecificItemShow = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${reqString}&type=series`)
  let getSpecificItemInJsonShow = await getSpecificItemShow.json()
  let show = getSpecificItemInJsonShow.Search || []
  let movie = getSpecificItemInJsonMovie.Search || []
  let showsAndMovies = [...show, ...movie]

  res.json({msg: showsAndMovies})
})




const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in PORT: ${PORT}`))