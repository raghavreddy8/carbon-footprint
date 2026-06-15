import React, { useState } from 'react';
import { type Swap } from '../data/swaps';
import { SwapCard } from './SwapCard';
import { NeoButton } from './UI/NeoButton';
import { audio } from '../utils/audio';
import { X, Check, RotateCcw, Award } from 'lucide-react';

/**
 * @file SwipeDeck.tsx
 * @description Renders a stack/deck of swap habit cards that the user can swipe through.
 * Supports swiping right to commit, swiping left to skip, keyboard arrow navigation,
 * reset/replay functionality, and displays card controls with full screen reader attributes.
 */

interface SwipeDeckProps {
  swaps: Swap[];
  activeSwapIds: string[];
  onCommit: (swapId: string) => void;
  onSkip: (swapId: string) => void;
  onResetDeck: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  swaps,
  activeSwapIds,
  onCommit,
  onSkip,
  onResetDeck
}) => {
  const uncommittedSwaps = swaps.filter(s => !activeSwapIds.includes(s.id));
  const [skippedIds, setSkippedIds] = useState<string[]>([]);

  const visibleSwaps = uncommittedSwaps.filter(s => !skippedIds.includes(s.id));

  const handleCommitCard = (swapId: string) => {
    audio.playSuccess();
    onCommit(swapId);
  };

  const handleSkipCard = (swapId: string) => {
    audio.playDecline();
    setSkippedIds(prev => [...prev, swapId]);
    onSkip(swapId);
  };

  const handleResetSession = () => {
    audio.playJingle();
    setSkippedIds([]);
    onResetDeck();
  };

  const hasCardsLeft = visibleSwaps.length > 0;
  const currentCard = hasCardsLeft ? visibleSwaps[0] : null;
  const nextCard = visibleSwaps.length > 1 ? visibleSwaps[1] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Deck Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          height: '420px',
          marginBottom: '20px'
        }}
      >
        {hasCardsLeft && currentCard ? (
          <>
            {/* Next Card preview behind */}
            {nextCard && (
              <div style={{ position: 'absolute', width: '100%', height: '100%', top: '8px', zIndex: 1 }}>
                <SwapCard
                  swap={nextCard}
                  onSwipeLeft={() => {}}
                  onSwipeRight={() => {}}
                  isActive={false}
                />
              </div>
            )}

            {/* Current Active Card */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', top: '0', zIndex: 2 }}>
              <SwapCard
                key={currentCard.id}
                swap={currentCard}
                onSwipeLeft={() => handleSkipCard(currentCard.id)}
                onSwipeRight={() => handleCommitCard(currentCard.id)}
                isActive={true}
              />
            </div>
          </>
        ) : (
          /* Empty Deck state */
          <div
            style={{
              border: '4px dashed #111827',
              borderRadius: '8px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#F9FAFB',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                border: '3px solid #111827',
                borderRadius: '50%',
                padding: '16px',
                backgroundColor: '#FEF3C7',
                marginBottom: '16px',
                boxShadow: '3px 3px 0px #111827'
              }}
            >
              <Award size={48} style={{ color: '#F59E0B' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>
              Deck Cleared!
            </h3>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.5, marginBottom: '24px' }}>
              You've swiped through all available swaps. Reconsider your skipped swaps or check your Insights dashboard to see your savings.
            </p>
            <NeoButton variant="primary" onClick={handleResetSession}>
              <RotateCcw size={16} style={{ marginRight: '8px' }} />
              Swipe Again
            </NeoButton>
          </div>
        )}
      </div>

      {/* Control Buttons (Skip/Commit) */}
      {hasCardsLeft && currentCard && (
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '10px' }}>
          <button
            onClick={() => handleSkipCard(currentCard.id)}
            aria-label="Skip this swap action"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid #111827',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #111827',
              transition: 'all 0.1s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '5px 5px 0px #111827';
              e.currentTarget.style.backgroundColor = '#FEF2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '3px 3px 0px #111827';
              e.currentTarget.style.backgroundColor = '#FFF';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px #111827';
            }}
          >
            <X size={28} style={{ color: '#EF4444' }} />
          </button>

          <button
            onClick={() => handleCommitCard(currentCard.id)}
            aria-label="Commit to this swap action"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid #111827',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px #111827',
              transition: 'all 0.1s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '5px 5px 0px #111827';
              e.currentTarget.style.backgroundColor = '#ECFDF5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '3px 3px 0px #111827';
              e.currentTarget.style.backgroundColor = '#FFF';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0px #111827';
            }}
          >
            <Check size={28} style={{ color: '#10B981' }} />
          </button>
        </div>
      )}
    </div>
  );
};
