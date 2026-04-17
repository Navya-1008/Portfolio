// Scramble Text Effect (One-time on load)
const scrambleElement = document.getElementById('glitch-name');
const targetText = "NAVYA B V";
const chars = "!<>-_\\/[]{}—=+*^?#________";
let frame = 0;

function scramble() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = targetText.length; i < n; i++) {
        const char = targetText[i];
        if (char === ' ') {
            output += ' ';
            complete++;
            continue;
        }

        let currentBit = '';
        if (frame > i * 5) {
            currentBit = char;
            complete++;
        } else {
            currentBit = chars[Math.floor(Math.random() * chars.length)];
        }

        // Indices 6-8 correspond to "B V" in "NAVYA B V"
        if (i >= 6) {
            output += `<span class="accent-text">${currentBit}</span>`;
        } else {
            output += currentBit;
        }
    }

    scrambleElement.innerHTML = output;

    if (complete < targetText.length) {
        frame++;
        requestAnimationFrame(scramble);
    }
}

// Particle / Bubble Background System
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 60;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = 'rgba(255, 77, 0, 0.4)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x -= directionX * force * 5;
            this.y -= directionY * force * 5;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

// Intersection Observer for Reveal Animations & Nav Highlight
const observerOptions = { threshold: 0.2 };
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, main > section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Reveal animation
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Nav highlight
            const id = entry.target.getAttribute('id');
            if (id) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section, .hero').forEach(section => {
    observer.observe(section);
});

// Flash Card Project Carousel Logic
let currentProjectIndex = 0;
const projects = document.querySelectorAll('.flash-card');

function showProject(index) {
    projects.forEach(p => p.classList.remove('active'));
    
    if (index >= projects.length) currentProjectIndex = 0;
    if (index < 0) currentProjectIndex = projects.length - 1;
    
    projects[currentProjectIndex].classList.add('active');
}

window.nextProject = function() {
    currentProjectIndex++;
    showProject(currentProjectIndex);
}

window.prevProject = function() {
    currentProjectIndex--;
    showProject(currentProjectIndex);
}

// Card Hover Glow Effect
document.querySelectorAll('.card, .flash-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Start everything
initParticles();
animate();
scramble();
