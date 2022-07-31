let showMenuButton = document.querySelector('.showMenuBtn')
let menuUi = document.querySelector('.displayMenu')
let isMenuShowing = false



var swiper = new Swiper(".mySwiper", {
  slidesPerView: 6,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
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

let readMoreButton = document.querySelectorAll('.readMore')
readMoreButton.forEach((x,i)=>{
  x.addEventListener('click', async(e)=>{
    console.log('click', i+1)
    let response = await fetch('/getInfo', {method: 'GET', headers: {'Content-type': 'application/json; charset=UTF-8'}});
    let dataInJson = await response.json()
    menuUi.style.display = 'grid'
  })
})


showMenuButton.addEventListener('click', ()=>{
  if(isMenuShowing == false){
    // menuUi.style.
    menuUi.style.display = 'none'
  }else{
    menuUi.style.display = 'grid'
  }
})