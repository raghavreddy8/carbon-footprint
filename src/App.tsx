import { useState, useEffect } from 'react';
import { SWAP_DATABASE, type Swap } from './data/swaps';
import { type OnboardingAnswers, type FootprintBreakdown, calculateInitialFootprint, getDynamicTheme } from './utils/carbonCalc';
import { Onboarding } from './components/Onboarding';
import { Character } from './components/Character';
import { SwipeDeck } from './components/SwipeDeck';
import { Insights } from './components/Insights';
import { Forest } from './components/Forest';
import { Minion } from './components/Minion';
import { audio } from './utils/audio';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import './App.css';

function App() {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [initialBreakdown, setInitialBreakdown] = useState<FootprintBreakdown | null>(null);
  const [activeSwapIds, setActiveSwapIds] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(true); // default to muted for autoplay policies

  // Load state on mount
  // Reloading the page resets the state to original onboarding
  useEffect(() => {
    // Start fresh on every reload
  }, []);

  // Sync active swaps to LocalStorage
  const saveSwaps = (swaps: string[]) => {
    localStorage.setItem('ecoswap_active_swaps', JSON.stringify(swaps));
  };

  const handleOnboardingComplete = (quizAnswers: OnboardingAnswers) => {
    const breakdown = calculateInitialFootprint(quizAnswers);
    setInitialBreakdown(breakdown);
    setOnboarded(true);
    setActiveSwapIds([]);

    // Initialize audio
    audio.updateCarbonLevel(1.0); // start at high footprint/baseline
    if (!isMuted) {
      audio.startAmbient();
    }
  };

  const handleCommitSwap = (swapId: string) => {
    const updated = [...activeSwapIds, swapId];
    setActiveSwapIds(updated);
    saveSwaps(updated);
  };

  const handleSkipSwap = (swapId: string) => {
    console.log(`Skipped swap: ${swapId}`);
  };

  const handleRemoveSwap = (swapId: string) => {
    const updated = activeSwapIds.filter(id => id !== swapId);
    setActiveSwapIds(updated);
    saveSwaps(updated);
  };

  const handleResetAll = () => {
    setOnboarded(false);
    setInitialBreakdown(null);
    setActiveSwapIds([]);
    audio.stopAmbient();
  };

  const handleToggleMute = () => {
    const newMuted = audio.toggleMute();
    setIsMuted(newMuted);
    
    // Play a click sound if unmuting
    if (!newMuted) {
      audio.playSuccess();
    }
  };

  // Calculate current footprint metrics
  const getActiveSwapsList = (): Swap[] => {
    return SWAP_DATABASE.filter(s => activeSwapIds.includes(s.id));
  };

  const activeSwaps = getActiveSwapsList();
  const totalSaved = activeSwaps.reduce((acc, curr) => acc + curr.savedCO2, 0);
  const currentTotal = initialBreakdown ? Math.max(0, initialBreakdown.total - totalSaved) : 0;
  
  // Calculate score between 0 and 1
  const initialTotal = initialBreakdown ? initialBreakdown.total : 1;
  const theme = getDynamicTheme(currentTotal, initialTotal);

  // Update audio context with current carbon level
  useEffect(() => {
    if (initialBreakdown) {
      const level = currentTotal / initialBreakdown.total;
      audio.updateCarbonLevel(level);
      // Restart ambient to adjust interval speed dynamically
      if (onboarded && !isMuted) {
        audio.startAmbient();
      }
    }
  }, [currentTotal, initialBreakdown, onboarded, isMuted]);

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: theme.backgroundColor,
        minHeight: '100vh',
        transition: 'background-color 0.8s ease, color 0.8s ease',
        color: '#111827',
        paddingBottom: '40px'
      }}
    >
      {/* Header bar */}
      <header
        style={{
          borderBottom: '4px solid #111827',
          backgroundColor: '#FFFFFF',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 0px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              backgroundColor: theme.accentColor,
              border: '2px solid #111827',
              borderRadius: '4px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '2px 2px 0px #111827',
              transition: 'background-color 0.5s ease'
            }}
          >
            <Sparkles size={20} style={{ color: '#FFF' }} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            ECOSWAP
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Reset button in header */}
          {onboarded && (
            <button
              onClick={() => { audio.playJingle(); handleResetAll(); }}
              style={{
                backgroundColor: '#EF4444',
                color: '#FFF',
                border: '3px solid #111827',
                borderRadius: '4px',
                padding: '8px 14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '3px 3px 0px #111827',
                transition: 'all 0.1s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '5px 5px 0px #111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '3px 3px 0px #111827';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(1px, 1px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px #111827';
              }}
            >
              <RefreshCw size={12} />
              Reset Game
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            style={{
              backgroundColor: isMuted ? '#F3F4F6' : theme.accentColor,
              color: isMuted ? '#666' : '#FFF',
              border: '3px solid #111827',
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0px #111827',
              transition: 'all 0.2s ease'
            }}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {!onboarded ? (
          /* Onboarding State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
            <div style={{ textAlign: 'center', maxWidth: '500px', marginBottom: '12px' }}>
              <span
                style={{
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  border: '2px solid #111827',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  textTransform: 'uppercase'
                }}
              >
                Carbon Footprint Game
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase', marginTop: '8px', marginBottom: '8px' }}>
                Swipe to Heal the Earth
              </h2>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.5 }}>
                Take the 30-second assessment to determine your starting footprint, then swipe card actions to plant trees, unlock eco-synergies, and dynamically heal your system theme!
              </p>
            </div>
            <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        ) : (
          /* Main Dashboard State */
          initialBreakdown && (
            <div className="dashboard-layout">
              {/* Eco Buddies Console (Horizontal top row) */}
              <div className="top-console-row" style={{ marginBottom: '24px' }}>
                <Character state={theme.characterState} savedKg={totalSaved} />
              </div>

              {/* Middle Row: Forest (50% screen width) and Swipe Deck (50% screen width) */}
              <div className="middle-game-row">
                <div className="forest-panel">
                  <Forest activeSwaps={activeSwaps} themeState={theme.themeName} />
                </div>
                <div className="deck-panel">
                  <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>
                      Active Swaps Deck
                    </h2>
                    <p style={{ fontSize: '11px', color: '#666', margin: '4px 0 0' }}>
                      Swipe Right to commit, Swipe Left to skip. Use Arrow keys too!
                    </p>
                  </div>
                  <SwipeDeck
                    swaps={SWAP_DATABASE}
                    activeSwapIds={activeSwapIds}
                    onCommit={handleCommitSwap}
                    onSkip={handleSkipSwap}
                    onResetDeck={() => {}}
                  />
                </div>
              </div>

              {/* Bottom Row: Detailed Insights Dashboard */}
              <div className="bottom-insights-row" style={{ marginTop: '24px' }}>
                <Insights
                  initialBreakdown={initialBreakdown}
                  activeSwaps={activeSwaps}
                  onRemoveSwap={handleRemoveSwap}
                  onResetAll={handleResetAll}
                />
              </div>
            </div>
          )
        )}
      </main>
      
      {/* Floating Minion Buddy in Bottom Right */}
      {onboarded && <Minion state={theme.characterState} />}
    </div>
  );
}

export default App;
