import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../../config/index.js';
import { setupFonts } from './utils/fonts.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';

export async function generateDashboardImage(): Promise<string> {
    // 0. Inicjalizacja czcionek wektorowych z pełną obsługą polskich znaków (Inter)
    setupFonts();

    const { width, height } = CONFIG.canvas;

    // 1. Inicjalizacja płótna 600x800 (pion)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 2. Wypełnienie tła na czystą biel (wysoki kontrast E-Ink)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 3. Renderowanie nagłówka (godzina i data) oraz stopki (odświeżono)
    renderHeader(ctx, '20:40');
    renderFooter(ctx, '20:40');

    // 4. Upewnienie się, że katalog output/ istnieje
    const outputDir = path.resolve(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // 5. Zapis pliku PNG
    const buffer = await canvas.encode('png');
    const outputPath = path.join(outputDir, 'dashboard.png');
    await fs.writeFile(outputPath, buffer);

    console.log(`Wygenerowano obraz dashboardu: ${outputPath}`);
    return outputPath;
}
