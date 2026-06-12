import React, { useState, useRef, useEffect } from 'react';
import { type Swap } from '../data/swaps';
import { NeoPanel } from './UI/NeoPanel';
import { Zap, Heart, Car, Home, ArrowLeft, ArrowRight } from 'lucide-react';

interface SwapCardProps {
  swap: Swap;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export const SwapCard: React.FC<SwapCardProps> = ({
  swap,
  onSwipeLeft,
  onSwipeRight,
  isActive
}) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Setup keyboard controls for active card
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onSwipeLeft();
      } else if (e.key === 'ArrowRight') {
        onSwipeRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onSwipeLeft, onSwipeRight]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    // Swipe thresholds
    const swipeThreshold = 120;
    if (dragOffset.x > swipeThreshold) {
      onSwipeRight();
    } else if (dragOffset.x < -swipeThreshold) {
      onSwipeLeft();
    } else {
      // Spring back
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const getCategoryIcon = () => {
    switch (swap.category) {
      case 'transport':
        return <Car size={18} />;
      case 'food':
        return <Heart size={18} style={{ color: '#EF4444' }} />;
      case 'home':
        return <Home size={18} style={{ color: '#F59E0B' }} />;
      case 'goods':
      default:
        return <Zap size={18} style={{ color: '#3B82F6' }} />;
    }
  };

  const getCategoryColor = () => {
    switch (swap.category) {
      case 'transport':
        return '#60A5FA'; // blue
      case 'food':
        return '#FCA5A5'; // rose/red
      case 'home':
        return '#FCD34D'; // amber
      case 'goods':
      default:
        return '#C084FC'; // purple
    }
  };

  // Compute card positioning styles based on drag
  const rotation = dragOffset.x * 0.08; // scale rotation with drag
  const opacity = isActive ? 1 : 0.4;
  const scale = isActive ? 1 : 0.95;

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'default',
    transform: isActive
      ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`
      : `scale(${scale})`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease',
    opacity,
    touchAction: 'none',
    userSelect: 'none',
    zIndex: isActive ? 10 : 1
  };

  // Swipe indicators opacity
  const rightBadgeOpacity = Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const leftBadgeOpacity = Math.min(Math.max(-dragOffset.x / 80, 0), 1);

  return (
    <div ref={cardRef} style={cardStyle} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <NeoPanel
        backgroundColor="#FFFFFF"
        borderColor="#111827"
        shadowColor={isActive ? '#111827' : 'transparent'}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Swipe Indicators overlay */}
        {isActive && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                transform: 'rotate(-10deg)',
                backgroundColor: '#EF4444',
                color: '#FFF',
                border: '3px solid #111827',
                borderRadius: '4px',
                padding: '8px 16px',
                fontWeight: '900',
                fontSize: '20px',
                opacity: leftBadgeOpacity,
                zIndex: 100,
                pointerEvents: 'none'
              }}
            >
              SKIP
            </div>
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                transform: 'rotate(10deg)',
                backgroundColor: '#10B981',
                color: '#FFF',
                border: '3px solid #111827',
                borderRadius: '4px',
                padding: '8px 16px',
                fontWeight: '900',
                fontSize: '20px',
                opacity: rightBadgeOpacity,
                zIndex: 100,
                pointerEvents: 'none'
              }}
            >
              COMMIT!
            </div>
          </>
        )}

        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: getCategoryColor(),
              border: '2px solid #111827',
              borderRadius: '3px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            {getCategoryIcon()}
            <span>{swap.category}</span>
          </div>

          <div
            style={{
              fontSize: '12px',
              fontWeight: '900',
              color: '#059669',
              border: '2px dashed #059669',
              padding: '2px 8px',
              borderRadius: '2px'
            }}
          >
            -{swap.savedCO2} KG CO₂/MO
          </div>
        </div>

        {/* Swap Main Title */}
        <h3 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', lineHeight: 1.1 }}>
          {swap.title}
        </h3>

        {/* Swap Action Comparison */}
        <div
          style={{
            border: '2px solid #111827',
            borderRadius: '4px',
            backgroundColor: '#F3F4F6',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#EF4444', color: '#FFF', padding: '1px 5px', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>OLD</span>
            <span style={{ textDecoration: 'line-through', color: '#666', fontWeight: 'bold' }}>{swap.originalHabit}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#10B981', color: '#FFF', padding: '1px 5px', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>NEW</span>
            <span style={{ color: '#111827', fontWeight: 'bold' }}>{swap.alternativeHabit}</span>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, flex: 1 }}>
          {swap.description}
        </p>

        {/* Details Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '2px solid #F3F4F6',
            paddingTop: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#666',
            textTransform: 'uppercase'
          }}
        >
          <div>
            Difficulty:{' '}
            <span style={{ color: swap.difficulty === 'hard' ? '#EF4444' : swap.difficulty === 'medium' ? '#F59E0B' : '#10B981' }}>
              {swap.difficulty}
            </span>
          </div>
          <div>
            Impact:{' '}
            <span style={{ color: swap.impactLevel === 'high' ? '#EF4444' : '#10B981' }}>
              {swap.impactLevel}
            </span>
          </div>
        </div>

        {isActive && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: '#AAA', fontSize: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={10} /> Drag/Arrow Left to Skip
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Drag/Arrow Right to Commit <ArrowRight size={10} />
            </div>
          </div>
        )}
      </NeoPanel>
    </div>
  );
};
