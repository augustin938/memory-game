import { cardSets } from "../cardSets ";
import Button from "../Button/Button";
import styles from "./CardSetSelector.module.css";

interface CardSetSelectorProps {
  onSelectCardSet: (set: keyof typeof cardSets) => void;
}

export default function CardSetSelector({ onSelectCardSet }: CardSetSelectorProps) {
  return (
    <div className={styles.cardSetSelector}>
      <h2>Выберите оформление карточек</h2>
        {Object.keys(cardSets).map((set) => (
          <Button 
            key={set}
            onClick={() => onSelectCardSet(set as keyof typeof cardSets)}
          >
            {set === 'classic' && 'Классические'}
            {set === 'animals' && 'Животные'}
            {set === 'emojis' && 'Смайлики'}
          </Button>
        ))}
      </div>
  );
}