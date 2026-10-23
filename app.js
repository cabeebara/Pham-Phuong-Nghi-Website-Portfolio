/**
 * ARCHITECTURAL SKETCH PORTFOLIO APPLICATION
 * Artist: Pham Phuong Nghi
 * Style: Architectural Ink Sketch & Watercolor Highlight (#72a9e8, 60% opacity)
 */

(function () {
  'use strict';

  // State Management
  const state = {
    history: ['home'], // Navigation history stack
    currentView: 'home',
    activePastRoom: null,
    pastGalleryIndex: 0,
    presentGalleryIndex: 0,
    lightbox: {
      active: false,
      title: '',
      src: '',
      zoom: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0
    },
    soundEnabled: true,
    profileDocked: false
  };

  // DOM Elements
  const els = {
    app: document.getElementById('app'),
    btnBack: document.getElementById('btn-back'),
    btnHome: document.getElementById('btn-home'),
    btnSound: document.getElementById('btn-sound'),
    breadcrumb: document.getElementById('nav-breadcrumb'),
    profileBox: document.getElementById('profile-box'),
    profileClose: document.getElementById('profile-close'),
    transitionCurtain: document.getElementById('transition-curtain'),

    // Views
    viewHome: document.getElementById('view-home'),
    viewPastRotunda: document.getElementById('view-past-rotunda'),
    viewPastGallery: document.getElementById('view-past-gallery'),
    viewPastModels: document.getElementById('view-past-models'),
    viewPresentStudio: document.getElementById('view-present-studio'),
    viewFutureSketchbook: document.getElementById('view-future-sketchbook'),

    // Gallery Elements
    galleryFrame: document.getElementById('gallery-artwork-frame'),
    galleryImg: document.getElementById('gallery-artwork-img'),
    galleryTitle: document.getElementById('gallery-title'),
    galleryCounter: document.getElementById('gallery-counter'),
    galleryPrevBtn: document.getElementById('gallery-prev-btn'),
    galleryNextBtn: document.getElementById('gallery-next-btn'),

    // Present Showcase Elements
    presentShowcase: document.getElementById('present-showcase'),
    presentCloseBtn: document.getElementById('present-close-btn'),
    presentImg: document.getElementById('present-img'),
    presentTitle: document.getElementById('present-title'),
    presentCounter: document.getElementById('present-counter'),
    presentPrevBtn: document.getElementById('present-prev-btn'),
    presentNextBtn: document.getElementById('present-next-btn'),

    // Models Modal Elements
    modelsModal: document.getElementById('models-modal'),
    modelsModalTitle: document.getElementById('models-modal-title'),
    modelsModalImg: document.getElementById('models-modal-img'),
    modelsModalClose: document.getElementById('models-modal-close'),

    // Lightbox Elements
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxImgWrapper: document.getElementById('lightbox-img-wrapper'),
    lightboxTitle: document.getElementById('lightbox-title'),
    lightboxZoomDisplay: document.getElementById('lightbox-zoom-display'),
    lightboxZoomIn: document.getElementById('lightbox-zoom-in'),
    lightboxZoomOut: document.getElementById('lightbox-zoom-out'),
    lightboxZoomReset: document.getElementById('lightbox-zoom-reset'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxViewport: document.getElementById('lightbox-viewport')
  };

  // Web Audio Synthesizer (Pencil sketch & paper turn sounds)
  const soundSynth = {
    ctx: null,
    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('AudioContext not available', e);
      }
    },
    playSketch() {
      if (!state.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },
    playPaperTurn() {
      if (!state.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Filtered white noise for paper rustle
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    }
  };

  // Initialize Portfolio App
  function initApp() {
    soundSynth.init();
    setupProfileBox();
    setupNavigation();
    setupPastRotunda();
    setupGalleryControls();
    setupModelsPedestals();
    setupPresentStudio();
    setupFutureSketchbook();
    setupLightbox();
    renderView('home', false);
  }

  // =========================================================================
  // PROFILE BOX LOGIC
  // Starts centered -> Docks to top-right corner after 5 seconds
  // =========================================================================
  function setupProfileBox() {
    let timer = setTimeout(() => {
      dockProfileBox();
    }, 5000);

    // Clicking profile card toggles state
    els.profileBox.addEventListener('click', (e) => {
      soundSynth.playSketch();
      if (state.profileDocked) {
        expandProfileBox();
      } else {
        clearTimeout(timer);
        dockProfileBox();
      }
    });

    if (els.profileClose) {
      els.profileClose.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(timer);
        dockProfileBox();
      });
    }
  }

  function dockProfileBox() {
    state.profileDocked = true;
    els.profileBox.classList.remove('state-modal');
    els.profileBox.classList.add('state-docked');
  }

  function expandProfileBox() {
    state.profileDocked = false;
    els.profileBox.classList.remove('state-docked');
    els.profileBox.classList.add('state-modal');
  }

  // =========================================================================
  // VIEW NAVIGATION & TRANSITION LOGIC
  // "Mỗi bước chuyển giao diện đều cần có hoạt ảnh (fade/zoom hoặc morph)"
  // =========================================================================
  function navigateTo(targetView, addToHistory = true) {
    if (targetView === state.currentView) return;
    soundSynth.playPaperTurn();

    if (addToHistory) {
      state.history.push(targetView);
    }

    // Play watercolor transition curtain
    els.transitionCurtain.classList.add('active');

    setTimeout(() => {
      renderView(targetView);
      setTimeout(() => {
        els.transitionCurtain.classList.remove('active');
      }, 150);
    }, 250);
  }

  function navigateBack() {
    if (state.history.length <= 1) return;
    soundSynth.playPaperTurn();

    state.history.pop();
    const previousView = state.history[state.history.length - 1];

    els.transitionCurtain.classList.add('active');
    setTimeout(() => {
      renderView(previousView);
      setTimeout(() => {
        els.transitionCurtain.classList.remove('active');
      }, 150);
    }, 250);
  }

  function navigateHome() {
    if (state.currentView === 'home') return;
    soundSynth.playPaperTurn();

    state.history = ['home'];
    els.transitionCurtain.classList.add('active');
    setTimeout(() => {
      renderView('home');
      setTimeout(() => {
        els.transitionCurtain.classList.remove('active');
      }, 150);
    }, 250);
  }

  function setupNavigation() {
    // Back & Home buttons
    els.btnBack.addEventListener('click', navigateBack);
    els.btnHome.addEventListener('click', navigateHome);

    // Sound toggle button
    els.btnSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      els.btnSound.classList.toggle('sound-active', state.soundEnabled);
      if (state.soundEnabled) soundSynth.playSketch();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (state.lightbox.active) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === '+' || e.key === '=') zoomLightbox(0.25);
        if (e.key === '-') zoomLightbox(-0.25);
        if (e.key === '0') resetLightboxZoom();
        return;
      }

      if (e.key === 'Escape') {
        if (els.presentShowcase && els.presentShowcase.classList.contains('active')) {
          closePresentShowcase();
          return;
        }
        if (els.modelsModal && els.modelsModal.classList.contains('active')) {
          closeModelsModal();
          return;
        }
        navigateBack();
      }

      // Left/Right arrow cycling
      if (state.currentView.startsWith('gallery:')) {
        if (e.key === 'ArrowRight') nextGalleryArtwork();
        if (e.key === 'ArrowLeft') prevGalleryArtwork();
      } else if (els.presentShowcase && els.presentShowcase.classList.contains('active')) {
        if (e.key === 'ArrowRight') nextPresentArtwork();
        if (e.key === 'ArrowLeft') prevPresentArtwork();
      }
    });

    // Setup Home Museum SVG Hotspots
    setupHomeHotspots();
  }

  function setupHomeHotspots() {
    const attachHotspot = () => {
      const homeSvg = els.viewHome.querySelector('svg');
      if (!homeSvg) return;

      const hotspotPast = homeSvg.querySelector('#hotspot-past');
      const hotspotPresent = homeSvg.querySelector('#hotspot-present');
      const hotspotFuture = homeSvg.querySelector('#hotspot-future');

      if (hotspotPast) {
        hotspotPast.addEventListener('click', () => navigateTo('past'));
      }
      if (hotspotPresent) {
        hotspotPresent.addEventListener('click', () => navigateTo('present'));
      }
      if (hotspotFuture) {
        hotspotFuture.addEventListener('click', () => navigateTo('future'));
      }
    };

    // Run now and also after SVG load
    attachHotspot();
    const obj = els.viewHome.querySelector('object');
    if (obj) {
      obj.addEventListener('load', () => {
        try {
          const doc = obj.contentDocument;
          const p = doc.querySelector('#hotspot-past');
          const pr = doc.querySelector('#hotspot-present');
          const f = doc.querySelector('#hotspot-future');
          if (p) p.addEventListener('click', () => navigateTo('past'));
          if (pr) pr.addEventListener('click', () => navigateTo('present'));
          if (f) f.addEventListener('click', () => navigateTo('future'));
        } catch (e) {
          console.warn('Cannot attach inside object:', e);
        }
      });
    }
  }

  function renderView(viewTarget) {
    state.currentView = viewTarget;

    // Deactivate all views
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('view-active');
    });

    // Update Back button state
    els.btnBack.classList.toggle('btn-disabled', state.history.length <= 1);

    // Update Breadcrumbs & Activate View
    if (viewTarget === 'home') {
      els.viewHome.classList.add('view-active');
      updateBreadcrumb(['Home']);
    } 
    else if (viewTarget === 'past') {
      els.viewPastRotunda.classList.add('view-active');
      updateBreadcrumb(['Home', 'Past']);
    } 
    else if (viewTarget.startsWith('gallery:')) {
      const roomId = viewTarget.split(':')[1];
      showPastGallery(roomId);
      els.viewPastGallery.classList.add('view-active');
      const room = getRoomData(roomId);
      updateBreadcrumb(['Home', 'Past', room ? room.name : 'Gallery']);
    } 
    else if (viewTarget === 'models') {
      els.viewPastModels.classList.add('view-active');
      updateBreadcrumb(['Home', 'Past', 'Models']);
    } 
    else if (viewTarget === 'present') {
      els.viewPresentStudio.classList.add('view-active');
      updateBreadcrumb(['Home', 'Present']);
    } 
    else if (viewTarget === 'future') {
      els.viewFutureSketchbook.classList.add('view-active');
      updateBreadcrumb(['Home', 'Future']);
    }
  }

  function updateBreadcrumb(items) {
    els.breadcrumb.innerHTML = items.map((item, i) => {
      const isLast = i === items.length - 1;
      return `<span class="${isLast ? 'breadcrumb-active' : ''}">${item}</span>` + 
             (!isLast ? '<span class="breadcrumb-separator">/</span>' : '');
    }).join(' ');
  }

  function getRoomData(roomId) {
    if (!window.PORTFOLIO_DATA || !window.PORTFOLIO_DATA.past) return null;
    return window.PORTFOLIO_DATA.past.rooms.find(r => r.id === roomId);
  }

  // =========================================================================
  // VIEW: PAST ROTUNDA (FLOOR PLAN)
  // =========================================================================
  function setupPastRotunda() {
    const bindRooms = () => {
      const svg = els.viewPastRotunda.querySelector('svg');
      if (!svg) return;

      const roomGroups = svg.querySelectorAll('.floorplan-room-group');
      roomGroups.forEach(grp => {
        grp.addEventListener('click', () => {
          soundSynth.playSketch();
          const roomId = grp.getAttribute('data-room-id');
          if (roomId === 'models') {
            navigateTo('models');
          } else {
            navigateTo(`gallery:${roomId}`);
          }
        });
      });
    };

    bindRooms();
    const obj = els.viewPastRotunda.querySelector('object');
    if (obj) {
      obj.addEventListener('load', () => {
        try {
          const doc = obj.contentDocument;
          const roomGroups = doc.querySelectorAll('.floorplan-room-group');
          roomGroups.forEach(grp => {
            grp.addEventListener('click', () => {
              soundSynth.playSketch();
              const roomId = grp.getAttribute('data-room-id');
              if (roomId === 'models') {
                navigateTo('models');
              } else {
                navigateTo(`gallery:${roomId}`);
              }
            });
          });
        } catch (e) {
          console.warn('Object bind error', e);
        }
      });
    }
  }

  // =========================================================================
  // VIEW: PAST GALLERY (STANDARD PICTURE FRAME WITH ASPECT RATIO & ARROWS)
  // =========================================================================
  function showPastGallery(roomId) {
    state.activePastRoom = getRoomData(roomId);
    state.pastGalleryIndex = 0;
    renderPastGalleryArtwork();
  }

  function renderPastGalleryArtwork(animationDirection = null) {
    if (!state.activePastRoom || !state.activePastRoom.items.length) return;

    const items = state.activePastRoom.items;
    const currentItem = items[state.pastGalleryIndex];

    // Trigger frame morph / 3D flip animation
    if (animationDirection === 'next') {
      els.galleryFrame.classList.remove('flip-next', 'flip-prev');
      void els.galleryFrame.offsetWidth; // Force reflow
      els.galleryFrame.classList.add('flip-next');
    } else if (animationDirection === 'prev') {
      els.galleryFrame.classList.remove('flip-next', 'flip-prev');
      void els.galleryFrame.offsetWidth;
      els.galleryFrame.classList.add('flip-prev');
    }

    // Set Image src and metadata
    els.galleryImg.src = currentItem.path;
    els.galleryImg.alt = currentItem.title;
    els.galleryTitle.textContent = currentItem.title;
    els.galleryCounter.textContent = `${state.pastGalleryIndex + 1} / ${items.length}`;

    // Adjust Frame Aspect Ratio Dynamically!
    if (currentItem.aspectRatio) {
      const maxW = Math.min(window.innerWidth * 0.82, 840);
      const maxH = Math.min(window.innerHeight * 0.65, 540);
      let targetW = maxH * currentItem.aspectRatio;
      let targetH = maxH;
      if (targetW > maxW) {
        targetW = maxW;
        targetH = maxW / currentItem.aspectRatio;
      }
      els.galleryFrame.style.width = `${Math.round(targetW)}px`;
    }

    // Arrow visibility rule:
    // "Trong trường hợp folder chỉ có một ảnh như folder Others thì không cần có mũi tên"
    if (items.length <= 1) {
      els.galleryPrevBtn.style.display = 'none';
      els.galleryNextBtn.style.display = 'none';
    } else {
      els.galleryPrevBtn.style.display = 'flex';
      els.galleryNextBtn.style.display = 'flex';
    }
  }

  function nextGalleryArtwork() {
    if (!state.activePastRoom || state.activePastRoom.items.length <= 1) return;
    soundSynth.playSketch();
    state.pastGalleryIndex = (state.pastGalleryIndex + 1) % state.activePastRoom.items.length;
    renderPastGalleryArtwork('next');
  }

  function prevGalleryArtwork() {
    if (!state.activePastRoom || state.activePastRoom.items.length <= 1) return;
    soundSynth.playSketch();
    state.pastGalleryIndex = (state.pastGalleryIndex - 1 + state.activePastRoom.items.length) % state.activePastRoom.items.length;
    renderPastGalleryArtwork('prev');
  }

  function setupGalleryControls() {
    els.galleryNextBtn.addEventListener('click', nextGalleryArtwork);
    els.galleryPrevBtn.addEventListener('click', prevGalleryArtwork);

    // Clicking image opens Lightbox Zoom
    els.galleryImg.addEventListener('click', () => {
      if (!state.activePastRoom) return;
      const cur = state.activePastRoom.items[state.pastGalleryIndex];
      openLightbox(cur.title, cur.path);
    });
  }

  // =========================================================================
  // VIEW: PAST MODELS (2 PEDESTALS WITH VITRINES & SHOWCASE MODAL)
  // =========================================================================
  function setupModelsPedestals() {
    const bindPedestals = () => {
      const svg = els.viewPastModels.querySelector('svg');
      if (!svg) return;

      const pTotoro = svg.querySelector('#pedestal-totoro');
      const pIndustrial = svg.querySelector('#pedestal-industrialism');

      if (pTotoro) {
        pTotoro.addEventListener('click', () => openModelModal('bus-stop-totoro'));
      }
      if (pIndustrial) {
        pIndustrial.addEventListener('click', () => openModelModal('the-city-industrialism'));
      }
    };

    bindPedestals();
    const obj = els.viewPastModels.querySelector('object');
    if (obj) {
      obj.addEventListener('load', () => {
        try {
          const doc = obj.contentDocument;
          const pT = doc.querySelector('#pedestal-totoro');
          const pI = doc.querySelector('#pedestal-industrialism');
          if (pT) pT.addEventListener('click', () => openModelModal('bus-stop-totoro'));
          if (pI) pI.addEventListener('click', () => openModelModal('the-city-industrialism'));
        } catch (e) {
          console.warn('Pedestal bind error', e);
        }
      });
    }

    els.modelsModalClose.addEventListener('click', closeModelsModal);
    els.modelsModal.addEventListener('click', (e) => {
      if (e.target === els.modelsModal) closeModelsModal();
    });

    els.modelsModalImg.addEventListener('click', () => {
      const title = els.modelsModalTitle.textContent;
      const src = els.modelsModalImg.src;
      openLightbox(title, src);
    });
  }

  function openModelModal(subfolderId) {
    soundSynth.playPaperTurn();
    const modelsRoom = getRoomData('models');
    if (!modelsRoom) return;

    const sub = modelsRoom.subfolders.find(s => s.id === subfolderId);
    if (!sub || !sub.items.length) return;

    const item = sub.items[0];
    els.modelsModalTitle.textContent = sub.name;
    els.modelsModalImg.src = item.path;
    els.modelsModalImg.alt = item.title;

    els.modelsModal.classList.add('active');
  }

  function closeModelsModal() {
    soundSynth.playSketch();
    els.modelsModal.classList.remove('active');
  }

  // =========================================================================
  // VIEW: PRESENT (CONSTRUCTION STUDIO & PROJECT SHOWCASE)
  // =========================================================================
  function setupPresentStudio() {
    const bindCrates = () => {
      const svg = els.viewPresentStudio.querySelector('svg');
      if (!svg) return;

      const boxes = svg.querySelector('#construction-boxes');
      if (boxes) {
        boxes.addEventListener('click', openPresentShowcase);
      }
    };

    bindCrates();
    const obj = els.viewPresentStudio.querySelector('object');
    if (obj) {
      obj.addEventListener('load', () => {
        try {
          const doc = obj.contentDocument;
          const b = doc.querySelector('#construction-boxes');
          if (b) b.addEventListener('click', openPresentShowcase);
        } catch (e) {
          console.warn('Crates bind error', e);
        }
      });
    }

    els.presentCloseBtn.addEventListener('click', closePresentShowcase);
    els.presentNextBtn.addEventListener('click', nextPresentArtwork);
    els.presentPrevBtn.addEventListener('click', prevPresentArtwork);

    els.presentImg.addEventListener('click', () => {
      const items = window.PORTFOLIO_DATA.present.items;
      const cur = items[state.presentGalleryIndex];
      openLightbox(cur.title, cur.path);
    });
  }

  function openPresentShowcase() {
    soundSynth.playPaperTurn();
    state.presentGalleryIndex = 0;
    renderPresentArtwork();
    els.presentShowcase.classList.add('active');
  }

  function closePresentShowcase() {
    soundSynth.playSketch();
    els.presentShowcase.classList.remove('active');
  }

  function renderPresentArtwork() {
    const items = window.PORTFOLIO_DATA.present.items;
    if (!items || !items.length) return;

    const cur = items[state.presentGalleryIndex];
    els.presentImg.src = cur.path;
    els.presentImg.alt = cur.title;
    els.presentTitle.textContent = cur.title;
    els.presentCounter.textContent = `${state.presentGalleryIndex + 1} / ${items.length}`;
  }

  function nextPresentArtwork() {
    const items = window.PORTFOLIO_DATA.present.items;
    if (!items || items.length <= 1) return;
    soundSynth.playSketch();
    state.presentGalleryIndex = (state.presentGalleryIndex + 1) % items.length;
    renderPresentArtwork();
  }

  function prevPresentArtwork() {
    const items = window.PORTFOLIO_DATA.present.items;
    if (!items || items.length <= 1) return;
    soundSynth.playSketch();
    state.presentGalleryIndex = (state.presentGalleryIndex - 1 + items.length) % items.length;
    renderPresentArtwork();
  }

  // =========================================================================
  // VIEW: FUTURE (OPEN SKETCHBOOK: THE INNER ORBITS & THE HUMANE CHAOS)
  // =========================================================================
  function setupFutureSketchbook() {
    const futureData = window.PORTFOLIO_DATA.future;
    if (!futureData) return;

    // 1. Populate Left Page: 9-Grid (The Inner Orbits)
    const orbitsContainer = document.getElementById('orbits-9grid');
    if (orbitsContainer && futureData.innerOrbits) {
      orbitsContainer.innerHTML = '';
      futureData.innerOrbits.forEach((orbit, index) => {
        const card = document.createElement('div');
        card.className = 'orbit-card';
        card.setAttribute('data-index', index);
        card.innerHTML = `
          <div class="orbit-card-thumb">
            <img src="${orbit.path}" alt="${orbit.title}" loading="lazy" />
          </div>
          <div class="orbit-card-label">${orbit.title}</div>
        `;
        card.addEventListener('click', () => {
          soundSynth.playSketch();
          openLightbox(orbit.title, orbit.path);
        });
        orbitsContainer.appendChild(card);
      });
    }

    // 2. Populate Right Page: The Humane Chaos
    const humaneCard = document.getElementById('humane-chaos-card');
    if (humaneCard && futureData.humaneChaos && futureData.humaneChaos.length) {
      const hc = futureData.humaneChaos[0];
      const thumb = humaneCard.querySelector('.humane-chaos-thumb img');
      if (thumb) {
        thumb.src = hc.path;
        thumb.alt = hc.title;
      }
      humaneCard.addEventListener('click', () => {
        soundSynth.playSketch();
        openLightbox(hc.title, hc.path);
      });
    }
  }

  // =========================================================================
  // LIGHTBOX / INTERACTIVE FULLSCREEN ZOOM
  // User Request: "có dấu x để tắt và có thể zoom"
  // =========================================================================
  function setupLightbox() {
    els.lightboxClose.addEventListener('click', closeLightbox);
    els.lightboxZoomIn.addEventListener('click', () => zoomLightbox(0.25));
    els.lightboxZoomOut.addEventListener('click', () => zoomLightbox(-0.25));
    els.lightboxZoomReset.addEventListener('click', resetLightboxZoom);

    // Mouse wheel zoom
    els.lightboxViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      zoomLightbox(delta);
    });

    // Drag to Pan
    els.lightboxViewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.lightbox-btn')) return;
      state.lightbox.isDragging = true;
      state.lightbox.dragStartX = e.clientX - state.lightbox.panX;
      state.lightbox.dragStartY = e.clientY - state.lightbox.panY;
      els.lightboxViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.lightbox.isDragging) return;
      state.lightbox.panX = e.clientX - state.lightbox.dragStartX;
      state.lightbox.panY = e.clientY - state.lightbox.dragStartY;
      updateLightboxTransform();
    });

    window.addEventListener('mouseup', () => {
      if (state.lightbox.isDragging) {
        state.lightbox.isDragging = false;
        els.lightboxViewport.classList.remove('is-dragging');
      }
    });

    // Double click to toggle 1x / 2x zoom
    els.lightboxViewport.addEventListener('dblclick', (e) => {
      if (e.target.closest('.lightbox-btn')) return;
      if (state.lightbox.zoom > 1.2) {
        resetLightboxZoom();
      } else {
        zoomLightbox(1.0);
      }
    });
  }

  function openLightbox(title, src) {
    soundSynth.playPaperTurn();
    state.lightbox.active = true;
    state.lightbox.title = title;
    state.lightbox.src = src;
    state.lightbox.zoom = 1;
    state.lightbox.panX = 0;
    state.lightbox.panY = 0;

    els.lightboxTitle.textContent = title;
    els.lightboxImg.src = src;
    els.lightboxImg.alt = title;
    updateLightboxTransform();

    els.lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    soundSynth.playSketch();
    state.lightbox.active = false;
    els.lightboxModal.classList.remove('active');
  }

  function zoomLightbox(delta) {
    soundSynth.playSketch();
    state.lightbox.zoom = Math.max(0.6, Math.min(4.0, state.lightbox.zoom + delta));
    updateLightboxTransform();
  }

  function resetLightboxZoom() {
    soundSynth.playSketch();
    state.lightbox.zoom = 1;
    state.lightbox.panX = 0;
    state.lightbox.panY = 0;
    updateLightboxTransform();
  }

  function updateLightboxTransform() {
    els.lightboxImgWrapper.style.transform = 
      `translate(${state.lightbox.panX}px, ${state.lightbox.panY}px) scale(${state.lightbox.zoom})`;
    els.lightboxZoomDisplay.textContent = `${Math.round(state.lightbox.zoom * 100)}%`;
  }

  // Expose to window & start on DOM ready
  window.addEventListener('DOMContentLoaded', initApp);

})();
