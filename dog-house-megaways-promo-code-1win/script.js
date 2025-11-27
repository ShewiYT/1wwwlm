// ЕДИНЫЙ script.js ДЛЯ ВСЕХ СТРАНИЦ
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('myModal');
    const modalCodeEl = document.getElementById('modalCode');
    const copiedNotice = document.getElementById('copiedNotice');
    const closeBtn = document.querySelector('.close-modal');
    const goBtn = document.getElementById('goButton');

    // Language switching
    const langRuBtn = document.getElementById('langRu');
    const langEnBtn = document.getElementById('langEn');
    
    // Store original dates
    const originalDates = new Map();
    
    // Set initial language
    let currentLang = localStorage.getItem('preferredLang') || 'ru';
    
    // Save original dates before any translation
    document.querySelectorAll('.validity').forEach(element => {
        const currentText = element.textContent;
        // Extract the date part (everything after the first space)
        const datePart = currentText.split(' ').slice(1).join(' ');
        originalDates.set(element, datePart);
    });
    
    setLanguage(currentLang);
    
    // Event listeners for language buttons
    if (langRuBtn && langEnBtn) {
        langRuBtn.addEventListener('click', () => {
            setLanguage('ru');
            updateActiveButton('ru');
        });
        
        langEnBtn.addEventListener('click', () => {
            setLanguage('en');
            updateActiveButton('en');
        });
    }
    
    function setLanguage(lang) {
        // Update all elements with data attributes
        document.querySelectorAll('[data-ru]').forEach(element => {
            if (element.classList.contains('validity')) {
                return; // Skip validity elements, we handle them separately
            }
            
            if (lang === 'ru') {
                element.textContent = element.getAttribute('data-ru');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });
        
        // Special handling for validity elements
        document.querySelectorAll('.validity').forEach(element => {
            const datePart = originalDates.get(element);
            
            if (lang === 'ru') {
                element.innerHTML = `Действует до ${datePart}`;
            } else {
                element.innerHTML = `Valid until ${datePart}`;
            }
        });
        
        // Special handling for badges with usage counts
        document.querySelectorAll('.badge').forEach(badge => {
            const usageCount = badge.querySelector('.usage-count');
            if (usageCount) {
                const count = usageCount.textContent;
                if (lang === 'ru') {
                    badge.innerHTML = `Промокод использован <span class="usage-count">${count}</span> раз`;
                } else {
                    badge.innerHTML = `Promo code used <span class="usage-count">${count}</span> times`;
                }
            }
        });
        
        // Update meta tags
        if (lang === 'ru') {
            document.title = document.title.replace(/1win Promo Codes/, "Промокоды 1win");
            if (document.querySelector('meta[name="description"]')) {
                document.querySelector('meta[name="description"]').setAttribute('content', 
                    document.querySelector('meta[name="description"]').getAttribute('content'));
            }
        } else {
            document.title = document.title.replace(/Промокоды 1win/, "1win Promo Codes");
            if (document.querySelector('meta[name="description"]')) {
                document.querySelector('meta[name="description"]').setAttribute('content', 
                    document.querySelector('meta[name="description-en"]')?.getAttribute('content') || '1win promo codes');
            }
        }
        
        // Save preference
        localStorage.setItem('preferredLang', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    function updateActiveButton(lang) {
        if (langRuBtn && langEnBtn) {
            if (lang === 'ru') {
                langRuBtn.classList.add('active');
                langEnBtn.classList.remove('active');
            } else {
                langEnBtn.classList.add('active');
                langRuBtn.classList.remove('active');
            }
        }
    }
    
    // Initialize active button
    updateActiveButton(currentLang);

    // Generate random usage counts
    function generateRandomUsage() {
        const usageElements = document.querySelectorAll('.usage-count');
        usageElements.forEach(element => {
            const randomCount = Math.floor(Math.random() * 700) + 200; // Random between 200-899
            element.textContent = randomCount;
        });
    }

    // Mobile touch improvements
    function initMobileOptimizations() {
        // Улучшаем обработку касаний для мобильных
        document.querySelectorAll('.code, .play-btn, .modal-btn').forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
        
        // Предотвращаем зум при двойном тапе
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Initialize mobile optimizations
    initMobileOptimizations();

    // Disable zoom on mobile
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });

    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });

    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });

    // КЛИК ПО ПРОМОКОДУ - РАБОТАЕТ НА ВСЕХ СТРАНИЦАХ
    document.querySelectorAll('.code').forEach(el => {
        el.addEventListener('click', function() {
            const code = this.dataset.code;
            copyToClipboard(code);
            if (modalCodeEl) modalCodeEl.textContent = code;
            openModal();
        });
    });

    // КНОПКА «ИГРАТЬ» - РАБОТАЕТ НА ВСЕХ СТРАНИЦАХ
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const link = this.dataset.link || 'https://lkts.pro/1252ee9b';
            window.open(link, '_blank');
        });
    });

    // КНОПКА «ПЕРЕЙТИ» В МОДАЛКЕ
    if (goBtn) {
        goBtn.addEventListener('click', () => {
            window.open('https://lkts.pro/1252ee9b', '_blank');
        });
    }

    // ЗАКРЫТИЕ МОДАЛКИ
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ФУНКЦИЯ ОТКРЫТИЯ МОДАЛКИ
    function openModal() {
        if (modal) {
            modal.classList.add('show');
            if (copiedNotice) {
                copiedNotice.style.display = 'flex';
            }
        }
    }

    // ФУНКЦИЯ ЗАКРЫТИЯ
    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // КОПИРОВАНИЕ В БУФЕР ОБМЕНА
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Промокод скопирован: ' + text);
        }).catch(err => {
            console.error('Ошибка копирования: ', err);
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('Промокод скопирован (fallback): ' + text);
        });
    }

    // ЗАКРЫТИЕ ПО Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Enhanced animations for background
    function createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer) {
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * -20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }
    }

    // Initialize particles
    createParticles();

    // Add scroll animations for cards
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all promo cards
        document.querySelectorAll('.promo-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    // Initialize scroll animations
    initScrollAnimations();

    // Add ripple effect to buttons
    document.querySelectorAll('.play-btn, .modal-btn, .code').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Generate random usage counts on load
    generateRandomUsage();

    // Автоматическая отправка в поисковые системы для SEO
    function submitToSearchEngines() {
        console.log('🔍 Отправка страницы в поисковые системы...');
        
        // Отправка в Google
        fetch('https://www.google.com/ping?sitemap=https://top2betx.com/sitemap.xml')
            .then(() => console.log('✅ Google: sitemap отправлен'))
            .catch(err => console.error('❌ Google ошибка:', err));
    }

    // Запуск SEO отправки
    setTimeout(submitToSearchEngines, 2000);
});