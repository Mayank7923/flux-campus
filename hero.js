/**
 * FLUX — Hero 3D Centerpiece: "The Assemblage" (Kinetic Modular Monolith)
 * Art Direction: Architectural Kinetic Sculpture representing
 * Students → Ideas → Collaboration → Building → Community
 * Technology: Three.js WebGL with PBR Materials & Inertial Pointer Interaction
 */

(function () {
  'use strict';

  const container = document.getElementById('webgl-hero-container');
  const tooltipEl = document.getElementById('sculpture-tooltip');
  const loadingEl = document.getElementById('canvas-loading');

  if (!container) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure Three.js is ready (loaded locally or from CDN)
  function initThree() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet available, retrying...');
      setTimeout(initThree, 50);
      return;
    }
    setupScene();
  }

  function setupScene() {
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    // 2. Renderer with High-End Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.toneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
    }
    container.appendChild(renderer.domElement);

    if (loadingEl) {
      loadingEl.classList.add('loaded');
    }

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xF8F7F4, 0.95);
    scene.add(ambientLight);

    // Key Light (Warm sculptural daylight)
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 1.8);
    keyLight.position.set(5, 7, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Cool slate ambient fill)
    const fillLight = new THREE.DirectionalLight(0xDCE6F8, 0.85);
    fillLight.position.set(-6, 3, 4);
    scene.add(fillLight);

    // Rim Light (Sharp architectural edge grazing)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // 4. Materials Library (Architectural Tactile Finishes)
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xEEEBE5,
      roughness: 0.32,
      metalness: 0.04
    });

    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1A1C22,
      roughness: 0.4,
      metalness: 0.22
    });

    const cobaltMat = new THREE.MeshStandardMaterial({
      color: 0x0B4FDB,
      roughness: 0.14,
      metalness: 0.38
    });

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xDCDFE4,
      roughness: 0.22,
      metalness: 0.88
    });

    const translucentMat = new THREE.MeshStandardMaterial({
      color: 0xE8ECF2,
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82
    });

    // 5. The Assemblage Sculpture Group
    const sculptureRoot = new THREE.Group();
    scene.add(sculptureRoot);

    const interactiveMeshList = [];

    // Helper: Rounded Box / Box with metadata
    function createModularBlock(w, h, d, material, label) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { label: label };
      interactiveMeshList.push(mesh);
      return mesh;
    }

    // A. Foundation Cantilever Plate (Students & Baseline)
    const foundationPlate = createModularBlock(2.5, 0.16, 1.8, ceramicMat, '01 // FOUNDATION PLATFORM');
    foundationPlate.position.set(-0.2, -0.6, 0);
    sculptureRoot.add(foundationPlate);

    // B. Vertical Monolith (Ideas & Technical Rigor)
    const verticalMonolith = createModularBlock(0.48, 2.2, 0.48, graphiteMat, '02 // ARCHITECTURAL MONOLITH');
    verticalMonolith.position.set(-0.65, 0.35, -0.15);
    sculptureRoot.add(verticalMonolith);

    // C. Elevated Cantilever Terrace (Teams & Building)
    const cantileverTerrace = createModularBlock(1.9, 0.14, 1.4, ceramicMat, '03 // COLLABORATIVE CANTILEVER');
    cantileverTerrace.position.set(0.75, 0.42, 0.25);
    sculptureRoot.add(cantileverTerrace);

    // D. Translucent Filter Plane (Open-Source Layer)
    const translucentPlane = createModularBlock(1.2, 0.08, 0.9, translucentMat, '04 // PERMEABLE BOUNDARY');
    translucentPlane.position.set(0.15, 0.95, -0.35);
    translucentPlane.rotation.y = 0.25;
    sculptureRoot.add(translucentPlane);

    // E. The FLUX Catalyst Core (The Ignition Spark)
    // Chamfered Polyhedral Gem
    const catalystGeom = new THREE.OctahedronGeometry(0.38, 0);
    const catalystCore = new THREE.Mesh(catalystGeom, cobaltMat);
    catalystCore.castShadow = true;
    catalystCore.receiveShadow = true;
    catalystCore.position.set(0.18, 0.05, 0.22);
    catalystCore.userData = { label: 'FLUX // COBALT CATALYST CORE' };
    sculptureRoot.add(catalystCore);
    interactiveMeshList.push(catalystCore);

    // Wireframe halo around the catalyst
    const wireGeom = new THREE.OctahedronGeometry(0.46, 0);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x0B4FDB, transparent: true, opacity: 0.35 });
    const wireMesh = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeom), wireMat);
    catalystCore.add(wireMesh);

    // F. Precision Titanium Joinery Struts
    const strutGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.05, 16);
    const strutPositions = [
      { x: 0.05, y: -0.05, z: 0.45 },
      { x: 1.45, y: -0.05, z: 0.3 },
      { x: 0.8, y: -0.05, z: -0.2 }
    ];

    strutPositions.forEach(pos => {
      const strut = new THREE.Mesh(strutGeom, titaniumMat);
      strut.position.set(pos.x, pos.y, pos.z);
      strut.castShadow = true;
      sculptureRoot.add(strut);
    });

    // G. Kinetic Orbiting Node Satellites (Incoming Ideas & Community Cohorts)
    const orbitalSatellites = [];
    const satelliteData = [
      { radius: 2.2, speed: 0.65, yOffset: 0.2, tilt: 0.3, label: 'COHORT // HARDWARE SPRINT' },
      { radius: 2.5, speed: -0.45, yOffset: -0.35, tilt: -0.25, label: 'COHORT // OPEN PROTOCOLS' },
      { radius: 1.85, speed: 0.85, yOffset: 0.8, tilt: 0.45, label: 'COHORT // CREATIVE INTERFACES' }
    ];

    satelliteData.forEach((sat, i) => {
      const satGroup = new THREE.Group();
      sculptureRoot.add(satGroup);

      const nodeGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const nodeMat = (i === 0) ? cobaltMat : graphiteMat;
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.userData = { label: sat.label };
      satGroup.add(nodeMesh);
      interactiveMeshList.push(nodeMesh);

      orbitalSatellites.push({
        group: satGroup,
        mesh: nodeMesh,
        radius: sat.radius,
        speed: sat.speed,
        yOffset: sat.yOffset,
        tilt: sat.tilt,
        angle: (i * Math.PI * 2) / satelliteData.length
      });
    });

    // Soft Ambient Contact Shadow on Ground
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(17, 18, 21, 0.18)');
    grad.addColorStop(0.5, 'rgba(17, 18, 21, 0.05)');
    grad.addColorStop(1, 'rgba(17, 18, 21, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.2),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.25, 0);
    sculptureRoot.add(shadowPlane);

    // Initial Aesthetic Pose
    const baseRotationX = 0.22;
    const baseRotationY = -0.55;
    sculptureRoot.rotation.set(baseRotationX, baseRotationY, 0);

    // 6. Interaction & Pointer Physics
    let targetRotationX = baseRotationX;
    let targetRotationY = baseRotationY;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const mouseNorm = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      mouseNorm.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - previousPointerX;
        const deltaY = clientY - previousPointerY;

        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;

        targetRotationY += dragVelocityX;
        targetRotationX += dragVelocityY;

        previousPointerX = clientX;
        previousPointerY = clientY;
      } else {
        // Subtle Parallax
        const parallaxX = (clientX / window.innerWidth - 0.5) * 0.4;
        const parallaxY = (clientY / window.innerHeight - 0.5) * 0.3;
        targetRotationY = baseRotationY + parallaxX;
        targetRotationX = baseRotationX + parallaxY;
      }
    }

    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousPointerX = clientX;
      previousPointerY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    }

    function onPointerUp() {
      isDragging = false;
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 7. Raycasting & Editorial Telemetry Tooltip
    function updateRaycasting() {
      if (!tooltipEl) return;

      if (isDragging || mouseNorm.x < -1 || mouseNorm.x > 1) {
        tooltipEl.classList.remove('visible');
        return;
      }

      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshList, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const label = hit.object.userData.label;
        if (label) {
          const hitPos = hit.point.clone().project(camera);
          const x = (hitPos.x * 0.5 + 0.5) * container.clientWidth;
          const y = (-hitPos.y * 0.5 + 0.5) * container.clientHeight;

          tooltipEl.textContent = label;
          tooltipEl.style.left = `${x}px`;
          tooltipEl.style.top = `${y}px`;
          tooltipEl.classList.add('visible');
          return;
        }
      }
      tooltipEl.classList.remove('visible');
    }

    // 8. Scroll-Linked Transformation
    let scrollProgress = 0;
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = container.clientHeight || 600;
      scrollProgress = Math.min(scrollY / heroHeight, 1.5);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // 9. Resize Handling
    function onResize() {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;

      camera.aspect = newW / newH;
      // Adjust camera distance for mobile
      if (newW < 600) {
        camera.position.z = 8.5;
      } else {
        camera.position.z = 7.2;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // 10. Pause loop when hero is offscreen
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);

    // 11. Animation Loop
    let clock = new THREE.Clock();

    let introProgress = 0;

    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible && !prefersReduced) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!prefersReduced) {
        // Smooth entrance reveal
        if (introProgress < 1) {
          introProgress += delta * 1.4;
          const ease = 1 - Math.pow(1 - Math.min(introProgress, 1), 3);
          const currentScale = 0.88 + 0.12 * ease;
          sculptureRoot.scale.set(currentScale, currentScale, currentScale);
        }

        // Inertia damping
        if (!isDragging) {
          targetRotationY += dragVelocityX;
          targetRotationX += dragVelocityY;
          dragVelocityX *= 0.94;
          dragVelocityY *= 0.94;
        }

        // Smooth spring interpolation
        sculptureRoot.rotation.y += (targetRotationY - sculptureRoot.rotation.y) * 0.05;
        sculptureRoot.rotation.x += (targetRotationX - sculptureRoot.rotation.x) * 0.05;

        // Subtle kinetic breathing of individual parts
        const hoverBob = Math.sin(elapsed * 1.4) * 0.035;
        catalystCore.position.y = 0.05 + hoverBob;
        catalystCore.rotation.y = elapsed * 0.4;
        catalystCore.rotation.z = Math.sin(elapsed * 0.6) * 0.15;

        cantileverTerrace.position.y = 0.42 + Math.sin(elapsed * 1.1 + 1) * 0.015;
        translucentPlane.position.y = 0.95 + Math.cos(elapsed * 1.2) * 0.02;

        // Orbital Satellites
        orbitalSatellites.forEach(sat => {
          sat.angle += sat.speed * delta;
          const x = Math.cos(sat.angle) * sat.radius;
          const z = Math.sin(sat.angle) * sat.radius;
          sat.mesh.position.set(x, sat.yOffset + Math.sin(sat.angle * 2) * 0.1, z);
          sat.mesh.rotation.x += delta * 0.8;
          sat.mesh.rotation.y += delta * 1.1;
        });

        // Scroll linkage
        sculptureRoot.position.y = -scrollProgress * 0.8;
        sculptureRoot.position.z = -scrollProgress * 1.2;

        updateRaycasting();
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // Kickstart
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThree);
  } else {
    initThree();
  }
})();
