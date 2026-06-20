// ---  ELEMENT SELECTORS ---
var slides = document.querySelectorAll(".slide");
var buttons = document.querySelectorAll(".slider-btn");
var track = document.querySelector(".slider-track");
var sliderContainer = document.querySelector('.image-slider');

let currentSlide = 0; 
const totalSlides = slides.length;
let startX = 0;
let isDragging = false;
let autoSlideTimer; // Variable to manage and reset the timer cleanly

// ---  CORE MOVING ENGINE ---
var manualNav = function (manual) {
    currentSlide = manual;

    // Shift the track horizontally based on the current slide index
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Update active state on navigation bars
    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });
    if (buttons[manual]) {
        buttons[manual].classList.add("active");
    }
    
    //  RESET TIMER: If a user clicks or swipes, reset the 5s timer 
    // so it doesn't instantly jump right after they interacted with it.
    resetAutoSlide();
}

// ---  BUTTON CLICK SENSORS ---
buttons.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
        manualNav(i);
    });
});

// ---  HAND SWIPE & PC DRAG LOGIC ---

// 1. Record touch/click start point
sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    sliderContainer.style.cursor = 'grabbing';
});

sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
}, { passive: true });

// 2. Track lift-off and execute transition
window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    sliderContainer.style.cursor = 'grab';
    
    const endX = e.pageX;
    handleSwipeLogic(startX, endX);
});

sliderContainer.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].screenX;
    handleSwipeLogic(startX, endX);
}, { passive: true });

// 3. Translate drag directions into actual track movements
function handleSwipeLogic(start, end) {
    const threshold = 50; // Minimum drag required in pixels
    
    if (start - end > threshold) {
        // Dragged Left -> Move to Next Slide
        let next = currentSlide + 1;
        if (next >= totalSlides) next = 0;
        manualNav(next);
    } else if (end - start > threshold) {
        // Dragged Right -> Move to Previous Slide
        let prev = currentSlide - 1;
        if (prev < 0) prev = totalSlides - 1;
        manualNav(prev);
    }
}

// ---  AUTOMATIC TIMER MANAGEMENT ---
function startAutoSlide() {
    autoSlideTimer = setTimeout(function () {
        currentSlide++;
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }
        manualNav(currentSlide);
        startAutoSlide(); // Loop the timer
    }, 10000);
}

function resetAutoSlide() {
    clearTimeout(autoSlideTimer);
    startAutoSlide();
}

// Fire up the carousel loop on page load
startAutoSlide();

// zoom logic
document.addEventListener("DOMContentLoaded", () => {
    
    const lightbox = document.createElement("div");
    lightbox.innerHTML = `
        <span style="position:absolute; top:20px; right:35px; color:#fff; font-size:40px; cursor:pointer; user-select:none;">&times;</span>
        <img style="max-width:85%; max-height:85%; object-fit:contain; border-radius:8px;" alt="Zoomed">
    `;

   
    Object.assign(lightbox.style, {
        display: "none",
        position: "fixed",
        zIndex: "9999",
        left: "0", top: "0", width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center", alignItems: "center"
    });

    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector("img");

    
    document.querySelector(".popular").addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && e.target.closest(".cic") && e.target.src.trim() !== "") {
            lightbox.style.display = "flex";
            lightboxImg.src = e.target.src;
        }
    });

   
    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });
});