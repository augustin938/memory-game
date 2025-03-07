import React from 'react';
import styles from './GamerTypeSelector.module.css';
import { GameType } from '../../App';

interface GameTypeSelectorProps {
  onSelectGameType: (type: GameType) => void;
}

const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({ onSelectGameType }) => {
  return (
    <div className={styles.gameTypeSelector}>
      <h2>Выберите тип игры:</h2>
      <button onClick={() => onSelectGameType('normal')}>Обычный</button>
      <button onClick={() => onSelectGameType('reverse')}>Таймер наоборот</button>
      <button onClick={() => onSelectGameType('endless')}>Бесконечная игра</button>
    </div>
  );
};

export default GameTypeSelector;