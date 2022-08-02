let showMenuButton = document.querySelector('.showMenuBtn')
let menuUi = document.querySelector('.displayMenu')
let mainBody = document.querySelector('body')



var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {

    490: {
        slidesPerView: 2,
        spaceBetween: 25
      },
  
    700: {
        slidesPerView: 3,
        spaceBetween: 15
      },
    // when window width is >= 440px
    1025: {
      slidesPerView: 4,
      spaceBetween: 15
    },
    // when window width is >= 660px
    1300: {
      slidesPerView: 5,
      spaceBetween: 15
    },
    // when window width is >= 100px
    1600: {
      slidesPerView: 6,
      spaceBetween: 15
    }
  }

})

var swiper = new Swiper(".headerSwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 4500, //2500 - 4500
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
})

function loadSearchedItem(items){
  let showSearchedItems = document.querySelector('.showSearchedItems')
  showSearchedItems.innerHTML = ''
  items.forEach((x,i)=>{
    let ssItemsCard = document.createElement('div')
    // let img = document.createElement('img')
    let ssItemsCardText = document.createElement('div')
    let h6 = document.createElement('h6')
    let span = document.createElement('span')

    ssItemsCard.classList.add('ssItemsCard') // CARD
    ssItemsCard.classList.add('readMore')
    ssItemsCard.classList.add(`${x.imdbID}`)
    ssItemsCard.addEventListener('click', async (e)=>{
      console.log('clicked', i+1)
      let response = await fetch('/getInfo', {method: 'POST', body: JSON.stringify({
        imdbID: e.currentTarget.classList[e.currentTarget.classList.length - 1],
      }), headers: {'Content-type': 'application/json; charset=UTF-8'}});
      let dataInJson = await response.json()
      displayCurrentMovie(dataInJson.itemInfo, true)
      menuUi.style.display = 'grid'
      mainBody.style.overflow = 'hidden'
    })
      if(x.Poster != "N/A"){
        let img = document.createElement('img')
        img.src = `${x.Poster}`
        img.alt = `${x.Title}`
        ssItemsCard.appendChild(img)
      }
      // 
      ssItemsCardText.classList.add('ssItemsCardText')
        h6.innerText = `${x.Title}`
        ssItemsCardText.appendChild(h6)
        span.innerText = `${x.Year}`
        ssItemsCardText.appendChild(span)
      ssItemsCard.appendChild(ssItemsCardText)
    showSearchedItems.appendChild(ssItemsCard)
  })
}

function displayCurrentMovie(item, isShow){
  let imageText = document.querySelector('.imageText')
  let titleText = document.querySelector('.titleText')
  let releasedText = document.querySelector('.releasedText')
  let ratedText = document.querySelector('.ratedText')
  let genreText = document.querySelector('.genreText')
  let directionText = document.querySelector('.directionText')
  let ratingText = document.querySelector('.ratingText')
  let plotText = document.querySelector('.plotText')
  if(isShow){
    imageText.src = `${item.Poster}`
    titleText.textContent = `${item.Title}`
    releasedText.textContent = `${item.Released}`
    ratedText.textContent = `${item.Rated}`
    genreText.textContent = `${item.Genre}`
    directionText.textContent = `${item.Director}`
    ratingText.textContent = `${item.Ratings[0].Value}`
    plotText.textContent = `${item.Plot}`
  }else{
    imageText.src = ``
    titleText.textContent = ``
    releasedText.textContent = ``
    ratedText.textContent = ``
    genreText.textContent = ``
    directionText.textContent = ``
    ratingText.textContent = ``
    plotText.textContent = ``
  }

}

let readMoreButton = document.querySelectorAll('.readMore')
readMoreButton.forEach((x,i)=>{
  x.addEventListener('click', async(e)=>{
    let response = await fetch('/getInfo', {method: 'POST', body: JSON.stringify({
      imdbID: e.currentTarget.classList[e.currentTarget.classList.length - 1],
    }), headers: {'Content-type': 'application/json; charset=UTF-8'}});
    let dataInJson = await response.json()
    displayCurrentMovie(dataInJson.itemInfo, true)
    menuUi.style.display = 'grid'
    mainBody.style.overflow = 'hidden'
  })
})

let showSearchedItems = document.querySelector('.showSearchedItems')
let searchInput = document.querySelector('.searchInput')

searchInput.addEventListener('input', async (e)=>{
  let searchUi = document.querySelector('.showSearchedItems')
  if(e.currentTarget.value){
    searchUi.style.display = 'flex'
    let response = await fetch('/search', {method: 'POST', body: JSON.stringify({
      input: e.currentTarget.value
    }), headers: {'Content-type': 'application/json; charset=UTF-8'}});
    let dataInJson = await response.json()
    console.log(dataInJson.msg)
    loadSearchedItem(dataInJson.msg)
  }else{
    let showSearchedItems = document.querySelector('.showSearchedItems')
    showSearchedItems.innerHTML = ''
    searchUi.style.display = 'none'

  }
})



showMenuButton.addEventListener('click', ()=>{
  menuUi.style.display = 'none'
  mainBody.style.overflow = 'visible'
  displayCurrentMovie(dataInJson.itemInfo, false)

})