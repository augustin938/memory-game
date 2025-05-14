import styles from "./GameInfo.module.css";
import Timer from "../Timer/Timer";
import Score from "../Score/Score";
import { GameInfoProps } from "../../types/types";


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

