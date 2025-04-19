import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from './GameControls';

describe('GameControls Component', () => {
  const baseProps = {
    onNewGame: vi.fn(),
    onReturnToMainMenu: vi.fn(),
    onPauseGame: vi.fn(),
    isGamePaused: false,
    gameType: 'normal' as const
  };

  it('renders basic controls for normal game', () => {
    render(<GameControls {...baseProps} />);
    expect(screen.getByText('Главное меню')).toBeInTheDocument();
    expect(screen.getByText('Новая игра')).toBeInTheDocument();
  });

  it('renders pause button for reverse game', () => {
    render(<GameControls {...baseProps} gameType="reverse" />);
    expect(screen.getByText('Пауза')).toBeInTheDocument();
  });

  it('renders end game button for endless game', () => {
    render(<GameControls {...baseProps} gameType="endless" onEndGame={vi.fn()} />);
    expect(screen.getByText('Завершить игру')).toBeInTheDocument();
  });

  it('changes pause button text when paused', () => {
    const { rerender } = render(<GameControls {...baseProps} gameType="reverse" isGamePaused={false} />);
    expect(screen.getByText('Пауза')).toBeInTheDocument();
    
    rerender(<GameControls {...baseProps} gameType="reverse" isGamePaused={true} />);
    expect(screen.getByText('Продолжить')).toBeInTheDocument();
  });

  it('calls correct handlers on button clicks', () => {
    const mockEndGame = vi.fn();
    render(<GameControls {...baseProps} gameType="endless" onEndGame={mockEndGame} />);
    
    fireEvent.click(screen.getByText('Главное меню'));
    expect(baseProps.onReturnToMainMenu).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Новая игра'));
    expect(baseProps.onNewGame).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Завершить игру'));
    expect(mockEndGame).toHaveBeenCalled();
  });
});