import styles from "./GameInfo.module.css";
import Timer from "../Timer/Timer";
import Score from "../Score/Score";
import { GameType } from "../../App";


interface GameInfoProps {
  time: number;
  timeLeft?: number;
  timerType: GameType;
  moves: number;
  rounds: number;
}

export default function GameInfo({
  time,
  timeLeft,
  timerType,
  moves,
  rounds,
}: GameInfoProps) {
  return (
    <div className={styles.gameInfo}>
      <Timer time={time} timeLeft={timeLeft} timerType={timerType} />
      <Score moves={moves} />
      {timerType === "endless" && (
        <div className={styles.rounds}>Раундов завершено: {rounds}</div>
      )}
    </div>
  );
}

