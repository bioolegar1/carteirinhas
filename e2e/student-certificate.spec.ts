import { expect, test } from '@playwright/test';

test.describe('Student Certificate Page', () => {
  test('renders certificate for ricardo with valid status and pem key', async ({ page }) => {
    await page.goto('/certificado?id=ricardo');

    await expect(page.getByRole('heading', { name: 'DOCUMENTO VÁLIDO' })).toBeVisible();
    await expect(page.locator('.student-name')).toHaveText('Ricardo Olimpio Barros Cavaleiro de Macedo Filho');
    await expect(page.getByText('486C61C4')).toBeVisible();
    await expect(page.getByText('Engenharia da Computação').first()).toBeVisible();
    await expect(page.getByText('Faculdade Estácio de Sá').first()).toBeVisible();
    await expect(page.getByAltText('QR Code de autenticidade de Ricardo Olimpio Barros Cavaleiro de Macedo Filho')).toBeVisible();
    await expect(page.getByText('-----BEGIN CERTIFICATE-----')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clique aqui para baixar o certificado' })).toBeVisible();
    await expect(page.getByText('Conformidade com Legislação')).toBeVisible();
  });

  test('renders certificate for jenifer with valid status and pem key', async ({ page }) => {
    await page.goto('/certificado?id=jenifer');

    await expect(page.getByRole('heading', { name: 'DOCUMENTO VÁLIDO' })).toBeVisible();
    await expect(page.locator('.student-name')).toHaveText('Jenifer Gomes de Sousa');
    await expect(page.getByText('487B61C4')).toBeVisible();
    await expect(page.getByAltText('QR Code de autenticidade de Jenifer Gomes de Sousa')).toBeVisible();
    await expect(page.getByText('Direito').first()).toBeVisible();
    await expect(page.getByText('Estácio de Sá').first()).toBeVisible();
    await expect(page.getByText('-----BEGIN CERTIFICATE-----')).toBeVisible();
  });

  test('renders not found state when accessing with invalid id', async ({ page }) => {
    await page.goto('/certificado?id=invalido');

    await expect(page.getByRole('heading', { name: 'Certificado não encontrado' })).toBeVisible();
    await expect(page.getByText('Ricardo Olimpio')).toHaveCount(0);
    await expect(page.getByText('Jenifer Gomes')).toHaveCount(0);
    await expect(page.getByText('DOCUMENTO VÁLIDO')).toHaveCount(0);
  });
});
