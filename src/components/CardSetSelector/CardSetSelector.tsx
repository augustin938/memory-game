import { cardSets } from "../cardSets ";
import Button from "../Button/Button";
import styles from "./CardSetSelector.module.css";

interface CardSetSelectorProps {
  onSelectCardSet: (set: keyof typeof cardSets) => void;
}

export default function CardSetSelector({ onSelectCardSet }: CardSetSelectorProps) {
  return (
    <div className={styles.cardSetSelector}>
      <h2>Выберите набор карточек:</h2>
      <Button onClick={() => onSelectCardSet("animals")}>Животные</Button>
      <Button onClick={() => onSelectCardSet("emojis")}>Смайлики</Button>
      <Button onClick={() => onSelectCardSet("classic")}>Классические</Button>
    </div>
  );
}