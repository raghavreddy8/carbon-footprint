import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from './Onboarding';

/**
 * @file Onboarding.test.tsx
 * @description Integration tests for the Onboarding questionnaire flow.
 */

// Mock audio utility to avoid audio context instantiation errors in jsdom
vi.mock('../utils/audio', () => ({
  audio: {
    playSuccess: vi.fn(),
    playDecline: vi.fn(),
    playJingle: vi.fn()
  }
}));

describe('Onboarding Component', () => {
  it('runs through all steps of the onboarding questionnaire and calls onComplete with correct values', () => {
    const handleComplete = vi.fn();
    render(<Onboarding onComplete={handleComplete} />);

    // Step 1 check
    expect(screen.getByText(/How do you commute\?/i)).toBeDefined();
    
    // Select Active Commute (bike_walk)
    const activeCommuteBtn = screen.getByText('Active Commute');
    fireEvent.click(activeCommuteBtn);

    // Go to step 2
    const nextBtn = screen.getByRole('button', { name: /next step/i });
    fireEvent.click(nextBtn);

    // Step 2 check
    expect(screen.getByText(/What does your diet look like\?/i)).toBeDefined();
    
    // Select Plant-Based (vegan)
    const veganBtn = screen.getByText('Plant-Based');
    fireEvent.click(veganBtn);

    // Go to step 3
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 3 check
    expect(screen.getByText(/How do you heat\/cool your home\?/i)).toBeDefined();
    
    // Select Eco Conscious
    const ecoBtn = screen.getByText('Eco Conscious');
    fireEvent.click(ecoBtn);

    // Generate forest / Complete
    const generateBtn = screen.getByRole('button', { name: /generate forest/i });
    fireEvent.click(generateBtn);

    // Verify callback
    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(handleComplete).toHaveBeenCalledWith({
      commute: 'bike_walk',
      diet: 'vegan',
      home: 'eco_conscious'
    });
  });

  it('allows user to navigate back and change previous answers', () => {
    const handleComplete = vi.fn();
    render(<Onboarding onComplete={handleComplete} />);

    // Step 1 select carpooler
    fireEvent.click(screen.getByText('Carpooler'));
    
    // Next
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    
    // Back
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Check we are back to Step 1 and the option is still carpooler (or we can select Solo Driver)
    expect(screen.getByText(/How do you commute\?/i)).toBeDefined();
    fireEvent.click(screen.getByText('Solo Driver'));

    // Go to Step 2
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    
    // Step 2 select Vegetarian
    fireEvent.click(screen.getByText('Vegetarian'));

    // Go to Step 3
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    
    // Step 3 select Average User
    fireEvent.click(screen.getByText('Average User'));

    // Finish
    fireEvent.click(screen.getByRole('button', { name: /generate forest/i }));

    // Expect answers to contain commute: solo_car (overridden), diet: vegetarian, home: moderate
    expect(handleComplete).toHaveBeenCalledWith({
      commute: 'solo_car',
      diet: 'vegetarian',
      home: 'moderate'
    });
  });
});
