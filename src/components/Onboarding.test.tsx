import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from './Onboarding';

/**
 * @file Onboarding.test.tsx
 * @description Integration tests for the multi-step CO2 Matcher onboarding questionnaire.
 * Validates step progression, answer state, back-navigation, and final callback payload.
 */

// Mock audio utility to prevent AudioContext instantiation in jsdom
vi.mock('../utils/audio', () => ({
  audio: {
    playSuccess: vi.fn(),
    playDecline: vi.fn(),
    playJingle: vi.fn()
  }
}));

describe('Onboarding Component', () => {
  it('renders Step 1 commute question on initial mount', () => {
    render(<Onboarding onComplete={vi.fn()} />);
    expect(screen.getByText(/How do you commute\?/i)).toBeInTheDocument();
    expect(screen.getByText('Solo Driver')).toBeInTheDocument();
    expect(screen.getByText('Active Commute')).toBeInTheDocument();
  });

  it('completes full questionnaire with eco-friendly choices and calls onComplete', () => {
    const handleComplete = vi.fn();
    render(<Onboarding onComplete={handleComplete} />);

    // Step 1: Select Active Commute (bike_walk)
    fireEvent.click(screen.getByText('Active Commute'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 2: Verify step rendered, select Plant-Based (vegan)
    expect(screen.getByText(/What does your diet look like\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Plant-Based'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 3: Verify step rendered, select Eco Conscious
    expect(screen.getByText(/How do you heat\/cool your home\?/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Eco Conscious'));
    fireEvent.click(screen.getByRole('button', { name: /generate forest/i }));

    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(handleComplete).toHaveBeenCalledWith({
      commute: 'bike_walk',
      diet: 'vegan',
      home: 'eco_conscious'
    });
  });

  it('completes full questionnaire with high-emission choices and calls onComplete', () => {
    const handleComplete = vi.fn();
    render(<Onboarding onComplete={handleComplete} />);

    // Step 1: Solo car
    fireEvent.click(screen.getByText('Solo Driver'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 2: Heavy meat
    fireEvent.click(screen.getByText('Meat Enthusiast'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 3: High power user
    fireEvent.click(screen.getByText('High Power User'));
    fireEvent.click(screen.getByRole('button', { name: /generate forest/i }));

    expect(handleComplete).toHaveBeenCalledWith({
      commute: 'solo_car',
      diet: 'heavy_meat',
      home: 'large_ac'
    });
  });

  it('allows back-navigation and overriding a previous answer', () => {
    const handleComplete = vi.fn();
    render(<Onboarding onComplete={handleComplete} />);

    // Step 1: Select Carpooler first, then go back and change to Solo Driver
    fireEvent.click(screen.getByText('Carpooler'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Go back to Step 1
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText(/How do you commute\?/i)).toBeInTheDocument();

    // Override to Solo Driver
    fireEvent.click(screen.getByText('Solo Driver'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 2: Vegetarian
    fireEvent.click(screen.getByText('Vegetarian'));
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    // Step 3: Average User
    fireEvent.click(screen.getByText('Average User'));
    fireEvent.click(screen.getByRole('button', { name: /generate forest/i }));

    expect(handleComplete).toHaveBeenCalledWith({
      commute: 'solo_car',
      diet: 'vegetarian',
      home: 'moderate'
    });
  });

  it('does not show Back button on Step 1', () => {
    render(<Onboarding onComplete={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('shows Back button on Step 2 and Step 3', () => {
    render(<Onboarding onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next step/i }));
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
