import styles from "./Card.module.css";

interface CardProps {
  image: string;
  isFlipped: boolean;
  onClick: () => void;
  isClickable: boolean;
}

export default function Card({ image, isFlipped, onClick, isClickable }: CardProps) {
  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className={styles.front}>
        <img src={image} alt="card" />
      </div>
      <div className={styles.back}></div>
    </div>
  );
}