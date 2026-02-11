/*--------------------
Vars (Carousel Logic)
--------------------*/
let progress = 50;
let startX = 0;
let active = 0;
let isDown = false;

/*--------------------
Constants
--------------------*/
const speedWheel = 0.02; // Mouse wheel speed
const speedDrag = -0.1; // Drag speed

/*--------------------
Get Z-Index (3D Effect)
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
  );

/*--------------------
Items & Cursors
--------------------*/
const $items = document.querySelectorAll(".carousel-item");
const $cursors = document.querySelectorAll(".cursor");

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index];
  item.style.setProperty("--zIndex", zIndex);
  item.style.setProperty("--active", (index - active) / $items.length);
};

/*--------------------
Animate Function
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100));
  active = Math.floor((progress / 100) * ($items.length - 1));
  $items.forEach((item, index) => displayItems(item, index, active));
};
animate(); // Initial call

/*--------------------
Click to Center Item
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener("click", () => {
    progress = (i / $items.length) * 100 + 10;
    animate();
  });
});

/*--------------------
Handlers (Carousel Movement)
--------------------*/
const handleWheel = (e) => {
  const wheelProgress = e.deltaY * speedWheel;
  progress = progress + wheelProgress;
  animate();
};

const handleMouseMove = (e) => {
  // 1. Cursor Movement (Visual)
  if (e.type === "mousemove") {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  // 2. Drag Logic (Carousel Rotation)
  if (!isDown) return; // Agar click nahi kiya hai to mat ghumao

  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const mouseProgress = (x - startX) * speedDrag;
  progress = progress + mouseProgress;
  startX = x;
  animate();
};

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
  isDown = false;
};

/*--------------------
Event Listeners (Document Level)
--------------------*/
document.addEventListener("mousewheel", handleWheel);
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchstart", handleMouseDown);
document.addEventListener("touchmove", handleMouseMove);
document.addEventListener("touchend", handleMouseUp);

/* =========================================
   IMPORTANT FIX: STOP CAROUSEL WHEN SLIDING
   ========================================= */
const loveSlider = document.getElementById("loveSlider");

if (loveSlider) {
  // Ye function bolta hai: "Event yahi roko, upar carousel tak mat jane do"
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Slider ke har touch/click event par ye lagayenge
  loveSlider.addEventListener("mousedown", stopPropagation);
  loveSlider.addEventListener("touchstart", stopPropagation);
  loveSlider.addEventListener("mousemove", stopPropagation);
  loveSlider.addEventListener("touchmove", stopPropagation);
}

/* =========================================
   PROPOSAL & ANIMATION LOGIC
   ========================================= */

/* --- 1. SLIDER CHECK --- */
function checkSlider() {
  let slider = document.getElementById("loveSlider");
  let heart = document.querySelector(".slider-heart");
  let val = slider.value;

  // Heart ko slider ke saath move karna
  heart.style.left = `calc(${val}% - 10px)`;

  // Agar 95% se zyada drag kiya -> Trigger Proposal
  if (val > 95) {
    let screen = document.getElementById("proposal-screen");
    screen.style.display = "flex";

    // Thoda wait karke opacity badhana (Fade in effect)
    setTimeout(() => {
      screen.style.opacity = "1";
    }, 50);
  }
}

/* --- 2. SHE SAID YES --- */
function sheSaidYes() {
  // Buttons chupao
  document.querySelector(".content").style.display = "none";

  // Celebration dikhao
  document.getElementById("celebration").style.display = "block";

  // Background Romantic Red karo
  document.getElementById("proposal-screen").style.background =
    "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)";

  // Phool barsao
  createFlowers();
}

/* --- 3. NO BUTTON PRANK --- */
function moveNoButton() {
  const btn = document.querySelector(".no-btn");

  // Screen size ke hisab se random position
  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 100);

  btn.style.position = "absolute";
  btn.style.left = x + "px";
  btn.style.top = y + "px";
}

// Mobile aur PC dono ke liye listener
const noBtn = document.querySelector(".no-btn");
if (noBtn) {
  noBtn.addEventListener("mouseover", moveNoButton); // PC ke liye (Mouse aate hi bhaagega)
  noBtn.addEventListener("touchstart", moveNoButton); // Mobile ke liye (Touch karte hi bhaagega)
}

/* --- 4. FLOWER RAIN ANIMATION --- */
function createFlowers() {
  const flowers = ["🌸", "🌹", "🌺", "💖", "😍", "🦋"];
  const container = document.getElementById("proposal-screen");

  // Pehle bohot saare phool (Burst)
  for (let i = 0; i < 30; i++) {
    spawnFlower(flowers, container);
  }

  // Phir lagatar baarish
  setInterval(() => {
    spawnFlower(flowers, container);
  }, 300);
}

function spawnFlower(flowers, container) {
  let flower = document.createElement("div");
  flower.classList.add("flower");

  // Random Flower pick karo
  flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];

  // Random Position, Speed, Size
  flower.style.left = Math.random() * 100 + "vw";
  flower.style.animationDuration = Math.random() * 3 + 2 + "s";
  flower.style.fontSize = Math.random() * 20 + 20 + "px";

  container.appendChild(flower);

  // Memory bachane ke liye remove karo
  setTimeout(() => {
    flower.remove();
  }, 5000);
}