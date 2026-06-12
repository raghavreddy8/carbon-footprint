import { describe, it, expect } from 'vitest';
import {
  calculateInitialFootprint,
  getCarbonEquivalents,
  getDynamicTheme,
  type OnboardingAnswers
} from './carbonCalc';

describe('Carbon Footprint Calculator Utils', () => {
  describe('calculateInitialFootprint', () => {
    it('should calculate the correct baseline footprint for high emission choices', () => {
      const answers: OnboardingAnswers = {
        commute: 'solo_car', // 200
        diet: 'heavy_meat', // 100
        home: 'large_ac' // 150
      };
      
      const result = calculateInitialFootprint(answers);
      
      expect(result.transport).toBe(200);
      expect(result.food).toBe(100);
      expect(result.home).toBe(150);
      expect(result.goods).toBe(50); // constant baseline
      expect(result.total).toBe(500); // 200 + 100 + 150 + 50
    });

    it('should calculate the correct baseline footprint for low emission choices', () => {
      const answers: OnboardingAnswers = {
        commute: 'bike_walk', // 5
        diet: 'vegan', // 15
        home: 'eco_conscious' // 40
      };

      const result = calculateInitialFootprint(answers);

      expect(result.transport).toBe(5);
      expect(result.food).toBe(15);
      expect(result.home).toBe(40);
      expect(result.goods).toBe(50);
      expect(result.total).toBe(110); // 5 + 15 + 40 + 50
    });
  });

  describe('getCarbonEquivalents', () => {
    it('should translate carbon savings in kg into correct relative units', () => {
      const savedKg = 16.7; // Exactly 10 trees (16.7 / 1.67)
      const equivalents = getCarbonEquivalents(savedKg);

      expect(equivalents.treesPlanted).toBe(10);
      expect(equivalents.carMilesAvoided).toBe(Math.round(16.7 / 0.4));
      expect(equivalents.phonesCharged).toBe(Math.round(16.7 / 0.0083));
      expect(equivalents.trashBagsDiverted).toBe(Math.round((16.7 / 15) * 10) / 10);
    });
  });

  describe('getDynamicTheme', () => {
    it('should return polluted theme when score is at 100% of baseline', () => {
      const theme = getDynamicTheme(400, 400); // ratio = 1.0
      expect(theme.themeName).toBe('polluted');
      expect(theme.characterState).toBe('sad');
      expect(theme.accentColor).toBe('#EF4444');
    });

    it('should return neutral theme when score is at 70% of baseline', () => {
      const theme = getDynamicTheme(280, 400); // ratio = 0.7
      expect(theme.themeName).toBe('neutral');
      expect(theme.characterState).toBe('neutral');
      expect(theme.accentColor).toBe('#F59E0B');
    });

    it('should return healthy theme when footprint is low (< 150 kg)', () => {
      const theme = getDynamicTheme(120, 400); // low absolute value
      expect(theme.themeName).toBe('healthy');
      expect(theme.characterState).toBe('happy');
      expect(theme.accentColor).toBe('#10B981');
    });
  });
});
