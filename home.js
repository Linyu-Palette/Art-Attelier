const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.outfit-card');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const totalCards = cards.length;
const angleStep = 360 / totalCards; // 40 degrees of separation for 9 cards
let currentRotation = 0; 
let isAutoplayPaused = false;
const autoplaySpeed = 0.05;

//  THE RADIUS CONTROL
// Distance from the center point of the 3D ring out to the cards.
// Increase this number if you want larger gaps between your cards!
const radius = 270; 

// --- 1. SETUP THE GEOMETRICAL CYLINDER (RUNS ONCE) ---
function setup3DCylinder() {
  cards.forEach((card, index) => {
    const cardAngle = index * angleStep;
    
    // Each card is rotated along the Y-axis and pushed OUT into 3D depth space.
    // Notice we DO NOT invert the rotation. This keeps them facing outward like a carousel ring.
    card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
  });
  updateFocusStates();
}

// --- 2. MANAGE INTERACTIVITY LIMITS BASED ON POSITION ---
function updateFocusStates() {
  // Normalize the main track rotation to know what angle is facing the screen front
  const activeGlobalAngle = currentRotation % 360;

  cards.forEach((card, index) => {
    const originalCardAngle = index * angleStep;
    let relativeAngle = (originalCardAngle + activeGlobalAngle) % 360;
    
    // Wrap tracking boundaries safely between -180 and 180 degrees
    if (relativeAngle > 180) relativeAngle -= 360;
    if (relativeAngle < -180) relativeAngle += 360;

    // Only unlock click interactions for the card pointing directly at the user's face
    if (Math.abs(relativeAngle) < 20) {
      card.classList.add('active-focus');
      card.style.pointerEvents = 'auto'; 
    } else {
      card.classList.remove('active-focus');
      card.style.pointerEvents = 'none'; // Background cards can't steal click triggers
      card.querySelector('.card-inner').classList.remove('is-flipped'); // Clean resets
    }
  });
}

// --- 3. SPIN MATRIX OPERATOR ---
function rotateTrack(dragAngleOffset = 0) {
  const finalAngle = currentRotation + dragAngleOffset;
  track.style.transform = `rotateY(${finalAngle}deg)`;
}

// --- TRANSITION ANIMATION TIMINGS CONTROLLER ---
function setTrackTransition(value) {
  track.style.transition = value;
}

function rotateNext() {
  setTrackTransition('transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)');
  currentRotation -= angleStep;
  rotateTrack();
  updateFocusStates();
}

function rotatePrev() {
  setTrackTransition('transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)');
  currentRotation += angleStep;
  rotateTrack();
  updateFocusStates();
}

nextBtn.addEventListener('click', rotateNext);
prevBtn.addEventListener('click', rotatePrev);

// MANUAL FLIP CLICK TRIGGER (Front spotlight card only)
cards.forEach((card) => {
  const inner = card.querySelector('.card-inner');
  card.addEventListener('click', () => {
    if (card.classList.contains('active-focus')) {
      inner.classList.toggle('is-flipped');
    }
  });
});

// --- ULTRA-SMOOTH MOUSE/TOUCH DRAG SUBSYSTEM ---
let isDragging = false;
let startX = 0;
let currentDeltaX = 0;

function startDrag(e) {
  if (e.target.closest('.carousel-btn')) return;

  isDragging = true;
  startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  currentDeltaX = 0;

  setTrackTransition('none'); // Instantly link cylinder rotation to your dragging finger
}

function dragging(e) {
  if (!isDragging) return;
  if (e.type === 'touchmove') e.preventDefault();

  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  currentDeltaX = clientX - startX;

  // Converts pixel shifts into micro angular changes
  const dragAngleOffset = currentDeltaX * 0.15; 
  rotateTrack(dragAngleOffset);
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;

  setTrackTransition('transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)');

  const swipeThreshold = 50; 

  if (currentDeltaX < -swipeThreshold) {
    currentRotation -= angleStep;
  } else if (currentDeltaX > swipeThreshold) {
    currentRotation += angleStep;
  }

  rotateTrack(); 
  updateFocusStates();
}

const stage = document.querySelector('.carousel-stage');
stage.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', dragging);
window.addEventListener('mouseup', endDrag);

stage.addEventListener('touchstart', startDrag, { passive: false });
stage.addEventListener('touchmove', dragging, { passive: false });
window.addEventListener('touchend', endDrag);



// Build and lock layout ring geometry map
setup3DCylinder();



