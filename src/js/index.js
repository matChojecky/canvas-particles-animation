import '../main.css';
import Particle from './Particle/Particle.js';

const particles = [];
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor ='#333';
document.body.appendChild(canvas);
window.addEventListener('resize', () => {

    requestAnimationFrame((e) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});

canvas.addEventListener('click', function(event) {
    const radius = Math.random() * 5 + 5;
    particles.push(new Particle(ctx, event.x, event.y, (Math.random() * 3 + 1), (Math.random() * 3 + 1), radius, Math.random() * 2 + 1))
});


for(let i = 0; i < 30; i++) {
    const radius = Math.random() * 5 + 5;
    const x = Particle.randomCoord(canvas.width, radius);
    const y = Particle.randomCoord(canvas.height, radius);
    particles.push(new Particle(ctx, x, y, Math.random() * 2, Math.random() * 2, radius, Math.random() * 2 + 1))
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, idx) => {
        const remainingParticles = [...particles].splice(idx + 1);
        remainingParticles.forEach(particleB => { Particle.detectCollisionAndDistance(particle, particleB) });
        particle.update();
    });
}

animate();