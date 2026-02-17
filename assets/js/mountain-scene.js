/**
 * Mountain Scene - Animated Parallax Mountain Landscape
 * Creates a stunning animated mountain scene in the hero section
 * with parallax layers, floating clouds, twinkling stars, and particle effects
 */

export function initMountainScene() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create mountain scene container
    const scene = document.createElement('div');
    scene.className = 'mountain-scene';
    scene.setAttribute('aria-hidden', 'true');

    // Build layers
    scene.innerHTML = `
        <!-- Stars layer (dark mode only) -->
        <div class="mtn-layer mtn-stars"></div>

        <!-- Aurora / Northern lights effect -->
        <div class="mtn-layer mtn-aurora">
            <div class="aurora-band aurora-band-1"></div>
            <div class="aurora-band aurora-band-2"></div>
            <div class="aurora-band aurora-band-3"></div>
        </div>

        <!-- Clouds layer -->
        <div class="mtn-layer mtn-clouds">
            <div class="cloud cloud-1">
                <svg viewBox="0 0 200 60" fill="rgba(255,255,255,0.06)"><ellipse cx="70" cy="35" rx="70" ry="25"/><ellipse cx="120" cy="30" rx="50" ry="20"/><ellipse cx="45" cy="40" rx="40" ry="18"/></svg>
            </div>
            <div class="cloud cloud-2">
                <svg viewBox="0 0 180 50" fill="rgba(255,255,255,0.04)"><ellipse cx="60" cy="30" rx="55" ry="22"/><ellipse cx="110" cy="25" rx="45" ry="18"/><ellipse cx="35" cy="35" rx="35" ry="15"/></svg>
            </div>
            <div class="cloud cloud-3">
                <svg viewBox="0 0 160 45" fill="rgba(255,255,255,0.05)"><ellipse cx="55" cy="28" rx="50" ry="20"/><ellipse cx="100" cy="22" rx="40" ry="16"/></svg>
            </div>
        </div>

        <!-- Far mountains (darkest, slowest parallax) -->
        <svg class="mtn-layer mtn-far" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
            <defs>
                <linearGradient id="mtn-far-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
                    <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
                </linearGradient>
            </defs>
            <path d="M0,400 L0,280 Q80,200 160,240 Q240,180 360,210 Q440,150 520,190 Q600,130 720,170 Q800,120 900,160 Q960,110 1060,150 Q1140,100 1200,140 Q1280,90 1360,130 Q1400,110 1440,120 L1440,400 Z" fill="url(#mtn-far-grad)"/>
        </svg>

        <!-- Mid mountains -->
        <svg class="mtn-layer mtn-mid" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
            <defs>
                <linearGradient id="mtn-mid-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
                    <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
                </linearGradient>
            </defs>
            <path d="M0,400 L0,310 Q100,240 200,280 Q300,220 420,260 Q500,200 620,250 Q720,190 840,240 Q920,180 1020,220 Q1120,170 1220,210 Q1300,160 1380,200 L1440,180 L1440,400 Z" fill="url(#mtn-mid-grad)"/>
            <!-- Snow caps on mid mountains -->
            <path d="M620,250 Q610,235 600,240 Q610,230 620,235 Q630,225 640,235 Q650,230 660,240 Q650,235 640,240 Z" fill="rgba(255,255,255,0.2)"/>
            <path d="M1020,220 Q1010,205 1000,210 Q1010,200 1020,205 Q1030,195 1040,205 Q1050,200 1060,210 Q1050,205 1040,210 Z" fill="rgba(255,255,255,0.2)"/>
        </svg>

        <!-- Near mountains (lightest, fastest parallax) -->
        <svg class="mtn-layer mtn-near" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice">
            <defs>
                <linearGradient id="mtn-near-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
                    <stop offset="80%" stop-color="rgba(255,255,255,0.01)"/>
                </linearGradient>
            </defs>
            <path d="M0,400 L0,340 Q60,290 140,320 Q220,270 340,310 Q420,260 540,300 Q620,250 740,290 Q820,240 940,280 Q1020,230 1140,270 Q1220,220 1340,260 Q1400,240 1440,250 L1440,400 Z" fill="url(#mtn-near-grad)"/>
        </svg>

        <!-- Pine trees silhouette -->
        <div class="mtn-layer mtn-trees">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="xMidYMax slice">
                <defs>
                    <linearGradient id="tree-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
                        <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
                    </linearGradient>
                </defs>
                <!-- Tree group 1 -->
                <path d="M50,120 L50,85 L35,85 L55,60 L42,60 L60,35 L48,35 L65,10 L82,35 L70,35 L88,60 L75,60 L95,85 L80,85 L80,120 Z" fill="url(#tree-grad)"/>
                <path d="M120,120 L120,95 L110,95 L125,75 L115,75 L130,55 L120,55 L135,30 L150,55 L140,55 L155,75 L145,75 L160,95 L150,95 L150,120 Z" fill="url(#tree-grad)"/>
                <path d="M200,120 L200,90 L188,90 L205,65 L193,65 L210,40 L198,40 L215,15 L232,40 L220,40 L237,65 L225,65 L242,90 L230,90 L230,120 Z" fill="url(#tree-grad)"/>
                <!-- Tree group 2 -->
                <path d="M400,120 L400,88 L388,88 L405,63 L393,63 L410,38 L398,38 L415,13 L432,38 L420,38 L437,63 L425,63 L442,88 L430,88 L430,120 Z" fill="url(#tree-grad)"/>
                <path d="M470,120 L470,95 L462,95 L475,78 L467,78 L480,58 L472,58 L485,38 L498,58 L490,58 L503,78 L495,78 L508,95 L500,95 L500,120 Z" fill="url(#tree-grad)"/>
                <!-- Tree group 3 -->
                <path d="M700,120 L700,92 L690,92 L705,72 L695,72 L710,48 L700,48 L715,20 L730,48 L720,48 L735,72 L725,72 L740,92 L730,92 L730,120 Z" fill="url(#tree-grad)"/>
                <path d="M760,120 L760,98 L752,98 L765,80 L757,80 L770,60 L762,60 L775,38 L788,60 L780,60 L793,80 L785,80 L798,98 L790,98 L790,120 Z" fill="url(#tree-grad)"/>
                <!-- Tree group 4 -->
                <path d="M1000,120 L1000,88 L988,88 L1005,63 L993,63 L1010,38 L998,38 L1015,13 L1032,38 L1020,38 L1037,63 L1025,63 L1042,88 L1030,88 L1030,120 Z" fill="url(#tree-grad)"/>
                <path d="M1070,120 L1070,95 L1060,95 L1075,72 L1065,72 L1080,48 L1070,48 L1085,23 L1100,48 L1090,48 L1105,72 L1095,72 L1110,95 L1100,95 L1100,120 Z" fill="url(#tree-grad)"/>
                <!-- Tree group 5 -->
                <path d="M1250,120 L1250,90 L1240,90 L1255,68 L1245,68 L1260,43 L1250,43 L1265,18 L1280,43 L1270,43 L1285,68 L1275,68 L1290,90 L1280,90 L1280,120 Z" fill="url(#tree-grad)"/>
                <path d="M1320,120 L1320,96 L1312,96 L1325,78 L1317,78 L1330,58 L1322,58 L1335,35 L1348,58 L1340,58 L1353,78 L1345,78 L1358,96 L1350,96 L1350,120 Z" fill="url(#tree-grad)"/>
                <path d="M1380,120 L1380,100 L1374,100 L1385,85 L1379,85 L1390,68 L1384,68 L1395,50 L1406,68 L1400,68 L1411,85 L1405,85 L1416,100 L1410,100 L1410,120 Z" fill="url(#tree-grad)"/>
            </svg>
        </div>

        <!-- Floating particles -->
        <div class="mtn-layer mtn-particles" id="mtn-particles"></div>
    `;

    // Insert scene before hero content
    const heroContent = hero.querySelector('.hero-content');
    hero.insertBefore(scene, heroContent);

    // Generate stars for dark mode
    const starsContainer = scene.querySelector('.mtn-stars');
    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 70}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        const size = 1 + Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        starsContainer.appendChild(star);
    }

    // Generate floating particles (fireflies/dust)
    if (!prefersReducedMotion) {
        const particlesContainer = scene.querySelector('#mtn-particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'mtn-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${40 + Math.random() * 50}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 8}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // Parallax scroll effect
    if (!prefersReducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = hero.offsetHeight;
                    if (scrollY < heroHeight * 1.5) {
                        const far = scene.querySelector('.mtn-far');
                        const mid = scene.querySelector('.mtn-mid');
                        const near = scene.querySelector('.mtn-near');
                        const trees = scene.querySelector('.mtn-trees');
                        const clouds = scene.querySelector('.mtn-clouds');

                        if (far) far.style.transform = `translateY(${scrollY * 0.05}px)`;
                        if (mid) mid.style.transform = `translateY(${scrollY * 0.1}px)`;
                        if (near) near.style.transform = `translateY(${scrollY * 0.15}px)`;
                        if (trees) trees.style.transform = `translateY(${scrollY * 0.2}px)`;
                        if (clouds) clouds.style.transform = `translateY(${scrollY * 0.03}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}
