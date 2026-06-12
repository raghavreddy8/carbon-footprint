import React, { useState } from 'react';
import { type OnboardingAnswers } from '../utils/carbonCalc';
import { NeoPanel } from './UI/NeoPanel';
import { NeoButton } from './UI/NeoButton';
import { audio } from '../utils/audio';
import { Car, Bike, Utensils, Home, Zap, Heart, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    commute: 'solo_car',
    diet: 'moderate_meat',
    home: 'moderate'
  });

  const handleSelect = (key: keyof OnboardingAnswers, value: any) => {
    audio.playSuccess();
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    audio.playJingle();
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    audio.playDecline();
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <NeoPanel title={`CO2 Matcher - Step ${step} of 3`} backgroundColor="#FFFDF9">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '12px',
                  border: '2px solid #111827',
                  borderRadius: '2px',
                  backgroundColor: s === step ? '#F59E0B' : s < step ? '#10B981' : '#FFFFFF',
                  transition: 'background-color 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>
              🚗 How do you commute?
            </h2>
            <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
              Your transport choice makes up the largest segment of personal greenhouse emissions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[
                { id: 'solo_car', label: 'Solo Driver', desc: 'Single-occupancy fuel car', icon: <Car size={24} /> },
                { id: 'carpool', label: 'Carpooler', desc: 'Share rides with friends', icon: <Car size={24} style={{ color: '#F59E0B' }} /> },
                { id: 'transit', label: 'Transit Rider', desc: 'Buses, subways, or trains', icon: <Zap size={24} style={{ color: '#3B82F6' }} /> },
                { id: 'bike_walk', label: 'Active Commute', desc: 'Walk, cycle, or skateboard', icon: <Bike size={24} style={{ color: '#10B981' }} /> }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect('commute', opt.id as any)}
                  style={{
                    border: '3px solid #111827',
                    borderRadius: '4px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: answers.commute === opt.id ? '#FEF3C7' : '#FFFFFF',
                    boxShadow: answers.commute === opt.id ? '3px 3px 0px #111827' : '1px 1px 0px #111827',
                    transform: answers.commute === opt.id ? 'translate(-2px, -2px)' : 'none',
                    transition: 'all 0.1s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '8px'
                  }}
                >
                  <div style={{ border: '2px solid #111827', borderRadius: '50%', padding: '10px', backgroundColor: '#F3F4F6' }}>
                    {opt.icon}
                  </div>
                  <strong style={{ fontSize: '15px', textTransform: 'uppercase' }}>{opt.label}</strong>
                  <span style={{ fontSize: '11px', color: '#666' }}>{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>
              🍔 What does your diet look like?
            </h2>
            <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
              Agriculture, particularly red meat, accounts for a massive chunk of carbon release.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {[
                { id: 'heavy_meat', label: 'Meat Enthusiast', desc: 'Red meat multiple times a week', icon: <Utensils size={24} style={{ color: '#EF4444' }} /> },
                { id: 'moderate_meat', label: 'Balanced', desc: 'Chicken, fish, occasional beef', icon: <Utensils size={24} style={{ color: '#F59E0B' }} /> },
                { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, dairy and eggs okay', icon: <Heart size={24} style={{ color: '#3B82F6' }} /> },
                { id: 'vegan', label: 'Plant-Based', desc: 'Fully vegan / plant powered', icon: <Sparkles size={24} style={{ color: '#10B981' }} /> }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect('diet', opt.id as any)}
                  style={{
                    border: '3px solid #111827',
                    borderRadius: '4px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: answers.diet === opt.id ? '#FEF3C7' : '#FFFFFF',
                    boxShadow: answers.diet === opt.id ? '3px 3px 0px #111827' : '1px 1px 0px #111827',
                    transform: answers.diet === opt.id ? 'translate(-2px, -2px)' : 'none',
                    transition: 'all 0.1s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '8px'
                  }}
                >
                  <div style={{ border: '2px solid #111827', borderRadius: '50%', padding: '10px', backgroundColor: '#F3F4F6' }}>
                    {opt.icon}
                  </div>
                  <strong style={{ fontSize: '15px', textTransform: 'uppercase' }}>{opt.label}</strong>
                  <span style={{ fontSize: '11px', color: '#666' }}>{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>
              ⚡ How do you heat/cool your home?
            </h2>
            <p style={{ color: '#555', marginBottom: '20px', fontSize: '14px' }}>
              Residential heating, ventilation, and air conditioning use clean or carbon-heavy grids.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
              {[
                { id: 'large_ac', label: 'High Power User', desc: 'Large space, heavy heating or AC running constantly', icon: <Home size={24} style={{ color: '#EF4444' }} /> },
                { id: 'moderate', label: 'Average User', desc: 'Standard thermostat settings, heating/cooling when needed', icon: <Home size={24} style={{ color: '#F59E0B' }} /> },
                { id: 'eco_conscious', label: 'Eco Conscious', desc: 'Smart thermostat, energy-efficient insulation, solar grids', icon: <Home size={24} style={{ color: '#10B981' }} /> }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect('home', opt.id as any)}
                  style={{
                    border: '3px solid #111827',
                    borderRadius: '4px',
                    padding: '14px 20px',
                    cursor: 'pointer',
                    backgroundColor: answers.home === opt.id ? '#FEF3C7' : '#FFFFFF',
                    boxShadow: answers.home === opt.id ? '3px 3px 0px #111827' : '1px 1px 0px #111827',
                    transform: answers.home === opt.id ? 'translate(-2px, -2px)' : 'none',
                    transition: 'all 0.1s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ border: '2px solid #111827', borderRadius: '50%', padding: '10px', backgroundColor: '#F3F4F6', flexShrink: 0 }}>
                    {opt.icon}
                  </div>
                  <div>
                    <strong style={{ fontSize: '15px', textTransform: 'uppercase', display: 'block' }}>{opt.label}</strong>
                    <span style={{ fontSize: '11px', color: '#666' }}>{opt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          {step > 1 ? (
            <NeoButton variant="secondary" onClick={handleBack}>
              ◀ Back
            </NeoButton>
          ) : (
            <div />
          )}

          <NeoButton variant="primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
            {step === 3 ? 'Generate Forest! 🎉' : 'Next Step ▶'}
          </NeoButton>
        </div>
      </NeoPanel>
    </div>
  );
};
