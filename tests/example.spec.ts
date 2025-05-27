import { test, expect, Page } from '@playwright/test';

// Увеличиваем общий таймаут для тестов
test.setTimeout(120000);

test.describe('Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(1000); // Пауза после загрузки страницы
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Авторизация и главное меню', async () => {
    await expect(page.locator('h2:has-text("Авторизация")')).toBeVisible();
    const nameInput = page.locator('input[placeholder="Введите Ваше имя"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Test Player');
    await page.waitForTimeout(500); // Пауза после ввода имени
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000); // Пауза после перехода
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
    await expect(page.locator('h2:has-text("Выберите оформление карточек")')).toBeVisible();
  });

  test('Полная игра - обычный режим', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(500);
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("2x2")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Обычный")');
    await page.waitForTimeout(1000); // Пауза перед началом игры
    
    const movesCounter = page.locator('[data-testid="moves-counter"]');
    await expect(movesCounter).toHaveText('Ходы: 0');
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    await cards[0].click();
    await page.waitForTimeout(1000); // Пауза после первого клика
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    await cards[1].click();
    await page.waitForTimeout(1000); // Пауза после второго клика
    await expect(async () => {
      const text = await movesCounter.textContent();
      expect(text).toBe('Ходы: 1');
    }).toPass({ timeout: 5000 });
    
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toContainText(/Время: [1-9]/);
    await page.waitForTimeout(1000); // Пауза перед возвратом в меню
    await page.click('button:has-text("Главное меню")');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });

  test('Таймер наоборот', async () => {
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("2x2")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Таймер наоборот")');
    await page.waitForTimeout(1000);
    
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toHaveText('Осталось: 5 сек.');
    const cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    
    await cards[0].click();
    await page.waitForTimeout(1000);
    await expect(cards[0].locator('[data-testid="card-front"]')).toBeVisible();
    
    await cards[1].click();
    await page.waitForTimeout(1000);
    await expect(timer).not.toHaveText('Осталось: 5 сек.');
    
    await page.click('button:has-text("Пауза")');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Игра на паузе")')).toBeVisible();
    
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Продолжить")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Главное меню")');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });
  
  test('Бесконечный режим', async () => {
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("2x2")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Бесконечная игра")');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('[data-testid="timer"]')).toContainText('∞');
    let cards = await page.locator('[data-testid="card"]').all();
    expect(cards.length).toBe(4);
    const matchedIndices = new Set<number>();

    while (matchedIndices.size < cards.length) {
      for (let i = 0; i < cards.length; i++) {
        if (matchedIndices.has(i)) continue;

        await cards[i].click();
        await page.waitForTimeout(1000); // Пауза после клика
        await expect(cards[i].locator('[data-testid="card-front"]')).toBeVisible();

        for (let j = 0; j < cards.length; j++) {
          if (i === j || matchedIndices.has(j)) continue;

          await cards[j].click();
          await page.waitForTimeout(1000); // Пауза после клика
          await expect(cards[j].locator('[data-testid="card-front"]')).toBeVisible();

          const firstCardImage = await cards[i].locator('[data-testid="card-front"] img').getAttribute('src');
          const secondCardImage = await cards[j].locator('[data-testid="card-front"] img').getAttribute('src');

          if (firstCardImage === secondCardImage) {
            matchedIndices.add(i);
            matchedIndices.add(j);
            await page.waitForTimeout(1500); // Пауза при совпадении
            break;
          } else {
            await page.waitForTimeout(1500); // Пауза перед скрытием
            await cards[i].click();
            await cards[j].click();
            await page.waitForTimeout(1000); // Пауза после скрытия
          }
        }
      }
    }
    
    const gameStatus = page.locator('[data-testid="game-status"]').first();
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Завершить игру")');
    await page.waitForTimeout(1000);
    await expect(gameStatus).toContainText('Игра завершена!');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Главное меню")');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Выберите режим игры")')).toBeVisible();
  });
  
  test('Выбор набора карточек', async () => {
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('button:has-text("Классические")')).toBeVisible();
    await expect(page.locator('button:has-text("Животные")')).toBeVisible();
    await expect(page.locator('button:has-text("Смайлики")')).toBeVisible();
    
    await page.click('button:has-text("Смайлики")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("2x2")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Обычный")');
    await page.waitForTimeout(1000);
    
    const cardImages = page.locator('[data-testid="card-front"] img');
    await expect(cardImages.first()).toHaveAttribute('src', /emoji/);
  });

  test('Статистика', async () => {
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    
    await page.click('button:has-text("Показать статистику")');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Статистика игрока: Test Player")')).toBeVisible();
    await expect(page.locator('h3:has-text("Последние игры")')).toBeVisible();
    await expect(page.locator('h3:has-text("Лучшие результаты")')).toBeVisible();
    
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Скрыть статистику")');
    await page.waitForTimeout(500);
    await expect(page.locator('h2:has-text("Статистика игрока: Test Player")')).not.toBeVisible();
  });

  test('Выход из аккаунта', async () => {
    await page.locator('input[placeholder="Введите Ваше имя"]').fill('Test Player');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Начать игру")');
    await page.waitForTimeout(1000);
    
    await page.click('button >> nth=0');
    await page.waitForTimeout(1000);
    await expect(page.locator('h2:has-text("Авторизация")')).toBeVisible();
  });
});