import React from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  time: number; // Для обычного таймера
  timeLeft?: number; // Для таймера "наоборот"
  timerType: 'normal' | 'reverse';
}

const Timer: React.FC<TimerProps> = ({ time, timeLeft, timerType }) => {
  return (
    <div className={styles.timer}>
      {timerType === 'normal' ? `Время: ${time} сек.` : `Осталось: ${timeLeft} сек.`}
    </div>
  );
};

export default Timer;