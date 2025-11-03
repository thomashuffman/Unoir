import React, { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let pipes = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node class - connection points for pipes
    class Node {
      constructor(x, y, isStatic = false) {
        this.x = x;
        this.y = y;
        this.vx = isStatic ? 0 : (Math.random() - 0.5) * 0.3;
        this.vy = isStatic ? 0 : (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 3 + 2;
        this.hue = Math.random() * 60 + 200; // Blue to purple range
        this.opacity = Math.random() * 0.4 + 0.3;
        this.isStatic = isStatic;
        this.connections = [];
      }

      update() {
        if (!this.isStatic) {
          this.x += this.vx;
          this.y += this.vy;

          // Bounce off edges
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

          // Keep within bounds
          this.x = Math.max(0, Math.min(canvas.width, this.x));
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Pipe class - connecting lines between nodes
    class Pipe {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.progress = 0;
        this.width = Math.random() * 2 + 0.5;
        this.hue = (startNode.hue + endNode.hue) / 2;
        this.opacity = Math.min(startNode.opacity, endNode.opacity);
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.growthSpeed = Math.random() * 0.01 + 0.005;
      }

      update() {
        // Grow the pipe
        if (this.progress < 1) {
          this.progress += this.growthSpeed;
        }
        this.pulsePhase += 0.02;
      }

      draw() {
        if (this.progress <= 0) return;

        const currentX = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const currentY = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;

        // Draw the pipe
        ctx.beginPath();
        ctx.moveTo(this.startNode.x, this.startNode.y);
        ctx.lineTo(currentX, currentY);

        const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
        const gradient = ctx.createLinearGradient(
          this.startNode.x,
          this.startNode.y,
          currentX,
          currentY
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 50%, ${this.opacity * 0.3})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 60%, ${this.opacity * pulse * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 50%, ${this.opacity * 0.3})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw expanding circle at growth point
        if (this.progress < 1) {
          ctx.beginPath();
          ctx.arc(currentX, currentY, this.width * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.6})`;
          ctx.fill();
        }
      }

      isComplete() {
        return this.progress >= 1;
      }
    }

    // Initialize nodes
    const nodeCount = 25;
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      nodes.push(new Node(x, y));
    }

    // Function to find nearby nodes
    const findNearbyNodes = (node, maxDistance = 200) => {
      return nodes.filter(other => {
        if (other === node) return false;
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < maxDistance;
      });
    };

    // Function to create new pipe
    const createPipe = () => {
      if (nodes.length < 2) return;
      
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      const nearbyNodes = findNearbyNodes(startNode);
      
      if (nearbyNodes.length > 0) {
        const endNode = nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];
        
        // Check if connection already exists
        const exists = pipes.some(pipe => 
          (pipe.startNode === startNode && pipe.endNode === endNode) ||
          (pipe.startNode === endNode && pipe.endNode === startNode)
        );
        
        if (!exists) {
          pipes.push(new Pipe(startNode, endNode));
        }
      }
    };

    // Create initial pipes
    for (let i = 0; i < 15; i++) {
      createPipe();
    }

    // Periodically create new pipes
    const pipeInterval = setInterval(() => {
      if (pipes.length < 40) {
        createPipe();
      }
      
      // Remove old completed pipes occasionally
      if (pipes.length > 50) {
        pipes = pipes.filter((pipe, index) => index >= pipes.length - 40);
      }
    }, 1000);

    // Animation loop
    const animate = () => {
      // Fade effect for trail
      ctx.fillStyle = 'rgba(17, 24, 39, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw pipes
      pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();
      });

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearInterval(pipeInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
