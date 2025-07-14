// Discord user fetch
fetch('https://discordlookup.mesalytic.moe/v1/user/592490823065534465')
.then(response => response.json())
.then(data => {
  if (data.avatar && data.avatar.link) {
    //document.getElementById('profile-img').src = data.avatar.link;
  }
  if (data.tag) {
    document.getElementById('username').innerText = `@${data.tag}`;
  } else if (data.username && data.discriminator) {
    document.getElementById('username').innerText = `@${data.username}#${data.discriminator}`;
  } else if (data.username) {
    document.getElementById('username').innerText = `@${data.username}`;
  }
})
.catch(error => {
  console.error('Error fetching Discord user:', error);
  document.getElementById('username').innerText = '@Unavailable';
});

// Minesweeper implementation
const grid = document.getElementById('grid');
const resetBtn = document.getElementById('reset-btn');
const rows = 8;
const cols = 8;
const minesCount = 10;
let gridData = [];
let gameOver = false;
let firstClick = true;

function initGrid() {
  grid.innerHTML = '';
  gridData = [];
  gameOver = false;
  firstClick = true;
  for (let r = 0; r < rows; r++) {
    gridData[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', onCellClick);
      cell.addEventListener('contextmenu', onCellRightClick);
      grid.appendChild(cell);
      gridData[r][c] = {
        mine: false,
        revealed: false,
        flagged: false,
        element: cell,
        adjacentMines: 0
      };
    }
  }
}

function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const isExcluded = Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1;
    if (!gridData[r][c].mine && !isExcluded) {
      gridData[r][c].mine = true;
      placed++;
    }
  }
}

function calculateAdjacentMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridData[r][c].mine) {
        gridData[r][c].adjacentMines = -1;
        continue;
      }
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (gridData[nr][nc].mine) count++;
          }
        }
      }
      gridData[r][c].adjacentMines = count;
    }
  }
}

function revealCell(r, c) {
  const cellData = gridData[r][c];
  if (cellData.revealed || cellData.flagged || gameOver) return;

  cellData.revealed = true;
  const el = cellData.element;
  el.classList.add('revealed');

  if (cellData.mine) {
    el.classList.add('mine');
    el.textContent = '💣';
    gameOver = true;
    revealAllMines();
    return;
  }

  if (cellData.adjacentMines > 0) {
    el.textContent = cellData.adjacentMines;
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          revealCell(nr, nc);
        }
      }
    }
  }
  checkWin();
}

function revealAllMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (gridData[r][c].mine) {
        const el = gridData[r][c].element;
        el.classList.add('revealed', 'mine');
        el.textContent = '💣';
      }
    }
  }
}

function toggleFlag(r, c, event) {
  event.preventDefault();
  if (gameOver) return;
  const cellData = gridData[r][c];
  if (cellData.revealed) return;

  cellData.flagged = !cellData.flagged;
  const el = cellData.element;
  el.textContent = cellData.flagged ? '🚩' : '';
  el.classList.toggle('flagged', cellData.flagged);
}

function onCellClick(e) {
  const r = parseInt(this.dataset.row);
  const c = parseInt(this.dataset.col);
  if (firstClick) {
    placeMines(r, c);
    calculateAdjacentMines();
    firstClick = false;
  }
  revealCell(r, c);
}

function onCellRightClick(e) {
  const r = parseInt(this.dataset.row);
  const c = parseInt(this.dataset.col);
  toggleFlag(r, c, e);
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = gridData[r][c];
      if (cell.revealed) revealedCount++;
    }
  }
  if (revealedCount === rows * cols - minesCount) {
    gameOver = true;
    triggerWinAnimation();
  }
}


resetBtn.addEventListener('click', initGrid);
initGrid();

function triggerWinAnimation() {
  grid.classList.add('win-animate');

  // Animate revealed cells
  grid.querySelectorAll('.cell.revealed').forEach(cell => {
    cell.classList.add('cell-win');
  });

  // Optional: Show a win message
  const winMsg = document.createElement('div');
  winMsg.textContent = '🎉 You Win! 🎉';
  winMsg.className = 'win-message';

  const minesweeper = document.querySelector('.minesweeper-section');
  minesweeper.prepend(winMsg);

  setTimeout(() => {
    winMsg.remove();
  }, 4000);
}


window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
});

const bg = document.querySelector('.background-image');

function updateClock() {
  const clock = document.getElementById('clock');
  const londonTime = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London' });
  clock.textContent = londonTime;
}
setInterval(updateClock, 1000);
updateClock();

document.getElementById('suggest-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.getElementById('suggest-input');
  const msg = document.getElementById('suggest-msg');
  const url = input.value.trim();

  if (!url.includes('open.spotify.com/')) {
    msg.textContent = '❌ Please enter a valid Spotify link.';
    return;
  }

  try {
    const payload = {
      content: `🎶 New song suggestion: ${url}`
    };

    await fetch('https://discord.com/api/webhooks/1393176028574384169/80Nky-a-eUcYUIT5Dt4xZMWv5o_MySUJJNnDVXb80Y_B1CgsapIhUMTSCns6mCtMlWrS', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    msg.textContent = '✅ Suggestion sent!';
    input.value = '';
  } catch (error) {
    console.error(error);
    msg.textContent = '⚠️ Failed to send suggestion. Check your adblockers etc.';
  }
});


let lastSecond = -1;

function getLondonTimeParts() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = type => parseInt(parts.find(p => p.type === type)?.value || '0');

  return {
    hours: get('hour'),
    minutes: get('minute'),
    seconds: get('second')
  };
}

function updateAnalogClock() {
  const { hours, minutes, seconds } = getLondonTimeParts();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const secondHand = document.querySelector('.second-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const hourHand = document.querySelector('.hour-hand');

  // Handle second hand wrapping
  if (seconds === 0 && lastSecond === 59) {
    secondHand.style.transition = 'none';
  } else {
    secondHand.style.transition = 'transform 0.5s ease-in-out';
  }

  secondHand.style.transform = `rotate(${secondDeg}deg)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  hourHand.style.transform = `rotate(${hourDeg}deg)`;

  lastSecond = seconds;
}

setInterval(() => {
  updateClock();       // your existing digital clock
  updateAnalogClock(); // new analog clock
}, 1000);

updateClock();
updateAnalogClock();


// canvas

const canvas = document.getElementById('bg-lines');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 60;
const maxDistance = 120;
let mouse = { x: null, y: null };

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * width,
                 y: Math.random() * height,
                 vx: (Math.random() - 0.5) * 0.7,
                 vy: (Math.random() - 0.5) * 0.7
  });
}

document.addEventListener('mousemove', e => {
  const bg = document.querySelector('.background-image');
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  bg.style.transform = `translate(${x}px, ${y}px)`;

  // Update mouse position for canvas particles
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});



function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#00b8ff';

  // Move particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        ctx.strokeStyle = `rgba(0, 184, 255, ${(1 - dist / maxDistance) * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw lines to mouse
  if (mouse.x !== null && mouse.y !== null) {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        ctx.strokeStyle = `rgba(255, 94, 156, ${(1 - dist / maxDistance) * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });
  }

  requestAnimationFrame(animate);
}

animate();


async function fetchRecentTracks() {
  const username = 'EnderChicken';
  const apiKey = '1f5991f343967a680b559134b8e53539';
  const limit = 5; // Now showing top 5

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const tracks = data.recenttracks.track;

    const list = document.getElementById('recent-tracks');
    list.innerHTML = '';

    tracks.forEach(track => {
      const li = document.createElement('li');
      const artist = track.artist['#text'];
      const name = track.name;
      const link = track.url;

      // Get medium or small image, fallback to placeholder
      const image = track.image?.find(img => img.size === 'medium')?.['#text'] || 'https://via.placeholder.com/48x48?text=?';

      li.innerHTML = `
      <img src="${image}" alt="Album cover">
      <a href="${link}" target="_blank">${artist} — ${name}</a>
      `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to fetch Last.fm tracks:', error);
    document.getElementById('recent-tracks').innerHTML = '<li>Could not load tracks.</li>';
  }
}

fetchRecentTracks();
setInterval(fetchRecentTracks, 60000); // optional: refresh every 60 sec
