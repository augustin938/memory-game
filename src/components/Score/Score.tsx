import { ScoreProps } from "../../types/types";
import styles from "./Score.module.css";

export default function Score({ moves }: ScoreProps) {
  return (
    <div className={styles.score} data-testid="moves-counter">
      <span>Ходы: {moves}</span>
    </div>
  );
}