// Fills the page from config.js and runs the effects
(function () {
	var S = window.SITE;
	function $(id) { return document.getElementById(id); }
	function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
	function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
	var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

	// ---------- content ----------
	document.documentElement.style.setProperty('--acc', S.accent);
	document.title = S.name + ' | ' + S.tagline;
	each('[data-bind]', function (el) { el.textContent = S[el.getAttribute('data-bind')] || ''; });
	each('[data-href]', function (el) { el.href = S[el.getAttribute('data-href')] || '#'; });
	each('[data-icon]', function (el) { el.innerHTML = ICONS[el.getAttribute('data-icon')] || ''; });
	each('[data-connect]', function (el) { el.href = 'steam://connect/' + S.ip; });
	$('ip').textContent = S.ip;
	$('year').textContent = new Date().getFullYear();

	$('factions').innerHTML = S.factions.map(function (f) {
		return '<div class="f rv"><div class="i">' + (ICONS[f.icon] || '') + '</div><div><h3>' + esc(f.name) + '</h3><p>' + esc(f.text) + '</p></div></div>';
	}).join('');

	// title: letters rise one by one, last word gets the accent color
	var words = S.name.split(' '), html = '', k = 0;
	words.forEach(function (w, wi) {
		var cls = wi === words.length - 1 && words.length > 1 ? 'ch acc' : 'ch';
		w.split('').forEach(function (c) { html += '<span class="' + cls + '" style="animation-delay:' + (0.25 + k++ * 0.05) + 's">' + esc(c) + '</span>'; });
		if (wi < words.length - 1) html += ' ';
	});
	$('title').innerHTML = html;

	// tagline typing
	var tg = S.tagline, ti = 0;
	(function type() { $('typed').textContent = tg.slice(0, ++ti); if (ti < tg.length) setTimeout(type, 45); })();

	// reveal
	each('.rv', function (el, i) { setTimeout(function () { el.classList.add('in'); }, 500 + i * 110); });

	// ---------- server status ----------
	function countTo(el, to) {
		var from = +el.textContent || 0, t0 = performance.now();
		(function step(t) {
			var p = Math.min(1, (t - t0) / 1200);
			el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
			if (p < 1) requestAnimationFrame(step);
		})(t0);
	}
	function show(st) {
		$('dot').className = st ? 'dot' : 'dot off';
		$('state').textContent = st ? 'Online' : 'Offline';
		countTo($('on'), st ? st.online : 0);
		$('max').textContent = st ? st.max : 0;
		$('map').textContent = st ? st.map : '';
		$('bar').style.width = st && st.max ? (st.online / st.max * 100) + '%' : '0';
	}
	function update() {
		if (!S.statusUrl) {
			var d = S.demoStatus, j = Math.round((Math.random() - .5) * 4);
			return show({ online: Math.max(0, d.online + j), max: d.max, map: d.map });
		}
		fetch(S.statusUrl).then(function (r) { return r.json(); }).then(show).catch(function () { show(null); });
	}
	setTimeout(update, 700);
	setInterval(update, 30000);

	// clock
	function pad(n) { return (n < 10 ? '0' : '') + n; }
	setInterval(function () { var d = new Date(); $('clock').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }, 1000);

	// ticker (repeats tips so the line is long enough)
	var msgs = (S.loading && S.loading.tips) || [];
	$('ticker').textContent = msgs.concat(msgs).map(function (m) { return '◆ ' + m; }).join('     ');

	// copy IP
	$('ip').onclick = function () {
		navigator.clipboard.writeText(S.ip).then(function () {
			var t = $('toast');
			t.textContent = 'Copied ' + S.ip;
			t.classList.add('on');
			setTimeout(function () { t.classList.remove('on'); }, 1600);
		});
	};

	if (still) return;

	// ---------- spotlight on faction cards ----------
	each('.f', function (el) {
		el.addEventListener('mousemove', function (e) {
			var r = el.getBoundingClientRect();
			el.style.setProperty('--x', (e.clientX - r.left) + 'px');
			el.style.setProperty('--y', (e.clientY - r.top) + 'px');
		});
	});

	// ---------- tilt on server card ----------
	var card = document.querySelector('.tilt');
	card.addEventListener('mousemove', function (e) {
		var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
		card.style.transform = 'perspective(700px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
	});
	card.addEventListener('mouseleave', function () { card.style.transform = ''; });

	// ---------- parallax ----------
	var sky = $('sky'), city = $('city');
	addEventListener('mousemove', function (e) {
		var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
		sky.style.transform = 'translate(' + (x * -10) + 'px,' + (y * -6) + 'px)';
		city.style.transform = 'translate(' + (x * -22) + 'px,' + (y * -10) + 'px)';
	});

	// ---------- floating dust / ash ----------
	var cv = $('dust'), ctx = cv.getContext('2d'), parts = [], W, H;
	function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
	size(); addEventListener('resize', size);
	for (var i = 0; i < 70; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .3, vx: Math.random() * .3 - .1, vy: -(Math.random() * .25 + .05), a: Math.random() * .5 + .1 });
	var acc = S.accent;
	(function draw() {
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = acc;
		parts.forEach(function (p) {
			p.x += p.vx; p.y += p.vy;
			if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
			if (p.x > W + 5) p.x = -5;
			ctx.globalAlpha = p.a;
			ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
		});
		requestAnimationFrame(draw);
	})();
})();
