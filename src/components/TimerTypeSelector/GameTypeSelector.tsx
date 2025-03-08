import styles from "./GameTypeSelector.module.css";
import { GameType } from "../../App";

interface GameTypeSelectorProps {
  onSelectGameType: (type: GameType) => void;
}

export default function GameTypeSelector({
  onSelectGameType,
}: GameTypeSelectorProps) {
  return (
    <div className={styles.gameTypeSelector}>
      <h2>Выберите тип игры:</h2>
      <button onClick={() => onSelectGameType("normal")}>Обычный</button>
      <button onClick={() => onSelectGameType("reverse")}>
        Таймер наоборот
      </button>
      <button onClick={() => onSelectGameType("endless")}>
        Бесконечная игра
      </button>
    </div>
  );
}
