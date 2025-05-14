import { test, expect, Page } from '@playwright/test';

test.describe('Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Авторизация и главное меню', async () => {
    // Проверяем форму авторизации
    await expect(page.locator('h2:has-text("Авторизация")')).toBeVisible();
    const nameInput = page.locator('input[placeholder="Введите Ваше имя"]');
    await expect(nameInput).toBeVisible();
    
    // Вводим имя и авторизуемся
    await nameInput.fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Проверяем, что появилось главное меню
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
    await expect(page.locator('h2:has-text("Выберите оформление карточек")')).toBeVisible();
  });

  test('Полная игра - обычный режим', async ({ page }) => {
    // Авторизация
    await page.goto('http://localhost:5173');
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Выбор режима игры
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Обычный")');
    
    // Проверяем начальное состояние счетчика
    const movesCounter = page.locator('[data-testid="moves-counter"]');
    await expect(movesCounter).toHaveText('Ходы: 0');
    
    // Получаем все карты
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    // Кликаем первую карту и ждем переворота
    await cards[0].click();
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    // Кликаем вторую карту (это должен быть полноценный ход)
    await cards[1].click();
    
    // Проверяем обновление счетчика с повторными попытками
    await expect(async () => {
      const text = await movesCounter.textContent();
      expect(text).toBe('Ходы: 1');
    }).toPass({ timeout: 5000 });
    
    // Проверяем таймер
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toContainText(/Время: [1-9]/);
    

    // Возврат в меню
    await page.click('button:has-text("Главное меню")');
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });

  test('Таймер наоборот', async () => {
    // Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Выбор режима игры
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Таймер наоборот")');
    
    // Проверяем начальное состояние таймера (5 секунд для 2x2)
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toHaveText('Осталось: 5 сек.');
    
    // Получаем все карты
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    // Кликаем первую карту и ждем переворота
    await cards[0].click();
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    // Кликаем вторую карту (это должен добавить время)
    await cards[1].click();
    
    // 7. Проверяем что время увеличилось
    await expect(timer).not.toHaveText('Осталось: 5 сек.');
    
    // 8. Проверяем паузу
     await page.click('button:has-text("Пауза")');
     await expect(page.locator('h2:has-text("Игра на паузе")')).toBeVisible();
    
    // 9. Продолжаем игру
    await page.click('button:has-text("Продолжить")');
    
    // 10. Возвращаемся в главное меню
    await page.click('button:has-text("Главное меню")');
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });
  
  test('Бесконечный режим', async () => {
  // Авторизация
  await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
  await page.click('button:has-text("Начать игру")');
  
  // Выбор режима игры
  await page.click('button:has-text("2x2")');
  await page.click('button:has-text("Бесконечная игра")');
  
  // Проверяем бесконечный таймер
  await expect(page.locator('[data-testid="timer"]')).toContainText('∞');
  
  // Получаем все карты
  const cards = await page.locator('[data-testid="card"]').all();
  expect(cards.length).toBe(4);
  
  // // 5. Открываем все карты с проверкой их состояния
  //   for (let i = 0; i < cards.length; i++) {
  //     await cards[i].click();
  //     await expect(cards[i].locator('[data-testid="card-front"]')).toBeVisible();
  //     if (i < cards.length - 1) {
  //       await page.waitForTimeout(200);
  //     }
  //   }
  
  // // 6. Ждем появления сообщения о завершении раунда
  // const gameStatus = page.locator('[data-testid="game-status"]');
  // await expect(gameStatus).toBeVisible({ timeout: 50000 });
  // await expect(gameStatus).toContainText(/Раунд \d+ завершен!/);
  
  // // 7. Ждем пока начнется новый раунд (если нужно)
  // await page.waitForTimeout(1000);
  
  //  Завершаем игру
  const gameStatus = page.locator('[data-testid="game-status"]');
  await page.click('button:has-text("Завершить игру")');
  await expect(gameStatus).toContainText('Игра завершена!');
  
  // Возвращаемся в главное меню
  await page.click('button:has-text("Главное меню")');
  await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
});
  
  test('Выбор набора карточек', async () => {
    // Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Проверяем выбор оформления карт
    await expect(page.locator('button:has-text("Классические")')).toBeVisible();
    await expect(page.locator('button:has-text("Животные")')).toBeVisible();
    await expect(page.locator('button:has-text("Смайлики")')).toBeVisible();
    
    // Выбираем смайлики
    await page.click('button:has-text("Смайлики")');
    
    // Выбираем режим 2x2 и обычную игру
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Обычный")');
    
    // Проверяем, что карты отображаются
    const cardImages = page.locator('[data-testid="card-front"] img');
    await expect(cardImages.first()).toHaveAttribute('src', /emoji/);
  });

  test('Статистика', async () => {
    // Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Открываем статистику
    await page.click('button:has-text("Показать статистику")');
    
    // Проверяем отображение статистики
    await expect(page.locator('h2:has-text("Статистика игрока: Test Player")')).toBeVisible();
    await expect(page.locator('h3:has-text("Последние игры")')).toBeVisible();
    await expect(page.locator('h3:has-text("Лучшие результаты")')).toBeVisible();
    
    // Закрываем статистику
    await page.click('button:has-text("Скрыть статистику")');
    await expect(page.locator('h2:has-text("Статистика игрока: Test Player")')).not.toBeVisible();
  });

  test('ВЫход из аккаунта', async () => {
    // Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Выходим из аккаунта
    await page.click('button >> nth=0'); // Кнопка выхода
    await expect(page.locator('h2:has-text("Авторизация")')).toBeVisible();
  });
});