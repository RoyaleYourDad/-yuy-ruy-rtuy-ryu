// ============================================
// ADVANCED ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParallax();
    initRevealAnimations();
    initHoverEffects();
    initProgressBars();
});

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg-pattern, .auth-image-pattern');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal, .feature-card, .step-card, .lawyer-card, .job-card, .template-card');
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });
}

// Hover effects enhancement
function initHoverEffects() {
    // Magnetic button effect
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
    
    // Card tilt effect
    const cards = document.querySelectorAll('.lawyer-card, .feature-card, .template-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Progress bars animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.rating-bar .fill');
    
    const animateProgress = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.transition = 'width 1s ease';
                    entry.target.style.width = width;
                }, 100);
                animateProgress.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => animateProgress.observe(bar));
}

// Stagger animation for lists
function staggerAnimation(elements, delay = 100) {
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }, index * delay);
    });
}

// Number counter animation with easing
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuart)
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * ease);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Smooth scroll to element
function smoothScrollTo(target, offset = 80) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
        
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Loading skeleton
function showSkeleton(container, count = 3) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        skeleton.style.cssText = `
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite;
            border-radius: 8px;
            height: 200px;
            margin-bottom: 1rem;
        `;
        container.appendChild(skeleton);
    }
    
    // Add skeleton animation
    if (!document.getElementById('skeletonStyles')) {
        const style = document.createElement('style');
        style.id = 'skeletonStyles';
        style.textContent = `
            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Hide skeleton and show content
function hideSkeleton(container) {
    const skeletons = container.querySelectorAll('.skeleton');
    skeletons.forEach(s => {
        s.style.opacity = '0';
        setTimeout(() => s.remove(), 300);
    });
}

// Page transition
function pageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary);
        z-index: 9999;
        transform: translateY(100%);
        transition: transform 0.5s ease;
    `;
    
    document.body.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.style.transform = 'translateY(0)';
    });
    
    // Execute callback and animate out
    setTimeout(() => {
        if (callback) callback();
        
        overlay.style.transform = 'translateY(-100%)';
        
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }, 500);
}

// Confetti effect for success actions
function showConfetti(element) {
    const colors = ['#1e3a8a', '#d4af37', '#10b981', '#f59e0b'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = centerX;
        let y = centerY;
        let opacity = 1;
        
        function animate() {
            x += vx * 0.02;
            y += vy * 0.02 + 2;
            opacity -= 0.02;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        requestAnimationFrame(animate);
    }
}

// Intersection Observer for lazy loading images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Text scramble effect (for headings)
function textScramble(element, finalText, duration = 2000) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const totalFrames = duration / 16;
    
    function update() {
        let output = '';
        const progress = frame / totalFrames;
        
        for (let i = 0; i < finalText.length; i++) {
            if (i < finalText.length * progress) {
                output += finalText[i];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        element.textContent = output;
        frame++;
        
        if (frame <= totalFrames) {
            requestAnimationFrame(update);
        } else {
            element.textContent = finalText;
        }
    }
    
    update();
}

// Magnetic cursor effect
function initMagneticCursor() {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'magnetic-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Hover effects
    document.querySelectorAll('a, button, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.background = 'rgba(30, 58, 138, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'transparent';
        });
    });
}

// Scroll velocity detection
function initScrollVelocity() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const velocity = window.scrollY - lastScrollY;
                
                // Add velocity-based effects
                if (Math.abs(velocity) > 50) {
                    document.body.classList.add('scrolling-fast');
                } else {
                    document.body.classList.remove('scrolling-fast');
                }
                
                lastScrollY = window.scrollY;
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Initialize all animations on load
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initRevealAnimations();
    initHoverEffects();
    initProgressBars();
    initLazyLoading();
    initScrollVelocity();
    
    // Uncomment to enable magnetic cursor (may affect performance)
    // initMagneticCursor();
});

// Export functions for global access
window.animations = {
    showSkeleton,
    hideSkeleton,
    pageTransition,
    showConfetti,
    textScramble,
    animateNumber,
    staggerAnimation,
    smoothScrollTo
};
