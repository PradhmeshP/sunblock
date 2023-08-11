//Another contribution to the great Eclipse/Volume circlejerk

var moon = document.getElementById("moon"),
  parc = document.getElementById("perc"),
  audio = document.getElementById("audio"),
  dragging = false,
  radius = 75,
  area = Math.PI * radius * radius,
  offs = [0, 0];

function init() {
  moon.addEventListener("mousedown", selectMoon);
  moon.addEventListener("touchstart", selectMoon);
  document.body.addEventListener("mousemove", moveMoon);
  document.body.addEventListener("touchmove", moveMoon);
  document.body.addEventListener("mouseup", dropMoon);
  document.body.addEventListener("touchend", dropMoon);
  setMoonData(window.innerWidth / 2 + radius * 2.5, window.innerHeight / 2);
  audio.play();
}

function selectMoon(evt) {
  dragging = true;
  var coords = getCoords(evt),
    bcr = moon.getBoundingClientRect();
  offs = [coords[0] - bcr.left - radius, coords[1] - bcr.top - radius];
}

function moveMoon(evt) {
  if (!dragging) return;
  var coords = getCoords(evt);
  setMoonData(coords[0] - offs[0], coords[1] - offs[1]);
}

function setMoonData(x, y) {
  moon.style.left = (x / window.innerWidth) * 100 + "%";
  moon.style.top = (y / window.innerHeight) * 100 + "%";

  var offset = Math.hypot(
      x - window.innerWidth / 2,
      y - window.innerHeight / 2
    ),
    sector = Math.acos(offset / 2 / radius) / Math.PI,
    triangle =
      Math.sqrt(radius * radius - (offset * offset) / 4) * (offset / 2),
    overlap = ((area * sector - triangle) * 2) / area || 0,
    opacity = Math.max(400 - offset, 0) / 1000,
    expOverlap = Math.pow(overlap, 4);

  //Bling bling
  moon.style.boxShadow =
    "inset " +
    (x - window.innerWidth / 2) / 10 +
    "px " +
    (y - window.innerHeight / 2) / 10 +
    "px 50px rgba(255, 255, 119, " +
    opacity +
    ")";
  moon.style.background = "hsl(194, 56%, " + (1 - expOverlap) * 60 + "%)";
  perc.innerHTML = "Volume: " + (overlap * 100).toPrecision(4) + "%";
  document.body.style.background =
    "hsl(" +
    (194 + Math.floor(166 * expOverlap)) +
    ", 66%, " +
    (1 - expOverlap) * 50 +
    "%)";

  //Oh yeah, set the volume, I guess.
  audio.volume = overlap;
}

function dropMoon() {
  dragging = false;
}

function getCoords(evt) {
  return [(evt.touches || [evt])[0].clientX, (evt.touches || [evt])[0].clientY];
}

Math.hypot = function (a, b) {
  return Math.sqrt(a * a + b * b);
};

init();
