import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NeoButton } from './NeoButton';

/**
 * @file NeoButton.test.tsx
 * @description Unit tests for the custom NeoButton component.
 */

describe('NeoButton Component', () => {
  it('renders children correctly', () => {
    render(<NeoButton>Click Me</NeoButton>);
    expect(screen.getByText('Click Me')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<NeoButton onClick={handleClick}>Click Me</NeoButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { container } = render(<NeoButton variant="danger">Danger Button</NeoButton>);
    const button = container.querySelector('button');
    expect(button).toBeDefined();
    if (button) {
      // #EF4444 is rgb(239, 68, 68)
      expect(button.style.backgroundColor).toBe('rgb(239, 68, 68)');
    }
  });

  it('handles mouse hover and press state transitions without crashing', () => {
    render(<NeoButton>Hover Me</NeoButton>);
    const button = screen.getByRole('button', { name: /hover me/i });
    
    // Test hover enter
    fireEvent.mouseEnter(button);
    expect(button.style.transform).toBe('translate(-2px, -2px)');

    // Test hover leave
    fireEvent.mouseLeave(button);
    expect(button.style.transform).toBe('none');

    // Test mouse down
    fireEvent.mouseDown(button);
    expect(button.style.transform).toBe('translate(1px, 1px)');

    // Test mouse up
    fireEvent.mouseUp(button);
    expect(button.style.transform).toBe('translate(-2px, -2px)');
  });
});
