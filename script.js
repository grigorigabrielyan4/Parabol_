/* ----------------- Read More Button ----------------- */
document.getElementById('readMore').addEventListener('click', () => {
  window.open('https://en.wikipedia.org/wiki/Parabolic_antenna', '_blank', 'noopener');
});

/* ----------------- Quiz ----------------- */
document.getElementById('ansCorrect').addEventListener('click', () => {
  const result = document.getElementById('quizResult');
  result.textContent = '✅ Ճիշտ է — ընդունիչը տեղադրվում է ֆոկուսում։';
  result.style.color = '#4ade80';
});
document.getElementById('ansWrong').addEventListener('click', () => {
  const result = document.getElementById('quizResult');
  result.textContent = '❌ Սխալ. Փորձիր կրկին։';
  result.style.color = '#fb7185';
});

/* ----------------- Feedback (fetch to Node.js backend) ----------------- */
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('fbName').value || 'Anonymous';
  const msg = document.getElementById('fbMessage').value.trim();

  if (!msg) {
    alert('Խնդրում ենք գրել հաղորդագրություն։');
    return;
  }

  try {
    const res = await fetch('/feedback', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, message: msg})
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('fbStatus').textContent = 'Ուղարկված է հաջողությամբ ✅';
      document.getElementById('feedbackForm').reset();
    } else {
      document.getElementById('fbStatus').textContent = 'Սխալ տեղի ունեցավ ❌';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('fbStatus').textContent = 'Սխալ տեղի ունեցավ ❌';
  }
});

/* ----------------- Canvas Parabola Animation ----------------- */
(function() {
  const canvas = document.getElementById('parabolaCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const focus = { x: W*0.65, y: H*0.32 };
  let raysOn = true;
  const rays = [];

  // Create initial rays
  function spawnRay() {
    rays.push({
      x: Math.random()*W*0.9,
      y: -10,
      vx: 0,
      vy: 1 + Math.random()*1.5,
      reflected: false
    });
  }

  for (let i = 0; i < 10; i++) spawnRay();

  document.getElementById('toggleRays').addEventListener('click', () => {
    raysOn = !raysOn;
  });

  function parabolaY(x) {
    const a = 0.0012;
    const x0 = W*0.2;
    const xt = x - x0;
    return a*xt*xt + H*0.55;
  }

  function update() {
    ctx.clearRect(0, 0, W, H);

    // Draw parabola
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#60a5fa';
    for (let x = 0; x <= W; x++) {
      const y = parabolaY(x);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw focus
    ctx.beginPath();
    ctx.fillStyle = '#facc15';
    ctx.arc(focus.x, focus.y, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.font = '13px Inter';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Ֆոկուս (F)', focus.x + 10, focus.y + 5);

    // Update rays
    for (let i = rays.length - 1; i >= 0; i--) {
      const r = rays[i];
      r.x += r.vx;
      r.y += r.vy;

      const py = parabolaY(r.x);
      if (!r.reflected && r.y >= py) {
        r.reflected = true;
        const dx = focus.x - r.x;
        const dy = focus.y - r.y;
        const len = Math.hypot(dx, dy) || 1;
        r.vx = dx / len * 2;
        r.vy = dy / len * 2;
      }

      ctx.beginPath();
      ctx.strokeStyle = r.reflected ? 'rgba(250,204,21,0.9)' : 'rgba(96,165,250,0.9)';
      ctx.lineWidth = r.reflected ? 2.6 : 1.8;
      ctx.moveTo(r.x - r.vx*2, r.y - r.vy*2);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();

      if (Math.hypot(r.x - focus.x, r.y - focus.y) < 6) rays.splice(i, 1);
    }

    if (raysOn && rays.length < 30 && Math.random() < 0.04) spawnRay();

    requestAnimationFrame(update);
  }

  update();
})();