import styles from './Card.module.css';

interface CardProps {
  image: string;       // Путь к изображению карточки
  isFlipped: boolean;  // Состояние карточки (перевернута или нет)
  onClick: () => void; // Функция, которая вызывается при клике на карточку
}

function Card ({ image, isFlipped, onClick }: CardProps) {
  return (
    <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} onClick={onClick}>
      <div className={styles.front}>
        <img src={image} alt="card" />
      </div>
      <div className={styles.back}></div>
    </div>
  );
};

export default Card;