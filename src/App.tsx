  import React, { useState, useEffect } from 'react';
  import Header from './components/Header/Header';
  import GameBoard from './components/GameBoard/GameBoard';
  import Timer from './components/Timer/Timer';
  import Score from './components/Score/Score';
  import Button from './components/Button/Button';
  import GameModeSelector from './components/GameModeSelector/GameModeSelector';
  import styles from './App.module.css';

  interface CardData {
    id: number;
    image: string;
    isFlipped: boolean;
  }

  const App: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [gameMode, setGameMode] = useState<number | null>(null);
    

    // Генерация карточек в зависимости от режима игры
    const generateCards = (mode: number) => {
      const totalCards = mode * mode;
      const images = [
        '/src/assets/images/card1.png',
        '/src/assets/images/card2.png',
        '/src/assets/images/card3.png',
        '/src/assets/images/card4.png',
        '/src/assets/images/card5.png',
        '/src/assets/images/card6.png',
        '/src/assets/images/card7.png',
        '/src/assets/images/card8.png',
        '/src/assets/images/card9.png',
        '/src/assets/images/card10.png',
        '/src/assets/images/card11.png',
        '/src/assets/images/card12.png',
        '/src/assets/images/card13.png',
        '/src/assets/images/card14.png',
        '/src/assets/images/card15.png',
        '/src/assets/images/card16.png',
        '/src/assets/images/card17.png',
        '/src/assets/images/card18.png',
      ];
    
      const selectedImages = images.slice(0, totalCards / 2);
      const pairedImages = [...selectedImages, ...selectedImages];
    
      const shuffledCards = pairedImages
        .map((image, index) => ({
          id: index + 1,
          image,
          isFlipped: false,
        }))
        .sort(() => Math.random() - 0.5);
    
      setCards(shuffledCards);
    };

    // Обработчик выбора режима игры
    const handleModeSelect = (mode: number) => {
      setGameMode(mode);
      generateCards(mode);
      setIsGameStarted(false);
      setIsGameFinished(false);
      setMoves(0);
      setTime(0);
    };

    // Запуск таймера
    useEffect(() => {
      let interval: number | undefined;

      if (isGameStarted) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [isGameStarted]);

    // Проверка завершения игры
    // useEffect(() => {
    //   if (cards.every((card) => card.isFlipped)) {
    //     const delay = 1000;
    //     setIsGameFinished(true);
    //     setIsGameStarted(false);
    //   }
    // }, [cards]);

    useEffect(() => {
      if (cards.every((card) => card.isFlipped)) {
        // Задержка перед показом поздравления
        const delay = 1000; // 1 секунда
        const timer = setTimeout(() => {
          setIsGameFinished(true);
          setIsGameStarted(false);
        }, delay);
    
        return () => clearTimeout(timer); // Очистка таймера при размонтировании
      }
    }, [cards]);


    // Обработчик клика по карточке
    const handleCardClick = (id: number) => {
      if (!isGameStarted) setIsGameStarted(true);

      if (cards.find((card) => card.id === id)?.isFlipped) return;

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );

      setSelectedCards((prevSelected) => [...prevSelected, id]);

      if (selectedCards.length === 1) {
        setMoves((prevMoves) => prevMoves + 1);
        const [firstCardId] = selectedCards;
        const firstCard = cards.find((card) => card.id === firstCardId);
        const secondCard = cards.find((card) => card.id === id);

        if (firstCard?.image === secondCard?.image) {
          setSelectedCards([]);
        } else {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstCardId || card.id === id
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setSelectedCards([]);
          }, 1000);
        }
      }
    };

    // Обработчик новой игры
    const handleNewGame = () => {
      if (gameMode) {
        generateCards(gameMode);
      }
      setSelectedCards([]);
      setMoves(0);
      setTime(0);
      setIsGameStarted(false);
      setIsGameFinished(false);
    };

    // Обработчик возврата в главное меню
    const handleReturnToMainMenu = () => {
      setGameMode(null);
      setCards([]);
      setSelectedCards([]);
      setMoves(0);
      setTime(0);
      setIsGameStarted(false);
      setIsGameFinished(false);
    };

  return (
    <div className={styles.container}>
      <Header />
      {!gameMode ? (
        <GameModeSelector onSelectMode={handleModeSelect} />
      ) : (
        <>
          <Timer time={time} />
          <Score moves={moves} />
          {isGameFinished ? (
            <div className={styles.gameFinished}>
              <h2>Поздравляем! Вы выиграли!</h2>
              <Button onClick={handleNewGame}>Новая игра</Button>
              <Button onClick={handleReturnToMainMenu}>Выйти в главное меню</Button>
            </div>
          ) : (
            <>
              <GameBoard cards={cards} onCardClick={handleCardClick} mode={gameMode} />
              <div className={styles.buttonContainer}>
                <Button onClick={handleReturnToMainMenu}>Выйти в главное меню</Button>
                <Button onClick={handleNewGame}>Новая игра</Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
  };

  export default App;