//© Zero - Código libre no comercial

console.log('🚀 Script iniciado');

// Cargar el SVG y animar los corazones
fetch('./Img/treelove.svg')
  .then(res => {
    console.log('✅ SVG fetch exitoso');
    return res.text();
  })
  .then(svgText => {
    console.log('✅ SVG texto recibido');
    const container = document.getElementById('tree-container');
    if (!container) {
      console.error('❌ No se encontró tree-container');
      return;
    }
    
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) {
      console.error('❌ No se encontró el SVG dentro del contenedor');
      return;
    }
    console.log('✅ SVG insertado correctamente');

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    console.log('📊 Total de paths encontrados:', allPaths.length);
    
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        console.log('✅ SVG movido y escalado');
        
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 1200);
      }, totalDuration);
    }, 50);

    // Detectar corazones por tamaño y posición
    const heartPaths = allPaths.filter(path => {
      try {
        const box = path.getBBox();
        const isHeart = box.width < 40 && box.height < 40 && box.y < 250;
        if (isHeart) {
          console.log('❤️ Corazón detectado:', {
            width: box.width,
            height: box.height,
            x: box.x,
            y: box.y
          });
        }
        return isHeart;
      } catch (e) {
        console.warn('⚠️ Error al obtener BBox:', e);
        return false;
      }
    });

    console.log('💖 TOTAL CORAZONES DETECTADOS:', heartPaths.length);

    if (heartPaths.length === 0) {
      console.error('❌ NO SE DETECTARON CORAZONES - La animación no funcionará');
      console.log('💡 Intentando detectar por color...');
      
      // Método alternativo: detectar por color
      const heartsByColor = allPaths.filter(path => {
        const fill = window.getComputedStyle(path).fill;
        const isFilled = path.getAttribute('fill');
        console.log('Path fill:', fill, isFilled);
        return fill.includes('rgb') || (isFilled && isFilled !== 'none');
      });
      
      console.log('🎨 Paths con color:', heartsByColor.length);
      
      if (heartsByColor.length > 0) {
        console.log('✅ Usando detección por color');
        heartsByColor.forEach(path => path.classList.add('animated-heart'));
        setTimeout(() => {
          console.log('🚀 Iniciando caída de corazones (método alternativo)...');
          startFallingHearts(heartsByColor, svg);
        }, 5000);
        return;
      }
    }

    // Animar latido de corazones
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });

    // Iniciar caída de corazones como hojas
    setTimeout(() => {
      console.log('🚀 Iniciando caída de corazones en 5 segundos...');
      startFallingHearts(heartPaths, svg);
    }, 5000);

  })
  .catch(error => {
    console.error('❌ Error al cargar SVG:', error);
  });

// FUNCIÓN MEJORADA: Corazones cayendo como hojas
function startFallingHearts(heartPaths, svg) {
  console.log('🌟 startFallingHearts llamada');
  console.log('📋 Paths recibidos:', heartPaths ? heartPaths.length : 0);
  
  if (!heartPaths || heartPaths.length === 0) {
    console.error('❌ No hay corazones para hacer caer');
    
    // FALLBACK: Crear corazones desde posiciones aleatorias del árbol
    console.log('💡 Activando modo fallback...');
    startFallbackHearts();
    return;
  }

  let createdCount = 0;
  
  function spawnHeart() {
    try {
      const randomIndex = Math.floor(Math.random() * heartPaths.length);
      const heart = heartPaths[randomIndex];
      
      const bbox = heart.getBoundingClientRect();
      console.log(`🎯 Spawn #${++createdCount} - Posición:`, {
        x: bbox.left,
        y: bbox.top,
        width: bbox.width,
        height: bbox.height
      });
      
      const fallingHeart = document.createElement('div');
      fallingHeart.className = 'falling-heart';
      
      const heartShape = document.createElement('div');
      heartShape.className = 'heart-shape';
      fallingHeart.appendChild(heartShape);

      const startX = bbox.left + bbox.width / 2;
      const startY = bbox.top + bbox.height / 2;
      
      fallingHeart.style.left = startX + 'px';
      fallingHeart.style.top = startY + 'px';

      const drift = (Math.random() - 0.5) * 200;
      const swing = 30 + Math.random() * 50;
      const duration = 4000 + Math.random() * 3000;
      const rotations = 1 + Math.random() * 2;
      const swingSpeed = 2 + Math.random() * 2;

      fallingHeart.style.setProperty('--drift', drift + 'px');
      fallingHeart.style.setProperty('--swing', swing + 'px');
      fallingHeart.style.setProperty('--rotation', (rotations * 360) + 'deg');
      fallingHeart.style.setProperty('--swing-speed', swingSpeed + 's');
      fallingHeart.style.animationDuration = duration + 'ms';

      document.body.appendChild(fallingHeart);
      console.log(`✅ Corazón #${createdCount} agregado al DOM`);

      setTimeout(() => {
        if (fallingHeart && fallingHeart.parentNode) {
          fallingHeart.remove();
        }
      }, duration + 500);

    } catch (error) {
      console.error('❌ Error al crear corazón cayendo:', error);
    }
  }

  console.log('⏰ Iniciando setInterval cada 700ms');
  const interval = setInterval(spawnHeart, 700);
  
  // Crear uno inmediatamente para probar
  spawnHeart();
}

// FALLBACK: Si no se detectan corazones en el árbol
function startFallbackHearts() {
  console.log('🔄 Modo fallback activado');
  
  function spawnFallbackHeart() {
    const fallingHeart = document.createElement('div');
    fallingHeart.className = 'falling-heart';
    
    const heartShape = document.createElement('div');
    heartShape.className = 'heart-shape';
    fallingHeart.appendChild(heartShape);

    // Posición aleatoria en la parte superior central
    const startX = window.innerWidth * 0.4 + Math.random() * window.innerWidth * 0.2;
    const startY = window.innerHeight * 0.2 + Math.random() * 100;
    
    fallingHeart.style.left = startX + 'px';
    fallingHeart.style.top = startY + 'px';

    const drift = (Math.random() - 0.5) * 200;
    const swing = 30 + Math.random() * 50;
    const duration = 4000 + Math.random() * 3000;
    const rotations = 1 + Math.random() * 2;
    const swingSpeed = 2 + Math.random() * 2;

    fallingHeart.style.setProperty('--drift', drift + 'px');
    fallingHeart.style.setProperty('--swing', swing + 'px');
    fallingHeart.style.setProperty('--rotation', (rotations * 360) + 'deg');
    fallingHeart.style.setProperty('--swing-speed', swingSpeed + 's');
    fallingHeart.style.animationDuration = duration + 'ms';

    document.body.appendChild(fallingHeart);
    console.log('💝 Corazón fallback creado');

    setTimeout(() => {
      if (fallingHeart && fallingHeart.parentNode) {
        fallingHeart.remove();
      }
    }, duration + 500);
  }

  setInterval(spawnFallbackHeart, 700);
  spawnFallbackHeart(); // Crear uno inmediatamente
}

// Resto de funciones...
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para mi amada Angelyn:\n\nDesde que di el primer paso contigo, desde ese primer beso, te convertiste en la mujer con la que deseo forjar mi vida. Tu sonrisa, tu voz, tu forma de ser, todo en ti hace que mi corazón reconozca su hogar, pues es tu esencia la que me enamora y me encanta cada día sin falta, es tu presencia la que transforma mi vida y mejora mi forma de vivirla.\n\nGracias por acompañarme en cada paso, por tenerme tanta paciencia al igual que amor, pues con tus actos realmente me demuestras que estas dispuesta a quedarte y elegirme pese a mis graves errores e inexperiencia, no se que nos depare el futuro, pero tengo claro una cosa, yo deseo seguir dando cada paso contigo, enfrentando cada tormenta o dificultad juntos, no quiero soltarte, no pienso dejarte ir, porque tú mi amor realmente vales la pena, no necesitas ser perfecta ya que son tus defectos el complemento que te hace inigualable en este mundo, por esa razón elijo entregarme y amarte con todo lo que soy pero tambien mejorar constantemente con el proposito de cuidar tu grande, valioso y delicado corazón.\n\nTe amo más de lo que las palabras pueden expresar, por eso me esfuerzo tanto para que mis actos con dedicación, amor y la pasión de mi alma puedan demostrarte lo valiosa, importante y única que eres para mi. Angelyn Daniela Garcia Mora, te amo con latido de mi corazón y te amare en cada instante que tenga vida ya que quiero dedicarte la mia, para que la tuya pueda ser más feliz.`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con todo mi amor, Harim López.";
  signature.classList.add('visible');
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-07-08T00:00:00');
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-07-08T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `💖Nuestro día especial💗: <b>${days}</b> días<br>` +
      `💝Nuestro año bb💓 : <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = './Music/' + musicaParam;
  }

  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(131, 12, 81, 0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});

console.log('📜 Script cargado completamente');