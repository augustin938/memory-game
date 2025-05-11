import { test, expect, Page } from '@playwright/test';

test.describe('Memory Game Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Authorization and initial state', async () => {
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

  test('Full game flow - normal mode', async ({ page }) => {
    // 1. Авторизация
    await page.goto('http://localhost:5173');
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // 2. Выбор режима игры
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Обычный")');
    
    // 3. Проверяем начальное состояние счетчика
    const movesCounter = page.locator('[data-testid="moves-counter"]');
    await expect(movesCounter).toHaveText('Ходы: 0');
    
    // 4. Получаем все карты
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    // 5. Кликаем первую карту и ждем переворота
    await cards[0].click();
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    // 6. Кликаем вторую карту (это должен быть полноценный ход)
    await cards[1].click();
    
    // 7. Проверяем обновление счетчика с повторными попытками
    await expect(async () => {
      const text = await movesCounter.textContent();
      expect(text).toBe('Ходы: 1');
    }).toPass({ timeout: 5000 });
    
    // 8. Проверяем таймер
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toContainText(/Время: [1-9]/);
    

    // 9. Возврат в меню
    await page.click('button:has-text("Главное меню")');
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });

  test('Reverse timer mode flow', async () => {
    // 1. Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // 2. Выбор режима игры
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Таймер наоборот")');
    
    // 3. Проверяем начальное состояние таймера (5 секунд для 2x2)
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toHaveText('Осталось: 5 сек.');
    
    // 4. Получаем все карты
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    // 5. Кликаем первую карту и ждем переворота
    await cards[0].click();
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    // 6. Кликаем вторую карту (это должен добавить время)
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
  
  test('Endless mode flow', async () => {
    // 1. Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // 2. Выбор режима игры
    await page.click('button:has-text("2x2")');
    await page.click('button:has-text("Бесконечная игра")');
    
    // 3. Проверяем бесконечный таймер
    await expect(page.locator('[data-testid="timer"]')).toContainText('∞');
    
    // 4. Получаем все карты
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    // 5. Открываем все карты для завершения раунда
    for (const card of cards) {
      await card.click();
      await page.waitForTimeout(500); // Увеличиваем задержку
    }
    
    // 6. Проверяем сообщение о завершении раунда через data-testid
    const gameStatus = page.locator('[data-testid="game-status"]');
    await expect(gameStatus).toBeVisible();
    await expect(gameStatus).toContainText('Раунд 1 завершен!');
    
    // 7. Ждем пока начнется новый раунд
    await page.waitForTimeout(1000);
    
    // 8. Завершаем игру
    await page.click('button:has-text("Завершить игру")');
    await expect(gameStatus).toContainText('Игра завершена!');
    
    // 9. Возвращаемся в главное меню
    await page.click('button:has-text("Главное меню")');
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });
  
  test('Card sets selection', async () => {
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

  test('Player statistics', async () => {
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

  test('Logout', async () => {
    // Авторизация
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.click('button:has-text("Начать игру")');
    
    // Выходим из аккаунта
    await page.click('button >> nth=0'); // Кнопка выхода
    await expect(page.locator('h2:has-text("Авторизация")')).toBeVisible();
  });
});