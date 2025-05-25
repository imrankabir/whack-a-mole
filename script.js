let score = 0;
let timeLeft = 30;
let currentHole = null;
let gameInterval;
let moleSpeed = 1000;

const get = (k, d) => JSON.parse(localStorage.getItem(`whack-a-mole-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`whack-a-mole-${k}`, JSON.stringify(v));

const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const holes = document.querySelectorAll('.hole');
const hitSound = document.getElementById('hitSound');
const scoreboardList = document.getElementById('scoreboard'); // NEW

function randomHole() {
  return Math.floor(Math.random() * holes.length);
}

function showMole() {
  if (currentHole !== null) {
    holes[currentHole].classList.remove('show');
  }

  const index = randomHole();
  currentHole = index;
  holes[index].classList.add('show');

  setTimeout(() => {
    holes[index].classList.remove('show');
  }, moleSpeed * 0.75);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  moleSpeed = 1000;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    showMole();
    if (timeLeft % 5 === 0 && moleSpeed > 400) {
      moleSpeed -= 100;
    }
  }, moleSpeed);

  const timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(gameInterval);
      holes.forEach(h => h.classList.remove('show'));

      const name = get('name', { name: 'Player' }).name;
      let data = get('scores', { scores: [] });
      data.scores.push({ name, score });
      data.scores.sort((a, b) => b.score - a.score);
      set('scores', data);

      alert(`Game over! ${name}, your score: ${score}`);
      renderScoreboard();
    }
  }, 1000);
}

holes.forEach((hole) => {
  hole.addEventListener('click', () => {
    if (hole.classList.contains('show')) {
      score++;
      scoreDisplay.textContent = score;
      hitSound.play();
      hole.classList.remove('show');
    }
  });
});

const showName = () => {
  document.querySelector('#name').textContent = get('name', { name: 'Player' }).name;
};

document.querySelector('#name').addEventListener('focus', (e) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(e.target);
  selection.removeAllRanges();
  selection.addRange(range);
});

document.querySelector('#name').addEventListener('keyup', (e) => {
  set('name', { name: e.target.textContent });
});

function renderScoreboard() {
  const { scores } = get('scores', { scores: [] });
  scoreboardList.innerHTML = '';
  scores.slice(0, 5).forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} — ${entry.score}`;
    scoreboardList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  showName();
  renderScoreboard();
});
