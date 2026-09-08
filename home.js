document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DATA: POST BEARERS INFORMATION
    // ==========================================
    const postBearers = [
        { name: "NAME 1", post: "PRESIDENT", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 2", post: "VICE PRESIDENT", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 3", post: "CONVENOR", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 4", post: "TREASURER", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 5", post: "GENERAL SECRETARY", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 6", post: "MUSIC DIRECTOR", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 7", post: "EVENT HEAD", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 8", post: "PR HEAD", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 9", post: "TECH HEAD", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 10", post: "LOGISTICS HEAD", image: "", instagram: "#", whatsapp: "#" },
        { name: "NAME 11", post: "CREATIVE HEAD", image: "", instagram: "#", whatsapp: "#" }
    ];

    // ==========================================
    // 2. DYNAMICALLY RENDER MEMBER CARDS
    // ==========================================
    const teamGrid = document.getElementById("teamGrid");

    if (teamGrid) {
        teamGrid.innerHTML = postBearers.map(member => {
            const imageContent = member.image 
                ? `<img src="${member.image}" alt="${member.name}" class="member-photo">`
                : `<div class="default-avatar">
                     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                   </div>`;

            return `
                <div class="member-card reveal">
                    <div class="mobile-socials">
                        <a href="${member.instagram}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="${member.whatsapp}" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    </div>
                    
                    <div class="profile-pic-container">
                        ${imageContent}
                        <div class="social-overlay">
                            <a href="${member.instagram}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                            <a href="${member.whatsapp}" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                        </div>
                    </div>
                    
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p>${member.post}</p>
                    </div>
                </div>
            `;
        }).join("");
    }

    // ==========================================
    // 3. SCROLL REVEAL ANIMATION
    // ==========================================
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.15
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });

    // ==========================================
    // 4. OUR EVENTS SLIDER (3s NORMAL / 10s HOVER / VIEWPORT DETECTION)
    // ==========================================
    const eventsSection = document.getElementById('events');
    const eventsSlider = document.getElementById('eventsSlider');
    const eventsDotsContainer = document.getElementById('eventsDots');

    if (eventsSlider && eventsDotsContainer && eventsSection) {
        const eventCards = eventsSlider.querySelectorAll('.event-card');
        const totalEvents = eventCards.length;
        let currentEventIndex = 0;
        let eventsInterval = null;
        let isHovered = false;
        let isSectionVisible = false;

        // Dynamically create dots
        eventCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToEvent(index));
            eventsDotsContainer.appendChild(dot);
        });

        const dots = eventsDotsContainer.querySelectorAll('.dot');

        const updateDots = (index) => {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        };

        const goToEvent = (index) => {
            currentEventIndex = index;
            const cardWidth = eventsSlider.clientWidth;
            eventsSlider.scrollTo({
                left: cardWidth * currentEventIndex,
                behavior: 'smooth'
            });
            updateDots(currentEventIndex);
        };

        const nextEvent = () => {
            currentEventIndex = (currentEventIndex + 1) % totalEvents;
            goToEvent(currentEventIndex);
        };

        const startEventsAutoScroll = () => {
            stopEventsAutoScroll();
            if (!isSectionVisible) return; // Only run if in viewport
            const delay = isHovered ? 10000 : 3000; // 10s on hover, 3s default
            eventsInterval = setInterval(nextEvent, delay);
        };

        const stopEventsAutoScroll = () => {
            if (eventsInterval) {
                clearInterval(eventsInterval);
                eventsInterval = null;
            }
        };

        // Hover listeners (10s on hover, 3s on leave)
        eventsSlider.addEventListener('mouseenter', () => {
            isHovered = true;
            startEventsAutoScroll();
        });

        eventsSlider.addEventListener('mouseleave', () => {
            isHovered = false;
            startEventsAutoScroll();
        });

        // Intersection Observer: Only start auto-scroll when Events section is visible
        const eventsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSectionVisible = entry.isIntersecting;
                if (isSectionVisible) {
                    startEventsAutoScroll();
                } else {
                    stopEventsAutoScroll();
                }
            });
        }, { threshold: 0.3 });

        eventsObserver.observe(eventsSection);

        // Sync dots manually if scrolled by touch swipe
        eventsSlider.addEventListener('scroll', () => {
            const cardWidth = eventsSlider.clientWidth;
            const calculatedIndex = Math.round(eventsSlider.scrollLeft / cardWidth);
            if (calculatedIndex !== currentEventIndex && calculatedIndex >= 0 && calculatedIndex < totalEvents) {
                currentEventIndex = calculatedIndex;
                updateDots(currentEventIndex);
            }
        });
    }

    // ==========================================
    // 5. AUTO-SCROLL SLIDER FOR MOBILE TEAM GRID (VIEWPORT TRIGGERED ONLY)
    // ==========================================
    let autoScrollInterval = null;
    let isTeamSectionVisible = false;

    const startAutoScroll = () => {
        if (window.innerWidth <= 768 && !autoScrollInterval && teamGrid && isTeamSectionVisible) {
            autoScrollInterval = setInterval(() => {
                const maxScrollLeft = teamGrid.scrollWidth - teamGrid.clientWidth;
                
                if (teamGrid.scrollLeft >= maxScrollLeft - 5) {
                    teamGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    teamGrid.scrollBy({ left: 185, behavior: 'smooth' });
                }
            }, 2500);
        }
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    };

    const teamSection = document.getElementById("team");
    if (teamSection) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isTeamSectionVisible = entry.isIntersecting;
                if (isTeamSectionVisible) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            });
        }, { threshold: 0.2 });

        teamObserver.observe(teamSection);
    }

    if (teamGrid) {
        teamGrid.addEventListener('touchstart', stopAutoScroll, { passive: true });
        teamGrid.addEventListener('touchend', () => setTimeout(() => {
            if (isTeamSectionVisible) startAutoScroll();
        }, 4000));
        teamGrid.addEventListener('mouseenter', stopAutoScroll);
        teamGrid.addEventListener('mouseleave', () => {
            if (isTeamSectionVisible) startAutoScroll();
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            stopAutoScroll();
        } else if (isTeamSectionVisible) {
            startAutoScroll();
        }
    });
});