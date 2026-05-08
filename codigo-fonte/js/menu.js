const wrapper = document.getElementById('wrapper');
const wheel = document.getElementById('wheel');
const toggleBtn = document.getElementById('toggleBtn');
let items = Array.from(document.querySelectorAll('.item'));
const radius = 180;

let currentRotation = 90; 
let isSpinning = false;
let startX = 0;

// Função para checar estado do menu
const isMenuOpen = () => !wrapper.classList.contains('retracted');

toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    wrapper.classList.toggle('retracted');
    toggleBtn.innerText = isMenuOpen() ? 'FECHAR MENU' : 'ABRIR MENU';
});

function updateLayout() {
    items.forEach((item, index) => {
        const angle = (index / (items.length - 1)) * 180;
        const radian = (angle - 180) * (Math.PI / 180);
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        const visualRotation = currentRotation - 90;
        item.style.transform = `translate(${x}px, ${y}px) rotate(${-visualRotation}deg)`;
    });
}

function rotate(delta) {
    currentRotation += delta;
    if (currentRotation > 180) currentRotation = 180;
    if (currentRotation < 0) currentRotation = 0;
    wheel.style.transform = `rotate(${currentRotation - 90}deg)`;
    updateLayout();
}

// Eventos de Mouse
window.addEventListener('mousedown', (e) => {
    if(isMenuOpen() && e.target.closest('.wheel')) {
        isSpinning = true;
        startX = e.clientX;
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isSpinning) return;
    rotate((startX - e.clientX) * 0.3);
    startX = e.clientX;
});

window.addEventListener('mouseup', () => isSpinning = false);

// Scroll do Mouse (Gira menu apenas se aberto e sobre ele)
window.addEventListener('wheel', (e) => {
    if(isMenuOpen() && e.target.closest('.wheel')) {
        e.preventDefault(); 
        rotate(e.deltaY * 0.05);
    }
}, { passive: false });

// Touch Mobile
window.addEventListener('touchstart', (e) => {
    if(isMenuOpen() && e.target.closest('.wheel')) {
        isSpinning = true;
        startX = e.touches[0].clientX;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!isSpinning) return;

    // Bloqueia o scroll da página apenas enquanto gira o menu
    if (e.cancelable) e.preventDefault(); 
    
    rotate((startX - e.touches[0].clientX) * 0.5);
    startX = e.touches[0].clientX;
}, { passive: false });

window.addEventListener('touchend', () => isSpinning = false);

updateLayout();