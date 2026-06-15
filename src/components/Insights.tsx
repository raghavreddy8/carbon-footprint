import React from 'react';
import { type Swap } from '../data/swaps';
import { type FootprintBreakdown, getCarbonEquivalents } from '../utils/carbonCalc';
import { NeoPanel } from './UI/NeoPanel';
import { NeoButton } from './UI/NeoButton';
import { audio } from '../utils/audio';
import { Trash, Info, Trees, Flame, Compass, RefreshCw, Zap } from 'lucide-react';

/**
 * @file Insights.tsx
 * @description Renders the carbon footprint breakdown dashboard. Includes comparative starting
 * vs. current footprint progress metrics, dynamic climate impact equivalents calculations,
 * personalized recommendations (category-specific advice and synergy highlights),
 * and a list of active committed swaps with cancellation functionality.
 */

interface InsightsProps {
  initialBreakdown: FootprintBreakdown;
  activeSwaps: Swap[];
  onRemoveSwap: (swapId: string) => void;
  onResetAll: () => void;
}

export const Insights: React.FC<InsightsProps> = ({
  initialBreakdown,
  activeSwaps,
  onRemoveSwap,
  onResetAll
}) => {
  // Calculate total saved carbon
  const totalSaved = activeSwaps.reduce((acc, curr) => acc + curr.savedCO2, 0);
  const currentTotal = Math.max(0, initialBreakdown.total - totalSaved);

  // Equivalents
  const equivalents = getCarbonEquivalents(totalSaved);

  // Category values remaining
  const getCategoryRemaining = (category: 'transport' | 'food' | 'home' | 'goods') => {
    const initial = initialBreakdown[category];
    const saved = activeSwaps
      .filter(s => s.category === category)
      .reduce((acc, curr) => acc + curr.savedCO2, 0);
    return Math.max(0, initial - saved);
  };

  const remainingBreakdown = {
    transport: getCategoryRemaining('transport'),
    food: getCategoryRemaining('food'),
    home: getCategoryRemaining('home'),
    goods: getCategoryRemaining('goods')
  };

  // Generate Personalized Recommendations
  const getPersonalizedInsights = () => {
    const insights: string[] = [];

    // Check high footprint sectors
    const sectors = [
      { name: 'transport', val: remainingBreakdown.transport, tip: 'Ditch the solo car commute! Prioritize public transit or biking swaps.' },
      { name: 'food', val: remainingBreakdown.food, tip: 'Red meat is driving your food emissions. Consider trying a beefless swap.' },
      { name: 'home energy', val: remainingBreakdown.home, tip: 'Heating and drying are your energy spikes. Cold laundry or line-drying can make a huge dent!' }
    ];

    sectors.sort((a, b) => b.val - a.val);

    // If no swaps are committed yet
    if (activeSwaps.length === 0) {
      insights.push(`Your highest emissions come from **${sectors[0].name.toUpperCase()}** (${sectors[0].val} kg CO₂/mo). Start there by swiping right on its card!`);
      insights.push("Swiping left skips a habit, but you can always replay the deck to reconsider.");
    } else {
      // Analyze active swaps and recommend adjacent ones
      const hasBike = activeSwaps.some(s => s.id === 'trans_bike');
      const hasColdWash = activeSwaps.some(s => s.id === 'home_cold');
      const hasBeefSwap = activeSwaps.some(s => s.id === 'food_beef');

      if (hasBike && !activeSwaps.some(s => s.id === 'trans_bus')) {
        insights.push("🌟 **Transit synergy:** Since you ride your bike, keeping a bus card for rainy days is an excellent secondary backup!");
      }
      if (hasColdWash && !activeSwaps.some(s => s.id === 'home_dryer')) {
        insights.push("🌟 **Laundromat Combo:** You're already washing cold! Hang dry your clothes next to save an extra 28 kg CO₂ per month.");
      }
      if (hasBeefSwap && !activeSwaps.some(s => s.id === 'food_waste')) {
        insights.push("🌟 **Kitchen Wizard:** Great job reducing beef! Tackle food waste next to save money and cut down on organic landfill decay emissions.");
      }

      // general reminder on highest remaining category
      if (sectors[0].val > 40) {
        insights.push(`💡 Your highest remaining emission sector is **${sectors[0].name.toUpperCase()}**. ${sectors[0].tip}`);
      }
    }

    if (insights.length < 2) {
      insights.push("💡 You are doing great! Keep reviewing your active swaps and see if you can take on a 'Hard' difficulty card.");
    }

    return insights;
  };

  const recommendations = getPersonalizedInsights();

  const handleRemove = (id: string) => {
    audio.playDecline();
    onRemoveSwap(id);
  };

  return (
    <div className="insights-container">
      {/* Carbon Score Dashboard */}
      <NeoPanel title="Footprint Breakdown" backgroundColor="#FFF">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* Starting footprint */}
          <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#F3F4F6' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>STARTING FOOTPRINT</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#EF4444' }}>{initialBreakdown.total.toFixed(0)} <span style={{ fontSize: '14px' }}>KG/MO</span></div>
          </div>
          {/* Current footprint */}
          <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#ECFDF5' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>CURRENT FOOTPRINT</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: currentTotal < 150 ? '#10B981' : '#F59E0B' }}>
              {currentTotal.toFixed(0)} <span style={{ fontSize: '14px' }}>KG/MO</span>
            </div>
          </div>
        </div>

        {/* Progress Bars for Categories */}
        <h4 style={{ textTransform: 'uppercase', fontWeight: '900', fontSize: '14px', marginBottom: '12px' }}>
          Sector Carbon Levels:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Transport', current: remainingBreakdown.transport, initial: initialBreakdown.transport, color: '#60A5FA' },
            { label: 'Food & Diet', current: remainingBreakdown.food, initial: initialBreakdown.food, color: '#FCA5A5' },
            { label: 'Home Energy', current: remainingBreakdown.home, initial: initialBreakdown.home, color: '#FCD34D' },
            { label: 'Goods & Shopping', current: remainingBreakdown.goods, initial: initialBreakdown.goods, color: '#C084FC' }
          ].map((cat, idx) => {
            const pct = cat.initial > 0 ? (cat.current / cat.initial) * 100 : 0;
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  <span>{cat.label}</span>
                  <span>{cat.current.toFixed(0)} / {cat.initial.toFixed(0)} kg CO₂</span>
                </div>
                {/* Visual bar container */}
                <div style={{ height: '16px', border: '2px solid #111827', borderRadius: '2px', backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                      borderRight: pct > 0 ? '2px solid #111827' : 'none',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </NeoPanel>

      {/* Middle Grid: Side-by-Side Equivalents and Personalized Insights */}
      <div className="insights-middle-grid">
        {/* Carbon Equivalents Panel */}
        <NeoPanel title="Climate Impact Equivalents" backgroundColor="#F9FAFB">
          {totalSaved > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center', height: '100%', alignContent: 'center' }}>
              <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#FFF' }}>
                <Trees size={28} style={{ color: '#10B981', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '18px', fontWeight: '900' }}>{equivalents.treesPlanted}</div>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: 'bold' }}>TREES / YR</div>
              </div>
              <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#FFF' }}>
                <Flame size={28} style={{ color: '#F59E0B', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '18px', fontWeight: '900' }}>{equivalents.carMilesAvoided}</div>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: 'bold' }}>MILES SAVED</div>
              </div>
              <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#FFF' }}>
                <Zap size={28} style={{ color: '#3B82F6', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '18px', fontWeight: '900' }}>{equivalents.phonesCharged}</div>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: 'bold' }}>PHONES CHG</div>
              </div>
              <div style={{ border: '2px solid #111827', padding: '12px', borderRadius: '4px', backgroundColor: '#FFF' }}>
                <Info size={28} style={{ color: '#A855F7', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '18px', fontWeight: '900' }}>{equivalents.trashBagsDiverted}</div>
                <div style={{ fontSize: '9px', color: '#666', fontWeight: 'bold' }}>BAGS SAVED</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '20px', color: '#888' }}>
              <Compass size={36} style={{ color: '#9CA3AF', marginBottom: '10px' }} />
              <p style={{ fontSize: '12px', fontWeight: 'bold' }}>
                Commit to active swaps to display positive climate equivalents!
              </p>
            </div>
          )}
        </NeoPanel>

        {/* Personalized Recommendations */}
        <NeoPanel title="Personalized Insights" backgroundColor="#FFFBEB">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'center' }}>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  backgroundColor: '#FFF',
                  border: '2px solid #111827',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  boxShadow: '2px 2px 0px #111827'
                }}
              >
                <Compass size={18} style={{ color: '#D97706', marginTop: '3px', flexShrink: 0 }} />
                <p
                  style={{ fontSize: '12px', margin: 0, color: '#111827', lineHeight: 1.4 }}
                  dangerouslySetInnerHTML={{
                    __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>
            ))}
          </div>
        </NeoPanel>
      </div>

      {/* Committed Swaps List */}
      <NeoPanel title="Your Committed Swaps" backgroundColor="#FFF">
        {activeSwaps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>
            No active swaps yet. Swipe RIGHT on deck cards to commit!
          </div>
        ) : (
          <div className="scrollable-swaps-list">
            {activeSwaps.map((swap) => (
              <div
                key={swap.id}
                style={{
                  border: '2px solid #111827',
                  borderRadius: '4px',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#F9FAFB'
                }}
              >
                <div>
                  <strong style={{ fontSize: '13px', textTransform: 'uppercase', display: 'block' }}>{swap.title}</strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 'bold' }}>
                    Category: {swap.category} • Saves {swap.savedCO2} kg CO₂ / Month
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(swap.id)}
                  aria-label={`Cancel active swap: ${swap.title}`}
                  style={{
                    backgroundColor: '#FEE2E2',
                    border: '2px solid #111827',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1.5px 1.5px 0px #111827',
                    transition: 'transform 0.1s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'translate(1px, 1px)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                  title="Cancel this swap"
                >
                  <Trash size={14} style={{ color: '#EF4444' }} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '2px solid #F3F4F6', marginTop: '16px', paddingTop: '16px', textAlign: 'right' }}>
          <NeoButton variant="danger" size="sm" onClick={() => { audio.playJingle(); onResetAll(); }}>
            <RefreshCw size={12} style={{ marginRight: '6px' }} />
            Reset Profile
          </NeoButton>
        </div>
      </NeoPanel>
    </div>
  );
};
