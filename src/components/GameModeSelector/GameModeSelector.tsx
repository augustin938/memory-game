import React from 'react';
import styles from './GameModeSelector.module.css';

interface GameModeSelectorProps {
  onSelectMode: (mode: number) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className={styles.selector}>
      <h2>Выберите режим игры:</h2>
      <button onClick={() => onSelectMode(2)}>2x2</button>
      <button onClick={() => onSelectMode(4)}>4x4</button>
      <button onClick={() => onSelectMode(6)}>6x6</button>
    </div>
  );
};

export default GameModeSelector;