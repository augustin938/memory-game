import styles from "./Timer.module.css";
import { GameType } from "../../App";

interface TimerProps {
  time: number; // Для обычного таймера
  timeLeft?: number; // Для таймера "наоборот"
  timerType: GameType;
}

export default function Timer({ time, timeLeft, timerType }: TimerProps) {
  return (
    <div className={styles.timer} data-testid="timer">
      {timerType === "normal" ? (
        `Время: ${time} сек.`
      ) : timerType === "reverse" ? (
        `Осталось: ${timeLeft} сек.`
      ) : (
        <span className={styles.infinity} title="Режим 'Бесконечная игра'">
          ∞
        </span>
      )}
    </div>
  );
}