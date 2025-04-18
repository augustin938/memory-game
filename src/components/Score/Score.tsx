import styles from "./Score.module.css";

interface ScoreProps {
  moves: number;
}

export default function Score({ moves }: ScoreProps) {
  return (
    <div className={styles.score}>
      <span>Ходы: {moves}</span>
    </div>
  );
}