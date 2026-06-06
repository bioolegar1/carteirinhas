import { expect, test } from '@playwright/test';

const validCards = [
  {
    id: 'propria-carteirinha',
    name: 'Vanderson Henrique dos Santos',
    code: '4C7564B9',
  },
  {
    id: 'conta-2',
    name: 'Cadastro Predefinido Dois',
    code: 'CAD00002',
  },
  {
    id: 'conta-3',
    name: 'Cadastro Predefinido Tres',
    code: 'CAD00003',
  },
] as const;

for (const card of validCards) {
  test(`renders direct card link for ${card.id}`, async ({ page }) => {
    await page.goto(`/?id=${card.id}`);

    await expect(page.getByText(card.name)).toBeVisible();
    await expect(page.getByText(card.code)).toBeVisible();
    await expect(page.getByText('Renove Agora')).toHaveCount(0);
    await expect(page.getByText('Cadastro', { exact: true })).toHaveCount(0);
  });
}

test('renders not found state for invalid ID', async ({ page }) => {
  await page.goto('/?id=inexistente');

  await expect(page.getByRole('heading', { name: 'Carteirinha nao encontrada' })).toBeVisible();
  await expect(page.getByText('conta-2')).toHaveCount(0);
  await expect(page.getByText('conta-3')).toHaveCount(0);
});

test('shows the back side by click', async ({ page }) => {
  await page.goto('/?id=propria-carteirinha');

  const card = page.getByRole('button', { name: 'Mostrar verso da carteirinha' });
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await card.click();
  const backCard = page.getByRole('button', { name: 'Mostrar frente da carteirinha' });
  await expect(backCard).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Documento válido em todo o Território Nacional')).toBeVisible();
});
