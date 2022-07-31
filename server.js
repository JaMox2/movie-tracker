const express = require('express')
const app = express()


app.use('/public', express.static('public'))
app.set('view engine', 'ejs')

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
  // res.render('index.ejs', {movies: placeHolderItems})
})
app.get('/getInfo', (req, res)=>{
  console.log('getting into server')
  res.json({msg:'hello'})
})





const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in PORT: ${PORT}`))