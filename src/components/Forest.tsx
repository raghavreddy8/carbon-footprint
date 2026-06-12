import React, { useRef, useEffect } from 'react';
import { type Swap } from '../data/swaps';
import { NeoPanel } from './UI/NeoPanel';

interface ForestProps {
  activeSwaps: Swap[];
  themeState: 'healthy' | 'neutral' | 'polluted';
}

export const Forest: React.FC<ForestProps> = ({ activeSwaps, themeState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Ultra-high resolution canvas (1200x540 internal dimensions)
    canvas.width = 1200;
    canvas.height = 540;

    // Wind particles
    const leafCount = 45;
    const particles = Array.from({ length: leafCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 100),
      speedX: 0.8 + Math.random() * 2.0,
      speedY: 1.2 + Math.random() * 2.5,
      size: 6 + Math.random() * 8,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.08
    }));

    // Wind currents lines
    const windCurrents = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: 50 + Math.random() * 200,
      length: 100 + Math.random() * 150,
      speed: 1.5 + Math.random() * 2
    }));

    const getHashPosition = (str: string, maxVal: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash) % maxVal;
    };

    const trees = activeSwaps.map((swap) => {
      const x = 80 + getHashPosition(swap.id, canvas.width - 160);
      const sizeMultiplier = 0.85 + (getHashPosition(swap.id + '_size', 35) / 100);
      
      let type: 'pine' | 'apple' | 'glowing' | 'shrub' = 'shrub';
      if (swap.category === 'transport') type = 'pine';
      else if (swap.category === 'food') type = 'apple';
      else if (swap.category === 'home') type = 'glowing';

      return {
        x,
        y: canvas.height - 65, // ground level
        type,
        size: 70 * sizeMultiplier // Large scale trees for high-res
      };
    });

    trees.sort((a, b) => a.x - b.x);

    let frame = 0;
    const cloud1 = { x: 150, y: 80, speed: 0.35 };
    const cloud2 = { x: 750, y: 120, speed: 0.18 };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Color Palette ---
      let skyColor = '#BFDBFE'; // Light blue
      let groundColor = '#34D399'; // Emerald
      let trunkColor = '#78350F';
      let leafGreen = '#059669';
      let darkLeafGreen = '#047857';

      if (themeState === 'neutral') {
        skyColor = '#FEF3C7'; // Sand
        groundColor = '#FBBF24'; // Yellow ground
        leafGreen = '#65A30D';
        darkLeafGreen = '#4D7C0F';
      } else if (themeState === 'polluted') {
        skyColor = '#9CA3AF'; // Industrial gray
        groundColor = '#8E4A23'; // Muddy
        leafGreen = '#92400E';
        darkLeafGreen = '#78350F';
      }

      // 1. Draw Sky
      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Pulsing Sun
      if (themeState === 'healthy') {
        const pulse = Math.sin(frame * 0.05) * 2;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(1020, 110, 42 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Rays
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6 + (frame * 0.0035);
          const startX = 1020 + Math.cos(angle) * (52 + pulse);
          const startY = 110 + Math.sin(angle) * (52 + pulse);
          const endX = 1020 + Math.cos(angle) * (66 + pulse);
          const endY = 110 + Math.sin(angle) * (66 + pulse);
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
        }
        ctx.stroke();
      } else if (themeState === 'polluted') {
        // Red angry sun through toxic bands
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(1020, 120, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const smogX = (frame * 0.6) % 150 - 75;
        ctx.moveTo(1020 + smogX - 45, 105); ctx.lineTo(1020 + smogX + 45, 105);
        ctx.moveTo(1020 - smogX - 40, 128); ctx.lineTo(1020 - smogX + 40, 128);
        ctx.stroke();
      }

      // 3. Wind Currents (Horizontal Sky Drift Lines)
      if (themeState === 'healthy' || themeState === 'neutral') {
        ctx.strokeStyle = themeState === 'healthy' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        windCurrents.forEach((w) => {
          w.x = (w.x + w.speed) % (canvas.width + w.length);
          ctx.beginPath();
          ctx.moveTo(w.x - w.length, w.y);
          ctx.quadraticCurveTo(w.x - w.length / 2, w.y + Math.sin(frame * 0.02 + w.x) * 10, w.x, w.y);
          ctx.stroke();
        });
      }

      // 4. Draw Clouds
      const drawCloud = (x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 5;

        // Scale shapes for high-res
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.arc(x + 30, y - 12, 36, 0, Math.PI * 2);
        ctx.arc(x + 66, y, 30, 0, Math.PI * 2);
        ctx.rect(x - 15, y - 6, 96, 36);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 30, Math.PI * 0.8, Math.PI * 1.8);
        ctx.arc(x + 30, y - 12, 36, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(x + 66, y, 30, Math.PI * 1.2, Math.PI * 2.2);
        ctx.moveTo(x - 30, y + 30);
        ctx.lineTo(x + 96, y + 30);
        ctx.stroke();
      };

      let cloudColor = '#FFFFFF';
      if (themeState === 'neutral') cloudColor = '#FFFDF0';
      else if (themeState === 'polluted') cloudColor = '#4B5563';

      cloud1.x = (cloud1.x + cloud1.speed) % (canvas.width + 150);
      cloud2.x = (cloud2.x + cloud2.speed) % (canvas.width + 150);

      drawCloud(cloud1.x - 90, cloud1.y, cloudColor);
      drawCloud(cloud2.x - 90, cloud2.y, cloudColor);

      // 5. Flying Entities (Flapping Wings / Drone Laser Scanning)
      if (themeState === 'healthy' || themeState === 'neutral') {
        const birdX = (frame * 1.5) % (canvas.width + 150) - 75;
        const birdY = 90 + Math.sin(frame * 0.045) * 20;
        const wingsDown = Math.floor(frame / 6) % 2 === 0;

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (wingsDown) {
          ctx.moveTo(birdX - 18, birdY - 8);
          ctx.quadraticCurveTo(birdX, birdY + 8, birdX + 18, birdY - 8);
        } else {
          ctx.moveTo(birdX - 18, birdY + 8);
          ctx.quadraticCurveTo(birdX - 9, birdY - 6, birdX, birdY + 3);
          ctx.quadraticCurveTo(birdX + 9, birdY - 6, birdX + 18, birdY + 8);
        }
        ctx.stroke();
      } else {
        const droneX = canvas.width - (frame * 1.1) % (canvas.width + 150) - 75;
        const droneY = 110 + Math.sin(frame * 0.035) * 12;

        // Laser Scan
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(droneX, droneY + 8);
        ctx.lineTo(droneX + Math.sin(frame * 0.06) * 70, canvas.height - 65);
        ctx.stroke();

        // Drone
        ctx.fillStyle = '#374151';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(droneX, droneY, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(droneX - 18, droneY); ctx.lineTo(droneX + 18, droneY);
        ctx.stroke();
        if (frame % 20 < 10) {
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.arc(droneX, droneY - 3, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Draw Ground Base
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, canvas.height - 65, canvas.width, 65);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 65);
      ctx.lineTo(canvas.width, canvas.height - 65);
      ctx.stroke();

      // Swaying Grass
      ctx.lineWidth = 4;
      ctx.strokeStyle = themeState === 'polluted' ? '#78350F' : '#047857';
      ctx.beginPath();
      for (let i = 40; i < canvas.width; i += 90) {
        const swayOffset = Math.sin(frame * 0.045 + i) * 3;
        const offset = (i % 7) * 5;
        ctx.moveTo(i + offset, canvas.height - 45);
        ctx.lineTo(i + offset + swayOffset, canvas.height - 54);
        ctx.moveTo(i + offset + 8, canvas.height - 45);
        ctx.lineTo(i + offset + 8 + swayOffset, canvas.height - 58);
      }
      ctx.stroke();

      // 7. Draw Symmetrical Water Channel / Pond
      if (themeState === 'healthy' || themeState === 'neutral') {
        ctx.fillStyle = '#3B82F6';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(50, canvas.height - 35, 160, 35);
        ctx.fill();
        ctx.stroke();

        // Ripples inside water channel
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const ripOffset = Math.sin(frame * 0.03) * 6;
        ctx.moveTo(70 + ripOffset, canvas.height - 22);
        ctx.lineTo(120 + ripOffset, canvas.height - 22);
        ctx.moveTo(140 - ripOffset, canvas.height - 12);
        ctx.lineTo(190 - ripOffset, canvas.height - 12);
        ctx.stroke();
      }

      // 8. Draw Virtual Trees (High-Res)
      trees.forEach((tree) => {
        const sway = Math.sin(frame * 0.038 + tree.x) * 3;

        // Trunk
        ctx.fillStyle = trunkColor;
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(tree.x - 7, tree.y - tree.size - 6, 14, tree.size + 12);
        ctx.fill();
        ctx.stroke();

        if (tree.type === 'pine') {
          ctx.fillStyle = leafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 5;

          const drawTriangle = (bottomY: number, size: number) => {
            ctx.beginPath();
            ctx.moveTo(tree.x + sway, bottomY - size);
            ctx.lineTo(tree.x - size * 0.9, bottomY);
            ctx.lineTo(tree.x + size * 0.9, bottomY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          };

          drawTriangle(tree.y - 25, tree.size * 0.85);
          drawTriangle(tree.y - 50, tree.size * 0.68);
          drawTriangle(tree.y - 75, tree.size * 0.52);
        } else if (tree.type === 'apple') {
          ctx.fillStyle = leafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 5;

          ctx.beginPath();
          ctx.arc(tree.x + sway, tree.y - tree.size - 18, tree.size * 0.72, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Fruit Apples
          if (themeState === 'healthy') {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(tree.x + sway - 15, tree.y - tree.size - 25, 6, 0, Math.PI * 2);
            ctx.arc(tree.x + sway + 15, tree.y - tree.size - 15, 6, 0, Math.PI * 2);
            ctx.arc(tree.x + sway, tree.y - tree.size - 4, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tree.type === 'glowing') {
          ctx.fillStyle = themeState === 'healthy' ? '#6EE7B7' : themeState === 'neutral' ? '#FDE047' : '#F59E0B';
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 5;

          ctx.beginPath();
          const cx = tree.x + sway;
          const cy = tree.y - tree.size - 18;
          const r = tree.size * 0.72;
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Sparkles
          if (themeState === 'healthy' && frame % 16 < 8) {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(cx - 3, cy - 3, 6, 6);
          }
        } else {
          // Shrub
          ctx.fillStyle = darkLeafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 5;

          ctx.beginPath();
          ctx.arc(tree.x - 18 + sway, tree.y - 18, 20, 0, Math.PI * 2);
          ctx.arc(tree.x + 18 + sway, tree.y - 18, 20, 0, Math.PI * 2);
          ctx.arc(tree.x + sway, tree.y - 30, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });

      // 9. Falling Leaf Particles / Toxic Ash Rain
      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(frame * 0.025 + p.x) * 0.4;
        p.y += p.speedY;
        p.angle += p.spin;

        if (p.y > canvas.height - 60) {
          p.y = -15;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) {
          p.x = -15;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (themeState === 'healthy') {
          // Leaf
          ctx.fillStyle = '#34D399';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (themeState === 'neutral') {
          // Yellow leaves
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Toxic Acid Rain
          ctx.strokeStyle = 'rgba(156, 163, 175, 0.45)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-15, -30);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 10. Bunny Jumping
      if (themeState === 'healthy' && activeSwaps.length > 1) {
        const bunnyX = (frame * 0.8) % (canvas.width + 150) - 75;
        const bunnyY = canvas.height - 65 - Math.abs(Math.sin(frame * 0.08) * 22);

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 3.5;
        
        ctx.beginPath();
        ctx.arc(bunnyX, bunnyY, 13, 0, Math.PI * 2);
        ctx.arc(bunnyX + 11, bunnyY - 7, 8, 0, Math.PI * 2);
        ctx.rect(bunnyX + 7, bunnyY - 22, 3.5, 12);
        ctx.rect(bunnyX + 11, bunnyY - 22, 3.5, 12);
        ctx.fill();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSwaps, themeState]);

  return (
    <NeoPanel title="Offset Sandbox (Virtual Forest)" backgroundColor="#FFF">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            height: '240px', // Shrink height to balance layout
            border: '3px solid #111827',
            borderRadius: '4px',
            backgroundColor: '#BFDBFE',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
          }}
        />
        <div
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            marginTop: '10px',
            color: '#666',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}
        >
          {activeSwaps.length === 0
            ? '🌳 No offset trees planted yet. Commit to swaps to plant trees!'
            : `🌳 planted ${activeSwaps.length} custom offset tree${activeSwaps.length > 1 ? 's' : ''}!`}
        </div>
      </div>
    </NeoPanel>
  );
};
