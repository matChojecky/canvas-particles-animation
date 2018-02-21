export default class Particle {
    static randomColor() {
        let color = '#';
        for(let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 15).toString(16);
        }
        return color;
    }
    static randomCoord(maxValue, particleRadius) {
        return Math.max(Math.min(Math.random() * maxValue, maxValue - 2*particleRadius), 2*particleRadius);
    }
    static rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }
    static handleCollistion(angle, m1, m2, velocityA, velocityB) {
        const u1 = Particle.rotate(velocityA, angle);
        const u2 = Particle.rotate(velocityB, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = Particle.rotate(v1, -angle);
        const vFinal2 = Particle.rotate(v2, -angle);
        const deltaRadius = Math.random() - 0.5;
        const newDirection = {
            velocityA: {
                xTurn: Math.sign(vFinal1.x),
                dx: Math.abs(vFinal1.x),
                yTurn: Math.sign(vFinal1.y),
                dy: Math.abs(vFinal1.y),
                deltaRadius
            },
            velocityB: {
                xTurn: Math.sign(vFinal2.x),
                dx: Math.abs(vFinal2.x),
                yTurn: Math.sign(vFinal2.y),
                dy: Math.abs(vFinal2.y),
                deltaRadius: -deltaRadius
            }
        };
        return newDirection;
    }
    static detectCollisionAndDistance(particleA, particleB) {
        const xDist = Math.abs(particleA.x - particleB.x);
        const yDist = Math.abs(particleA.y - particleB.y);

        const distance = Math.hypot(xDist, yDist) - particleA.radius - particleB.radius;
        if(distance < 1) {
            const velocityA = {x: particleA.dx * particleA.xTurn, y: particleA.dy * particleA.yTurn};
            const velocityB = {x: particleB.dx * particleB.xTurn, y: particleB.dy * particleB.yTurn};
            const newDirection = Particle.handleCollistion(-Math.atan2(particleB.y - particleA.y, particleB.x - particleA.x), particleA.radius, particleB.radius, velocityA, velocityB);
            particleA.dx = newDirection.velocityA.dx;
            particleA.dy = newDirection.velocityA.dy;
            particleA.xTurn = newDirection.velocityA.xTurn;
            particleA.yTurn = newDirection.velocityA.yTurn;
            particleA.radius += newDirection.velocityA.deltaRadius;
            particleB.dx = newDirection.velocityB.dx;
            particleB.dy = newDirection.velocityB.dy;
            particleB.xTurn = newDirection.velocityB.xTurn;
            particleB.yTurn = newDirection.velocityB.yTurn;
            particleA.radius += newDirection.velocityB.deltaRadius;
        }


        if(distance < 250) {
            const ctx = particleA.ctx;
            const gradient = ctx.createLinearGradient(particleA.x, particleA.y, particleB.x, particleB.y);
            gradient.addColorStop(0, particleA.color);
            gradient.addColorStop(1, particleB.color);
            ctx.save();
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 1 - (distance/250);
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.lineWidth = (1 - (distance/250)) * Math.min(Math.max(particleA.radius, particleB.radius), 5);
            ctx.stroke();
            ctx.restore()
        }
    }


    constructor(ctx, x, y, dx, dy, radius, lineWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.xTurn = [-1, 1][Math.round(Math.random())];
        this.yTurn = [-1, 1][Math.round(Math.random())];;
        this.ctx = ctx;
        this.lineWidth = lineWidth;
        this.friction = 0.9999999;
        this.color = this.constructor.randomColor();
        this.draw();
    }

    draw() {
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = '#333';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
    }

    update() {
        this.x += (this.xTurn * this.dx);
        this.y += (this.yTurn * this.dy);
        this.checkForFrameHit();
        this.draw();
    }

    checkForFrameHit() {
        if(this.x + this.dx + this.radius + this.lineWidth > window.innerWidth || this.x - this.dx - this.radius - this.lineWidth < 0) {
            this.xTurn = -this.xTurn;
            this.dx *= 0.85;
            this.dy *= 0.9;
        }
        if(this.y + this.dy + this.radius + this.lineWidth > window.innerHeight || this.y - this.dy - this.radius - this.lineWidth< 0) {
            this.yTurn = -this.yTurn;
            this.dy *= 0.85;
            this.dx *= 0.9;
        }
        this.dx += 0.00166666666;
        this.dy += 0.00166666666;
    }
}