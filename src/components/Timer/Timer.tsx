import React from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  time: number;
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  return (
    <div className={styles.timer}>
      <span>Время: {time} сек.</span>
    </div>
  );
};

export default Timer;