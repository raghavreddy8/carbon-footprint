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

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 180;

    // Define tree details based on active swaps
    // We use a deterministic position based on swap ID hash so trees don't jump around
    const getHashPosition = (str: string, maxVal: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash) % maxVal;
    };

    const trees = activeSwaps.map((swap) => {
      // Seed positions deterministically
      const x = 30 + getHashPosition(swap.id, canvas.width - 60);
      const sizeMultiplier = 0.8 + (getHashPosition(swap.id + '_size', 40) / 100); // 0.8 to 1.2
      
      let type: 'pine' | 'apple' | 'glowing' | 'shrub' = 'shrub';
      if (swap.category === 'transport') type = 'pine';
      else if (swap.category === 'food') type = 'apple';
      else if (swap.category === 'home') type = 'glowing';

      return {
        x,
        y: canvas.height - 30, // ground line
        type,
        size: 18 * sizeMultiplier
      };
    });

    // Sort trees back-to-front so overlap looks natural (sorted by y position which is constant, or sorted by x or index)
    // Sorting by x helps slightly, or sorting by size
    trees.sort((a, b) => a.x - b.x);

    // Game loop variables
    let frame = 0;
    const cloud1 = { x: 50, y: 30, speed: 0.15 };
    const cloud2 = { x: 250, y: 45, speed: 0.08 };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Draw Sky ---
      let skyColor = '#BFDBFE'; // light blue
      let groundColor = '#34D399'; // bright green
      let trunkColor = '#78350F';
      let leafGreen = '#059669';
      let darkLeafGreen = '#047857';

      if (themeState === 'neutral') {
        skyColor = '#FEF3C7'; // warm amber/yellow
        groundColor = '#FBBF24'; // sand yellow
        leafGreen = '#65A30D'; // lime
        darkLeafGreen = '#4D7C0F';
      } else if (themeState === 'polluted') {
        skyColor = '#9CA3AF'; // smoke grey
        groundColor = '#B45309'; // dried brown
        leafGreen = '#92400E'; // wilted brown
        darkLeafGreen = '#78350F';
      }

      ctx.fillStyle = skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- Draw Sun/Industrial Reactor ---
      if (themeState === 'healthy') {
        // Smiling retro sun
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(340, 40, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rays
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4 + (frame * 0.005);
          const startX = 340 + Math.cos(angle) * 20;
          const startY = 40 + Math.sin(angle) * 20;
          const endX = 340 + Math.cos(angle) * 25;
          const endY = 40 + Math.sin(angle) * 25;
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
        }
        ctx.stroke();
      } else if (themeState === 'polluted') {
        // Red, warning sun through smog
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(340, 45, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Smog bands
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(310, 40); ctx.lineTo(370, 40);
        ctx.moveTo(315, 48); ctx.lineTo(365, 48);
        ctx.stroke();
      }

      // --- Draw Retro Clouds ---
      const drawCloud = (x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2.5;

        // Draw flat cloud in retro/pixel style
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.arc(x + 10, y - 4, 12, 0, Math.PI * 2);
        ctx.arc(x + 22, y, 10, 0, Math.PI * 2);
        ctx.rect(x - 5, y - 2, 32, 12);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 10, Math.PI * 0.8, Math.PI * 1.8);
        ctx.arc(x + 10, y - 4, 12, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(x + 22, y, 10, Math.PI * 1.2, Math.PI * 2.2);
        ctx.moveTo(x - 10, y + 10);
        ctx.lineTo(x + 32, y + 10);
        ctx.stroke();
      };

      let cloudColor = '#FFFFFF';
      if (themeState === 'neutral') cloudColor = '#FFFDF5';
      else if (themeState === 'polluted') cloudColor = '#4B5563'; // dark smoke

      // Update positions
      cloud1.x = (cloud1.x + cloud1.speed) % (canvas.width + 40);
      cloud2.x = (cloud2.x + cloud2.speed) % (canvas.width + 40);

      drawCloud(cloud1.x - 30, cloud1.y, cloudColor);
      drawCloud(cloud2.x - 30, cloud2.y, cloudColor);

      // --- Draw Ground ---
      ctx.fillStyle = groundColor;
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      // Ground border
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 30);
      ctx.lineTo(canvas.width, canvas.height - 30);
      ctx.stroke();

      // Grass tuffs (little retro lines)
      ctx.lineWidth = 2;
      ctx.strokeStyle = themeState === 'polluted' ? '#78350F' : '#047857';
      ctx.beginPath();
      for (let i = 20; i < canvas.width; i += 60) {
        const offset = (i % 7) * 4;
        ctx.moveTo(i + offset, canvas.height - 20);
        ctx.lineTo(i + offset, canvas.height - 24);
        ctx.moveTo(i + offset + 4, canvas.height - 20);
        ctx.lineTo(i + offset + 6, canvas.height - 26);
      }
      ctx.stroke();

      // --- Draw Trees ---
      trees.forEach((tree) => {
        // Sway animation offset
        const sway = Math.sin(frame * 0.03 + tree.x) * 1.5;

        // Tree trunk
        ctx.fillStyle = trunkColor;
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(tree.x - 3, tree.y - tree.size - 2, 6, tree.size + 4);
        ctx.fill();
        ctx.stroke();

        if (tree.type === 'pine') {
          // Pine tree (layered triangles)
          ctx.fillStyle = leafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 2.5;

          const drawTriangle = (bottomY: number, size: number) => {
            ctx.beginPath();
            ctx.moveTo(tree.x + sway, bottomY - size);
            ctx.lineTo(tree.x - size * 0.8, bottomY);
            ctx.lineTo(tree.x + size * 0.8, bottomY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          };

          drawTriangle(tree.y - 12, tree.size * 0.8);
          drawTriangle(tree.y - 20, tree.size * 0.65);
          drawTriangle(tree.y - 28, tree.size * 0.5);
        } else if (tree.type === 'apple') {
          // Apple tree (round canopy with red dots)
          ctx.fillStyle = leafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.arc(tree.x + sway, tree.y - tree.size - 8, tree.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Draw apples (red circles) if healthy
          if (themeState === 'healthy') {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.arc(tree.x + sway - 5, tree.y - tree.size - 12, 2.5, 0, Math.PI * 2);
            ctx.arc(tree.x + sway + 5, tree.y - tree.size - 6, 2.5, 0, Math.PI * 2);
            ctx.arc(tree.x + sway, tree.y - tree.size - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (tree.type === 'glowing') {
          // Glowing/Magic leaf tree (glowing outline, neon color)
          ctx.fillStyle = themeState === 'healthy' ? '#6EE7B7' : themeState === 'neutral' ? '#FDE047' : '#F59E0B';
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 2.5;

          // Star or diamond shaped canopy
          ctx.beginPath();
          const cx = tree.x + sway;
          const cy = tree.y - tree.size - 8;
          const r = tree.size * 0.6;
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glow sparkle dot
          if (themeState === 'healthy' && frame % 30 < 15) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(cx - 1, cy - 1, 3, 3);
          }
        } else {
          // Shrub/Bush (low flat shapes)
          ctx.fillStyle = darkLeafGreen;
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.arc(tree.x - 6 + sway, tree.y - 8, 8, 0, Math.PI * 2);
          ctx.arc(tree.x + 6 + sway, tree.y - 8, 8, 0, Math.PI * 2);
          ctx.arc(tree.x + sway, tree.y - 12, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });

      // Ambient animal (little bunny jumping across screen in healthy state)
      if (themeState === 'healthy' && activeSwaps.length > 2) {
        const bunnyX = (frame * 0.5) % (canvas.width + 60) - 30;
        const bunnyY = canvas.height - 30 - Math.abs(Math.sin(frame * 0.08) * 8);

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        // Body
        ctx.arc(bunnyX, bunnyY, 5, 0, Math.PI * 2);
        // Head
        ctx.arc(bunnyX + 4, bunnyY - 3, 3.5, 0, Math.PI * 2);
        // Ears
        ctx.rect(bunnyX + 3, bunnyY - 9, 1.5, 4);
        ctx.rect(bunnyX + 4.5, bunnyY - 9, 1.5, 4);
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
            height: '360px',
            imageRendering: 'pixelated' as any,
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
