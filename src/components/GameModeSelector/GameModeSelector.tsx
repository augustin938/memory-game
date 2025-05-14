import styles from "./GameModeSelector.module.css";
import Button from "../Button/Button";
import { GameModeSelectorProps } from "../../types/types";

export default function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  return (
    <div className={styles.selector}>
      <h2>Выберите режим игры</h2>
      <Button onClick={() => onSelectMode(2)}>2x2</Button>
      <Button onClick={() => onSelectMode(4)}>4x4</Button>
      <Button onClick={() => onSelectMode(6)}>6x6</Button>
    </div>
  );
}