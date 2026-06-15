import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NeoButton } from './NeoButton';

/**
 * @file NeoButton.test.tsx
 * @description Unit tests for the NeoButton component covering rendering,
 * click events, variant styling, disabled state, and hover/press interactions.
 */

describe('NeoButton Component', () => {
  it('renders children text content in the DOM', () => {
    render(<NeoButton>Click Me</NeoButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders as an accessible button element', () => {
    render(<NeoButton>Submit</NeoButton>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('calls onClick handler once when clicked', () => {
    const handleClick = vi.fn();
    render(<NeoButton onClick={handleClick}>Click Me</NeoButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when button is disabled', () => {
    const handleClick = vi.fn();
    render(<NeoButton onClick={handleClick} disabled>Disabled</NeoButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies danger variant background color', () => {
    const { container } = render(<NeoButton variant="danger">Danger</NeoButton>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    // #EF4444 renders as rgb(239, 68, 68) in jsdom
    expect(button?.style.backgroundColor).toBe('rgb(239, 68, 68)');
  });

  it('applies success variant background color', () => {
    const { container } = render(<NeoButton variant="success">Success</NeoButton>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    // #10B981 renders as rgb(16, 185, 129) in jsdom
    expect(button?.style.backgroundColor).toBe('rgb(16, 185, 129)');
  });

  it('applies custom className to button element', () => {
    const { container } = render(<NeoButton className="my-custom-class">Styled</NeoButton>);
    expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
  });

  it('animates transform on mouse hover enter and leave', () => {
    render(<NeoButton>Hover Me</NeoButton>);
    const button = screen.getByRole('button', { name: 'Hover Me' });

    fireEvent.mouseEnter(button);
    expect(button.style.transform).toBe('translate(-2px, -2px)');

    fireEvent.mouseLeave(button);
    expect(button.style.transform).toBe('none');
  });

  it('animates transform on mouse press and release', () => {
    render(<NeoButton>Press Me</NeoButton>);
    const button = screen.getByRole('button', { name: 'Press Me' });

    fireEvent.mouseDown(button);
    expect(button.style.transform).toBe('translate(1px, 1px)');

    fireEvent.mouseUp(button);
    expect(button.style.transform).toBe('translate(-2px, -2px)');
  });
});
