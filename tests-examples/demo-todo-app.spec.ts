// import { test, expect } from '@playwright/test';

// test.describe('Memory Game Tests', () => {
//   let page;

//   test.beforeAll(async ({ browser }) => {
//     page = await browser.newPage();
//     await page.goto('http://localhost:5173', { 
//       timeout: 60000,
//       waitUntil: 'networkidle'
//     });
//     await page.getByPlaceholder('Введите Ваше имя').fill('Test Player', { timeout: 15000 });
//     await page.getByRole('button', { name: 'Начать игру' }).click({ timeout: 15000 });
//     await page.waitForLoadState('networkidle', { timeout: 30000 });
//   });

//   test('should show game mode selection after login', async () => {
//     await expect(page.getByText('Выберите режим игры')).toBeVisible({ timeout: 20000 });
//     await expect(page.getByRole('button', { name: '2x2' })).toBeVisible({ timeout: 15000 });
//     await expect(page.getByRole('button', { name: '4x4' })).toBeVisible({ timeout: 15000 });
//     await expect(page.getByRole('button', { name: '6x6' })).toBeVisible({ timeout: 15000 });
//   });

//   test('should start game in 2x2 mode', async () => {
//     await page.getByRole('button', { name: '2x2' }).click({ timeout: 15000 });
//     await expect(page.getByText('Выберите тип игры')).toBeVisible({ timeout: 20000 });
//     await page.getByRole('button', { name: 'Обычный' }).click({ timeout: 15000 });
    
//     await expect(page.locator('[data-testid="card"]')).toHaveCount(4, { timeout: 20000 });
//     await expect(page.getByText('Время: 0 сек.')).toBeVisible({ timeout: 20000 });
//   });

//   test('should flip cards and count moves', async () => {
//     const cards = page.locator('[data-testid="card"]');
//     await cards.first().click({ timeout: 15000 });
//     await expect(cards.first().locator('[data-testid="card-front"]'))
//       .toBeVisible({ timeout: 20000 });
    
//     await cards.nth(1).click({ timeout: 15000 });
//     await expect(page.getByText('Ходы: 1')).toBeVisible({ timeout: 20000 });
//   });

//   test('should pause and resume game', async () => {
//     await page.getByRole('button', { name: 'Пауза' }).click({ timeout: 15000 });
//     await expect(page.getByText('Игра на паузе')).toBeVisible({ timeout: 20000 });
    
//     await page.getByRole('button', { name: 'Продолжить' }).click({ timeout: 15000 });
//     await expect(page.getByText('Игра на паузе')).not.toBeVisible({ timeout: 20000 });
//   });

//   test('should show win message when all cards matched', async () => {
//     const cards = await page.locator('[data-testid="card"]').all();
    
//     // Находим и кликаем все пары карт с увеличенными таймаутами
//     for (let i = 0; i < cards.length; i += 2) {
//       await cards[i].click({ timeout: 15000 });
//       await page.waitForTimeout(1000);
//       await cards[i+1].click({ timeout: 15000 });
//       await page.waitForTimeout(1000);
//     }
    
//     await expect(page.getByText('Поздравляем! Вы выиграли!'))
//       .toBeVisible({ timeout: 30000 });
//   });

//   test('should return to main menu', async () => {
//     await page.getByRole('button', { name: 'Главное меню' }).click({ timeout: 15000 });
//     await expect(page.getByText('Выберите режим игры'))
//       .toBeVisible({ timeout: 20000 });
//   });

//   test('should test reverse timer mode', async () => {
//     await page.getByRole('button', { name: '2x2' }).click({ timeout: 15000 });
//     await page.getByRole('button', { name: 'Таймер наоборот' }).click({ timeout: 15000 });
    
//     await expect(page.getByText('Осталось: 5 сек.'))
//       .toBeVisible({ timeout: 20000 });
    
//     const cards = await page.locator('[data-testid="card"]').all();
//     await cards[0].click({ timeout: 15000 });
//     await page.waitForTimeout(1000);
//     await cards[1].click({ timeout: 15000 });
//     await page.waitForTimeout(1000);
    
//     await expect(page.getByText('Осталось: 10 сек.'))
//       .toBeVisible({ timeout: 20000 });
//   });

//   test('should test endless mode', async () => {
//     await page.getByRole('button', { name: 'Главное меню' }).click({ timeout: 15000 });
//     await page.getByRole('button', { name: '2x2' }).click({ timeout: 15000 });
//     await page.getByRole('button', { name: 'Бесконечная игра' }).click({ timeout: 15000 });
    
//     const cards = await page.locator('[data-testid="card"]').all();
//     for (let i = 0; i < cards.length; i += 2) {
//       await cards[i].click({ timeout: 15000 });
//       await page.waitForTimeout(1000);
//       await cards[i+1].click({ timeout: 15000 });
//       await page.waitForTimeout(1000);
//     }
    
//     await expect(page.getByText('Раунд 1 завершен!'))
//       .toBeVisible({ timeout: 30000 });
//   });

//   test.afterAll(async () => {
//     await page.close();
//   });
// });