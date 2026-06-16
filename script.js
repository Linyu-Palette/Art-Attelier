var btnSubmit = document.querySelector('.submit');
var modal = document.querySelector('.modal-container');

if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {
        modal.classList.add('show');
        
        const next = document.querySelector('.next');
        next.setAttribute('value', ' ');
    });
}
let lastScrollY = window.scrollY;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
  // If the user scrolls to the very top, always make sure the header is visible
  if (window.scrollY <= 0) {
    header.classList.remove('nav-hidden');
    return;
  }

  if (window.scrollY > lastScrollY) {
    // ⬇️ Scrolling Down -> Add class to hide header
    header.classList.add('nav-hidden');
  } else {
    // ⬆️ Scrolling Up -> Remove class to reveal header
    header.classList.remove('nav-hidden');
  }

  // Update position tracker
  lastScrollY = window.scrollY;
});


AOS.init();