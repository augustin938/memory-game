import React from 'react';
import styles from './Score.module.css';

interface ScoreProps {
  moves: number;
}

const Score: React.FC<ScoreProps> = ({ moves }) => {
  return (
    <div className={styles.score}>
      <span>Ходы: {moves}</span>
    </div>
  );
};

export default Score;