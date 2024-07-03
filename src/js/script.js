// search.



const search = document.querySelector('.search-open-btn');
const removeSearch = document.querySelector('.search-remove');

const tl = gsap.timeline({ paused: true,  ease: 'circ' });
tl.fromTo('.search-open-btn', { display: 'block', opacity: 1 }, { display: 'none', duration: .3, opacity: 0, })
  .to('.search__input', { duration: 0.1,  display: 'block', opacity: 1,})
  .to('.search__btn', { duration: 0.2,  display: 'block'  })
  .to('.search-remove', { duration: 0.2,  display: 'block' },'-=.2')


search.onclick = function () {
  tl.play();
}
removeSearch.onclick = function () {
  tl.reverse()
};



// burger-menu.

let menu = document.querySelector('.header__nav');
let btnRemove = document.querySelector('#menu-close');
let menuLinks = menu.querySelectorAll('.nav__link');


(function () {
  const burger = document.querySelector('.burger');
  burger.addEventListener('click', () => {
    burger.classList.add('burger--active');
    menu.classList.add('header__nav--active');
    document.body.classList.add('stop-scroll');
  })
  const btnRemove = document.querySelector('.btn-remove');
  btnRemove.addEventListener('click', () => {
    btnRemove.classList.remove('burger--active');
    menu.classList.remove('header__nav--active');
    document.body.classList.remove('stop-scroll');
  })
})();


// MAP

ymaps.ready(init);
function init() {
  let myMap = new ymaps.Map("map", {
    center: [55.76893, 37.636350],
    zoom: 17,
    controls: [],
  });

  var myPlacemark = new ymaps.Placemark([55.76953, 37.63849], {}, {
    iconLayout: 'default#image',
    iconImageHref: 'image/map-mark.svg',
    iconImageSize: [12, 12],
  });

  myMap.geoObjects.add(myPlacemark);

  myPlacemark.events.add('click', function (e) {
    let adress = document.querySelector('.contacts-adress')
    adress.classList.remove('contacts-adress--close');
    e.stopPropagation();

    const btnRemove = document.querySelector('.adress-remove');
    btnRemove.addEventListener('click', () => {
      adress.classList.add('contacts-adress--close');
    })
  });

}

// validate
new window.JustValidate('.connect-form', {
  colorWrong: '#ff6666',
  rules: {
    email: {
      required: true,
      email: true
    },
  },
  messages: {
    email: {
      required: "Недопустимый формат"
    },
  }
});



new window.JustValidate('.contacts__form', {
  colorWrong: '#ff3030',
  rules: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 30,
    },

    email: {
      required: true,
      email: true
    },

  },
  messages: {
    name: {
      required: "Недопустимый формат"
    },
    email: {
      required: "Недопустимый формат"
    },
  }
});

