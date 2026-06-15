import React from 'react';

/**
 * @file Minion.tsx
 * @description Renders a floating, state-aware Minion character on the bottom right of the page.
 * The Minion displays dynamic expressions (shivers/steams when sad/angry, waves when happy)
 * and shows contextual speech bubbles with personalized carbon tips in Minion-speak.
 */

interface MinionProps {
  state: 'happy' | 'neutral' | 'sad'; // sad maps to the "angry" state requested
}

export const Minion: React.FC<MinionProps> = ({ state }) => {
  // SVG drawing properties
  let eyeY = 28;
  let pupilSize = 3;
  let browPath = '';
  let mouthPath = 'M 35 60 Q 50 68 65 60'; // default slight smile
  let steamParticles = null;
  let minionBodyColor = '#FCD34D'; // Yellow-300
  let speechBubbleText = '';
  
  if (state === 'sad') {
    // Angry state!
    minionBodyColor = '#FBBF24'; // darker angry yellow
    eyeY = 30;
    pupilSize = 2.5;
    // Angry brows
    browPath = 'M 25 22 L 45 27 M 75 22 L 55 27';
    // Gritted/growly mouth
    mouthPath = 'M 38 64 Q 50 54 62 64 M 38 64 L 62 64';
    // Red smoke steam puffs rising from head
    steamParticles = (
      <g className="steam-puffs">
        <circle cx="45" cy="5" r="4" fill="#EF4444" opacity="0.6" className="puff-1" />
        <circle cx="55" cy="0" r="3" fill="#EF4444" opacity="0.6" className="puff-2" />
      </g>
    );
    speechBubbleText = 'Kaya! Too much smoke! Boss, pick the bike card! 🚲';
  } else if (state === 'neutral') {
    eyeY = 28;
    mouthPath = 'M 38 60 L 62 60'; // neutral line
    speechBubbleText = 'Tulaliloo! Progress! Eat more bananas, less beef! 🍌';
  } else {
    // Happy state!
    eyeY = 26;
    pupilSize = 3.5;
    // Wide open happy smile
    mouthPath = 'M 35 58 Q 50 78 65 58 Z'; // solid open smile
    speechBubbleText = 'Bello! So clean! We are eco-champions! Poopaye! 🎉';
  }

  return (
    <div
      className="floating-minion-container"
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        width: '220px',
        height: '240px',
        pointerEvents: 'none', // Let clicks pass through empty spaces
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
      }}
    >
      <style>{`
        @keyframes wavingshake {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(45deg); }
        }
        @keyframes minionFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes angryShiver {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-1.5px, 1px); }
          40% { transform: translate(1px, -1.5px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1.5px, 1.5px); }
        }
        @keyframes steamRise {
          0% { transform: translateY(10px) scale(0.6); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-15px) scale(1.2); opacity: 0; }
        }
        .minion-arm-wave {
          animation: wavingshake 0.5s infinite alternate ease-in-out;
          transform-origin: 15px 45px;
        }
        .puff-1 {
          animation: steamRise 1s infinite linear;
          transform-origin: center;
        }
        .puff-2 {
          animation: steamRise 1s infinite linear 0.4s;
          transform-origin: center;
        }
        .minion-speech-bubble {
          pointer-events: auto;
          position: relative;
          background: #FFFFFF;
          border: 3px solid #111827;
          border-radius: 12px;
          padding: 8px 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #111827;
          box-shadow: 4px 4px 0px #111827;
          width: 180px;
          text-align: center;
          margin-bottom: 12px;
          animation: minionFloat 3s infinite ease-in-out;
        }
        .minion-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -12px;
          right: 40px;
          border-width: 12px 12px 0 0;
          border-style: solid;
          border-color: #111827 transparent;
          display: block;
          width: 0;
        }
        .minion-speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 42px;
          border-width: 9px 9px 0 0;
          border-style: solid;
          border-color: #FFFFFF transparent;
          display: block;
          width: 0;
          z-index: 1;
        }
      `}</style>

      {/* Dynamic speech bubble — live region so screen readers announce carbon tips */}
      <div
        className="minion-speech-bubble"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {speechBubbleText}
      </div>

      <div style={{ width: '120px', height: '150px', pointerEvents: 'auto' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 130"
          style={{
            overflow: 'visible',
            animation: state === 'sad' 
              ? 'angryShiver 0.2s infinite' 
              : 'minionFloat 3s infinite ease-in-out'
          }}
          filter="drop-shadow(4px 4px 0px #111827)"
        >
          {/* Steam Puffs */}
          {steamParticles}

          {/* Arms */}
          {/* Left Arm (Resting) */}
          <path
            d="M 15 75 Q 5 85 15 95"
            fill="none"
            stroke={minionBodyColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Left Hand Glove */}
          <circle cx="15" cy="95" r="5" fill="#111827" />

          {/* Right Arm (Waving or Clenched) */}
          {state === 'happy' ? (
            <g className="minion-arm-wave" transform="translate(70, 35)">
              {/* Waving arm */}
              <path
                d="M 10 25 Q 25 10 20 0"
                fill="none"
                stroke={minionBodyColor}
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Glove waving */}
              <circle cx="20" cy="0" r="5.5" fill="#111827" />
              <path d="M 18 -2 Q 13 -10 10 -8" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 21 -3 Q 23 -11 20 -9" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            <g transform={`rotate(${state === 'sad' ? 25 : 0}, 85, 75)`}>
              <path
                d="M 85 75 Q 95 85 85 95"
                fill="none"
                stroke={minionBodyColor}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="85" cy="95" r="5" fill="#111827" />
            </g>
          )}

          {/* Main Pill Body */}
          <rect
            x="20"
            y="15"
            width="60"
            height="85"
            rx="30"
            fill={minionBodyColor}
            stroke="#111827"
            strokeWidth="3.5"
          />

          {/* Overalls (Denim Trousers) */}
          <path
            d="M 20 70 L 80 70 L 80 90 Q 80 100 70 100 L 30 100 Q 20 100 20 90 Z"
            fill="#3B82F6"
            stroke="#111827"
            strokeWidth="3"
          />
          {/* Overall Chest Plate */}
          <rect
            x="28"
            y="58"
            width="44"
            height="15"
            fill="#3B82F6"
            stroke="#111827"
            strokeWidth="3"
          />
          {/* Overall Straps */}
          <path
            d="M 20 45 L 29 59 L 33 59 L 24 45 Z"
            fill="#3B82F6"
            stroke="#111827"
            strokeWidth="2.5"
          />
          <path
            d="M 80 45 L 71 59 L 67 59 L 76 45 Z"
            fill="#3B82F6"
            stroke="#111827"
            strokeWidth="2.5"
          />
          {/* Strap Buttons */}
          <circle cx="30" cy="59" r="2" fill="#111827" />
          <circle cx="70" cy="59" r="2" fill="#111827" />

          {/* Chest Pocket */}
          <path
            d="M 42 66 L 58 66 L 58 74 Q 58 78 50 78 Q 42 78 42 74 Z"
            fill="#3B82F6"
            stroke="#111827"
            strokeWidth="2"
          />

          {/* Shoes / Boots */}
          <rect x="32" y="100" width="14" height="8" rx="2" fill="#4B3621" stroke="#111827" strokeWidth="2.5" />
          <rect x="54" y="100" width="14" height="8" rx="2" fill="#4B3621" stroke="#111827" strokeWidth="2.5" />

          {/* Goggles Strap (Black band around head) */}
          <rect
            x="19.5"
            y="26"
            width="61"
            height="8"
            fill="#1F2937"
            stroke="#111827"
            strokeWidth="1"
          />

          {/* Goggles Metal Rims (Silver circles) */}
          {/* Eye 1 */}
          <circle
            cx="38"
            cy="30"
            r="13"
            fill="#E5E7EB"
            stroke="#111827"
            strokeWidth="3.5"
          />
          {/* Eye 2 */}
          <circle
            cx="62"
            cy="30"
            r="13"
            fill="#E5E7EB"
            stroke="#111827"
            strokeWidth="3.5"
          />

          {/* Goggles Inner Eye White */}
          <circle cx="38" cy="30" r="9.5" fill="#FFF" />
          <circle cx="62" cy="30" r="9.5" fill="#FFF" />

          {/* Irises (Brown) */}
          <circle cx="38" cy={eyeY} r="5.5" fill="#78350F" />
          <circle cx="62" cy={eyeY} r="5.5" fill="#78350F" />

          {/* Pupils (Black) */}
          <circle cx="38" cy={eyeY} r={pupilSize} fill="#111827" />
          <circle cx="62" cy={eyeY} r={pupilSize} fill="#111827" />

          {/* Eye Highlights (White) */}
          <circle cx="36" cy={eyeY - 2} r="1.2" fill="#FFF" />
          <circle cx="60" cy={eyeY - 2} r="1.2" fill="#FFF" />

          {/* Eyelids / Brows (Gives angry/happy expressions) */}
          {browPath && <path d={browPath} stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill="none" />}
          {state === 'sad' && (
            /* Eyelids closing halfway for angry look */
            <g fill={minionBodyColor} stroke="#111827" strokeWidth="2">
              <path d="M 27 23 Q 38 31 49 23 L 49 18 Z" />
              <path d="M 73 23 Q 62 31 51 23 L 51 18 Z" />
            </g>
          )}

          {/* Mouth */}
          {state === 'sad' ? (
            /* Red open angry mouth with gritted teeth lines */
            <g>
              <path d={mouthPath} fill="#EF4444" stroke="#111827" strokeWidth="3" />
              <line x1="42" y1="64" x2="58" y2="64" stroke="#FFF" strokeWidth="2.5" />
            </g>
          ) : (
            /* Simple happy/neutral curve */
            <path d={mouthPath} stroke="#111827" strokeWidth="3.5" strokeLinecap="round" fill={state === 'happy' ? '#EF4444' : 'none'} />
          )}

          {/* Hair (Spiky combed hair on top) */}
          <path d="M 50 14 Q 50 2 52 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 47 14 Q 45 4 41 2" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 53 14 Q 56 4 60 2" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 44 14 Q 40 6 34 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 56 14 Q 61 6 67 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
};
