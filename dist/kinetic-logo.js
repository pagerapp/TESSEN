import * as THREE from 'three';
import { SVGLoader } from '/vendor/three/SVGLoader.js';

// All motion is evaluated from a periodic phase; nothing accumulates between loops.
export function logoPose(phase, index, x, y, diamond = false, intensity = 1) {
  const p = ((phase % 1) + 1) % 1;
  const wave = p * Math.PI * 2;
  const smooth = (a, b) => {
    const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  const spread = smooth(.2, .48) * (1 - smooth(.68, .96)) * intensity;
  const side = x < 0 ? -1 : 1;
  return {
    x: x * (1 + spread * .12),
    y: y * (1 + spread * .08),
    z: diamond ? .13 : spread * ((index % 2 ? 1 : -1) * (.35 + Math.abs(x) * .36)),
    rx: diamond ? 0 : spread * side * .13,
    ry: diamond ? Math.sin(wave) * .14 : spread * side * (index % 2 ? .38 : -.29),
    rz: diamond ? Math.sin(wave) * .07 : spread * side * .055,
    groupX: -.14 + Math.sin(wave) * .09,
    groupY: .24 + Math.sin(wave) * .55,
    groupZ: Math.sin(wave) * .025,
    lift: Math.sin(wave) * .09,
    lightX: Math.cos(wave) * 4,
    spread,
  };
}

const host = document.querySelector('[data-kinetic-logo]');
if (host) initLogo(host).catch(() => host.classList.add('is-fallback'));

async function initLogo(host) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)');
  const intensity = { about: .58, contact: .48, work: 1, services: .88 }[host.dataset.kineticLogo] || .8;
  const servicesMode = host.dataset.kineticLogo === 'services';
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x0a0a0a, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 80);
  const sculpture = new THREE.Group();
  scene.add(sculpture);

  // Soft studio reflection panels give the bevels a readable metallic finish.
  const studio = new THREE.Scene();
  studio.background = new THREE.Color('#383239');
  const panels = [];
  for (const [x, y, z, w, h, color] of [
    [-4, 3, 2, 3, 6, '#ffffff'], [4, 1, -2, 2, 7, servicesMode ? '#aaa4aa' : '#d87891'],
    [0, 5, 0, 6, 2, '#f6eeee'], [0, -3, 4, 5, 1, '#53464d'],
  ]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
    panels.push(panel);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, .02);
  scene.environment = environment.texture;
  pmrem.dispose();
  panels.forEach(panel => { panel.geometry.dispose(); panel.material.dispose(); });

  const key = new THREE.DirectionalLight('#e2dbe2', 3.3);
  key.position.set(-3, 5, 6);
  scene.add(key, new THREE.AmbientLight('#99909b', .6));
  const rim = new THREE.DirectionalLight(servicesMode ? '#ddd7dd' : '#d72050', 2.2);
  rim.position.set(4, 1, 2);
  scene.add(rim);
  const metal = new THREE.MeshPhysicalMaterial({ color: servicesMode ? '#a69ba4' : '#51464e', metalness: .88, roughness: .29, clearcoat: .4, clearcoatRoughness: .26, envMapIntensity: 1.1 });
  const edge = new THREE.MeshStandardMaterial({ color: servicesMode ? '#bdb3bd' : '#71626c', metalness: .9, roughness: .24, envMapIntensity: 1.2 });
  const enamel = new THREE.MeshPhysicalMaterial({ color: servicesMode ? '#ee1349' : '#b90939', metalness: .35, roughness: .26, clearcoat: .7, clearcoatRoughness: .2 });
  const response = await fetch('/Assets/Logo/fan.svg');
  if (!response.ok) throw new Error('Logo unavailable');
  const documentSVG = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
  // Use only the actual filled artwork, excluding duplicate animation outlines.
  const sourcePaths = [...documentSVG.querySelectorAll('.fan-fill > path, .fan-diamond')];
  const loader = new SVGLoader();
  const pieces = sourcePaths.map((source, index) => {
    const diamond = source.classList.contains('fan-diamond');
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${source.getAttribute('d')}"/></svg>`);
    const shapes = data.paths.flatMap(path => path.toShapes(true));
    const geometry = new THREE.ExtrudeGeometry(shapes, { depth: diamond ? 11 : 7, bevelEnabled: true, bevelThickness: 1.1, bevelSize: .8, bevelSegments: compact.matches ? 2 : 3, steps: 1, curveSegments: 8 });
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.rotateX(Math.PI);
    geometry.scale(.01, .01, .01);
    const materials = diamond ? enamel : servicesMode ? [metal.clone(), edge.clone()] : [metal, edge];
    const mesh = new THREE.Mesh(geometry, materials);
    sculpture.add(mesh);
    return { mesh, index, diamond, sector: index < 8 ? Math.floor(index / 2) : index === 8 ? 0 : 3, emphasis: 0, x: (center.x - 256) / 100, y: (256 - center.y) / 100 };
  });

  const faceIdle = metal.color.clone();
  const faceSelected = new THREE.Color('#bdb8be');
  const edgeIdle = edge.color.clone();
  const edgeSelected = new THREE.Color('#e4e0e4');
  const selectedGlow = new THREE.Color('#e4e0e4');
  let activeService = -1;
  let frame = 0, active = false, elapsed = 0, previous = 0, lastPaint = 0, disposed = false;
  function renderPhase(phase) {
    for (const piece of pieces) {
      const pose = logoPose(phase, piece.index, piece.x, piece.y, piece.diamond, intensity);
      piece.mesh.position.set(pose.x, pose.y, pose.z);
      piece.mesh.rotation.set(pose.rx, pose.ry, pose.rz);
      if (servicesMode && !piece.diamond) {
        const target = piece.sector === activeService ? 1 : 0;
        piece.emphasis += (target - piece.emphasis) * (reduced.matches ? 1 : .13);
        const [face, side] = piece.mesh.material;
        face.color.copy(faceIdle).lerp(faceSelected, piece.emphasis);
        face.emissive.copy(selectedGlow).multiplyScalar(piece.emphasis * .1);
        side.color.copy(edgeIdle).lerp(edgeSelected, piece.emphasis);
      }
    }
    const pose = logoPose(phase, 0, 0, 0, false, intensity);
    sculpture.rotation.set(pose.groupX, pose.groupY, pose.groupZ);
    sculpture.position.set(compact.matches ? .25 : .55, .05 + pose.lift, 0);
    rim.position.x = pose.lightX;
    renderer.render(scene, camera);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || disposed) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const visibleHeight = Math.max(4.6, 6.9 / camera.aspect);
    camera.position.set(0, 0, visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(16))));
    camera.updateProjectionMatrix();
    renderPhase(elapsed / 24000);
  }
  function tick(now) {
    if (!active || disposed) return;
    if (previous) elapsed += Math.min(now - previous, 100);
    previous = now;
    if (now - lastPaint >= (compact.matches ? 1000 / 30 : 1000 / 45)) {
      renderPhase(elapsed / 24000);
      lastPaint = now;
    }
    frame = requestAnimationFrame(tick);
  }
  let inView = true;
  function updateActivity() {
    cancelAnimationFrame(frame);
    active = inView && !document.hidden && !reduced.matches && !disposed;
    previous = 0;
    if (active) frame = requestAnimationFrame(tick);
    else if (reduced.matches && !disposed) renderPhase(0);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; updateActivity(); }, { threshold: .01 });
  observer.observe(host);
  const serviceNav = host.dataset.kineticLogo === 'services' ? document.querySelector('.svc-routes, .services-intro .service-routes') : null;
  if (serviceNav) {
    const routes = [...serviceNav.querySelectorAll('[data-service-index]')];
    const caption = document.querySelector('[data-service-caption]');
    const selectService = index => {
      activeService = index;
      host.dataset.activeService = index < 0 ? 'none' : String(index);
      if (index < 0) serviceNav.removeAttribute('data-active');
      else serviceNav.dataset.active = String(index);
      routes.forEach(route => route.classList.toggle('is-active', Number(route.dataset.serviceIndex) === index));
      if (caption) {
        const route = routes[index];
        caption.textContent = route ? `${route.querySelector('.service-route-number').textContent} / ${route.querySelector('.service-route-title').textContent}` : '';
        caption.classList.toggle('is-visible', Boolean(route));
      }
      if (!active) renderPhase(elapsed / 24000);
    };
    routes.forEach(route => {
      route.addEventListener('pointerenter', () => selectService(Number(route.dataset.serviceIndex)));
      route.addEventListener('focus', () => selectService(Number(route.dataset.serviceIndex)));
    });
    serviceNav.addEventListener('pointerleave', () => { if (!serviceNav.contains(document.activeElement)) selectService(-1); });
    serviceNav.addEventListener('focusout', event => { if (!serviceNav.contains(event.relatedTarget)) selectService(-1); });
    host.dataset.activeService = 'none';
  }
  reduced.addEventListener('change', updateActivity);
  document.addEventListener('visibilitychange', updateActivity);
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    active = false;
    disposed = true;
    cancelAnimationFrame(frame);
    host.classList.remove('is-ready');
  });
  resize();
  host.classList.add('is-ready');
  host.dataset.loopSeconds = '24';
  host.dataset.pieces = String(pieces.length);
  updateActivity();
}
