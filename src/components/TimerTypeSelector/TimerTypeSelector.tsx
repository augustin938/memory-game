import React from 'react';
import styles from './TimerTypeSelector.module.css';

interface TimerTypeSelectorProps {
  onSelectTimerType: (type: 'normal' | 'reverse') => void;
}

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({ onSelectTimerType }) => {
  return (
    <div className={styles.timerTypeSelector}>
      <h2>Выберите тип таймера:</h2>
      <button onClick={() => onSelectTimerType('normal')}>Обычный</button>
      <button onClick={() => onSelectTimerType('reverse')}>Таймер наоборот</button>
    </div>
  );
};

export default TimerTypeSelector;