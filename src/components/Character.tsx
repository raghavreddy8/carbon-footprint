import React from 'react';
import { NeoPanel } from './UI/NeoPanel';

/**
 * @file Character.tsx
 * @description Renders the horizontal Eco-Buddies status console containing two side-characters:
 * Leafy (a nature spirit leaf SVG) and Sparky (a clean-energy flame/electricity bolt SVG).
 * Both characters dynamically adapt their expressions, styling, and animations (happy/dancing,
 * neutral/sweating, sad/wilted/gasping) to align with the current carbon levels.
 */

interface CharacterProps {
  state: 'happy' | 'neutral' | 'sad';
  savedKg: number;
}

export const Character: React.FC<CharacterProps> = ({ state, savedKg }) => {
  // SVG for Leafy
  const renderLeafy = () => {
    let leafColor = '#10B981'; // green
    let cheekColor = '#FCA5A5'; // light red
    let mouthPath = 'M 25 32 Q 30 38 35 32'; // happy smile
    let eyeY = 24;
    let eyeHeight = 6;
    let browPath = '';
    let specialDecor = null;

    if (state === 'neutral') {
      leafColor = '#84CC16'; // lime green
      mouthPath = 'M 25 35 L 35 35'; // straight line
      cheekColor = 'transparent';
    } else if (state === 'sad') {
      leafColor = '#B45309'; // brown/wilted
      cheekColor = 'transparent';
      mouthPath = 'M 25 38 Q 30 32 35 38'; // sad frown
      eyeHeight = 2; // sleepy/sad closed eyes
      eyeY = 26;
      browPath = 'M 20 22 L 26 24 M 40 22 L 34 24'; // worried brows
      // Sweat drop
      specialDecor = (
        <path
          d="M 38 28 Q 40 32 38 34 Q 36 32 38 28 Z"
          fill="#3B82F6"
          className="sweat-drop"
        />
      );
    } else {
      // Happy bloom flower
      specialDecor = (
        <g className="flower-bloom" transform="translate(30, 2)">
          <circle cx="0" cy="0" r="4" fill="#F59E0B" />
          <circle cx="-5" cy="0" r="3.5" fill="#EF4444" />
          <circle cx="5" cy="0" r="3.5" fill="#EF4444" />
          <circle cx="0" cy="-5" r="3.5" fill="#EF4444" />
          <circle cx="0" cy="5" r="3.5" fill="#EF4444" />
        </g>
      );
    }

    return (
      <svg
        width="100"
        height="100"
        viewBox="0 0 60 60"
        style={{
          overflow: 'visible',
          animation: state === 'happy' ? 'bounce 0.6s infinite alternate' : state === 'sad' ? 'shiver 0.4s infinite' : 'sway 2s infinite ease-in-out'
        }}
      >
        <defs>
          <style>{`
            @keyframes bounce {
              from { transform: translateY(0); }
              to { transform: translateY(-8px); }
            }
            @keyframes sway {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
            @keyframes shiver {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(-1px, 1px); }
              50% { transform: translate(1px, -1px); }
              75% { transform: translate(-1px, -1px); }
            }
            @keyframes sweat {
              0% { transform: translateY(0) scale(0.8); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(8px) scale(1.1); opacity: 0; }
            }
            .sweat-drop {
              animation: sweat 1.5s infinite;
              transform-origin: center;
            }
          `}</style>
        </defs>
        {/* Leaf Stem */}
        <path d="M 30 10 Q 30 50 30 55" stroke="#065F46" strokeWidth="4" fill="none" />
        
        {/* Leaf Shape */}
        <path
          d="M 30 8 C 10 20 10 45 30 52 C 50 45 50 20 30 8 Z"
          fill={leafColor}
          stroke="#111827"
          strokeWidth="3"
        />

        {/* Eyes */}
        <rect x="20" y={eyeY} width="4" height={eyeHeight} rx="2" fill="#111827" />
        <rect x="36" y={eyeY} width="4" height={eyeHeight} rx="2" fill="#111827" />

        {/* Eyebrows */}
        {browPath && <path d={browPath} stroke="#111827" strokeWidth="2" strokeLinecap="round" />}

        {/* Mouth */}
        <path d={mouthPath} stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="17" cy="33" r="3" fill={cheekColor} />
        <circle cx="43" cy="33" r="3" fill={cheekColor} />

        {specialDecor}
      </svg>
    );
  };

  // SVG for Puffy
  const renderPuffy = () => {
    let cloudColor = '#FFFFFF';
    let eyeColor = '#111827';
    let mouthPath = 'M 25 32 Q 30 38 35 32';
    let browPath = '';
    let particles = null;

    if (state === 'neutral') {
      cloudColor = '#E5E7EB'; // light grey
      mouthPath = 'M 25 35 L 35 35';
    } else if (state === 'sad') {
      cloudColor = '#4B5563'; // dark charcoal
      eyeColor = '#111827';
      mouthPath = 'M 25 37 Q 30 32 35 37';
      browPath = 'M 20 22 L 26 24 M 40 22 L 34 24';
      // Little rain droplets
      particles = (
        <g className="rain-drops">
          <line x1="20" y1="48" x2="18" y2="54" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="50" x2="28" y2="56" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="48" x2="38" y2="54" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    } else {
      // Sunny sparkles
      particles = (
        <g className="sun-sparkle" transform="translate(45, 10)">
          <path d="M 0 -8 L 0 8 M -8 0 L 8 0" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#FFF" stroke="#F59E0B" strokeWidth="1.5" />
        </g>
      );
    }

    return (
      <svg
        width="100"
        height="100"
        viewBox="0 0 60 60"
        style={{
          overflow: 'visible',
          animation: state === 'happy' ? 'floatHappy 2s infinite ease-in-out' : state === 'sad' ? 'floatSad 1s infinite ease-in-out' : 'floatNeutral 3s infinite ease-in-out'
        }}
      >
        <defs>
          <style>{`
            @keyframes floatHappy {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-10px) scale(1.05); }
            }
            @keyframes floatNeutral {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            @keyframes floatSad {
              0%, 100% { transform: translateY(0) scale(0.95); }
              50% { transform: translateY(4px) scale(1); }
            }
          `}</style>
        </defs>

        {/* Cloud Body (Made of circles overlapping) */}
        <g stroke="#111827" strokeWidth="3" fill={cloudColor}>
          {/* Back puff */}
          <circle cx="20" cy="32" r="14" />
          <circle cx="40" cy="32" r="14" />
          <circle cx="30" cy="22" r="15" />
          {/* Bottom fill to flatten it slightly */}
          <rect x="15" y="28" width="30" height="18" stroke="none" />
          <line x1="12" y1="44" x2="48" y2="44" />
        </g>

        {/* Eyes */}
        <circle cx="23" cy="30" r="2.5" fill={eyeColor} />
        <circle cx="37" cy="30" r="2.5" fill={eyeColor} />

        {/* Eyebrows */}
        {browPath && <path d={browPath} stroke="#111827" strokeWidth="2" strokeLinecap="round" />}

        {/* Mouth */}
        <path d={mouthPath} stroke="#111827" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {state === 'happy' && (
          <>
            {/* Blushing cheeks */}
            <circle cx="18" cy="34" r="2.5" fill="#FCA5A5" />
            <circle cx="42" cy="34" r="2.5" fill="#FCA5A5" />
          </>
        )}

        {particles}
      </svg>
    );
  };

  const getStatusText = () => {
    switch (state) {
      case 'happy':
        return { title: 'THRIVING', text: 'Eco system is healthy! Your swaps are saving tons of carbon.', color: '#10B981' };
      case 'neutral':
        return { title: 'BALANCED', text: 'Making progress, but some high emissions remain.', color: '#F59E0B' };
      case 'sad':
      default:
        return { title: 'POLLUTED', text: 'Warning! Carbon footprint is high. Swipe to activate swaps!', color: '#EF4444' };
    }
  };

  const status = getStatusText();

  return (
    <NeoPanel title="Eco Buddies Status Console" backgroundColor="#FFF">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left Side: Leafy */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          {renderLeafy()}
          <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: '900', marginTop: '6px', textTransform: 'uppercase' }}>
            LEAFY
          </div>
        </div>

        {/* Center: Status Bubble */}
        <div
          style={{
            border: '3px solid #111827',
            borderRadius: '4px',
            backgroundColor: '#F3F4F6',
            padding: '16px',
            textAlign: 'center',
            flex: '1',
            minWidth: '260px',
            boxShadow: '3px 3px 0px #111827',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: status.color,
                color: '#FFF',
                border: '2px solid #111827',
                borderRadius: '2px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase'
              }}
            >
              {status.title}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#111827', fontWeight: 'bold', margin: 0, lineHeight: 1.4 }}>
            {status.text}
          </p>
          {savedKg > 0 && (
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: '900', letterSpacing: '0.5px' }}>
              🌳 ACTIVE OFFSET: -{savedKg.toFixed(1)} KG CO₂ / MONTH
            </div>
          )}
        </div>

        {/* Right Side: Puffy */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          {renderPuffy()}
          <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: '900', marginTop: '6px', textTransform: 'uppercase' }}>
            PUFFY
          </div>
        </div>
      </div>
    </NeoPanel>
  );
};
