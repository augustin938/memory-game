import React from 'react';
import styles from './Timer.module.css';
import { GameType } from '../../App';

interface TimerProps {
  time: number; // Для обычного таймера
  timeLeft?: number; // Для таймера "наоборот"
  timerType: GameType;
}

const Timer: React.FC<TimerProps> = ({ time, timeLeft, timerType }) => {
  return (
    <div className={styles.timer}>
      {timerType === 'normal' ? (
        `Время: ${time} сек.`
      ) : timerType === 'reverse' ? (
        `Осталось: ${timeLeft} сек.`
      ) : (
        <span className={styles.infinity} title="Режим 'Бесконечная игра'">∞</span>
      )}
    </div>
  );
};

export default Timer;