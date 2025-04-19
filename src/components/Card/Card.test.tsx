import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import styles from './Card.module.css';

describe('Card Component', () => {
  const mockProps = {
    image: 'test-image.jpg',
    isFlipped: false,
    onClick: vi.fn(),
    isClickable: true
  };

  it('renders card with back side by default', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByTestId('card-back')).toBeInTheDocument();
    expect(screen.getByTestId('card-front')).toHaveClass(styles.front);
  });

  it('shows front side when flipped', () => {
    render(<Card {...mockProps} isFlipped={true} />);
    expect(screen.getByTestId('card-front')).toBeVisible();
    expect(screen.getByTestId('card-front').querySelector('img')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('does not call onClick when not clickable', () => {
    render(<Card {...mockProps} isClickable={false} />);
    fireEvent.click(screen.getByTestId('card'));
    expect(mockProps.onClick).not.toHaveBeenCalled();
  });

  it('has correct classes based on props', () => {
    const { rerender } = render(<Card {...mockProps} />);
    expect(screen.getByTestId('card')).toHaveClass(styles.card);
    expect(screen.getByTestId('card')).not.toHaveClass(styles.flipped);
    
    rerender(<Card {...mockProps} isFlipped={true} />);
    expect(screen.getByTestId('card')).toHaveClass(styles.flipped);
  });
});