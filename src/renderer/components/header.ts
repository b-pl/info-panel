import type { SKRSContext2D } from '@napi-rs/canvas';
import { LAYOUT } from '../../../config/layout.js';

export function renderHeader(ctx: SKRSContext2D, currentTime: string = '20:40'): void {
    const { x, y, width, height } = LAYOUT.header;

    ctx.save();

    // Tło nagłówka (czysta biel)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // Duży czas (po lewej stronie)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px "Inter-Bold"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentTime, x + 20, y + height / 2);

    // Pełna data z polskimi znakami (po prawej stronie)
    ctx.font = '18px "Inter"';
    ctx.textAlign = 'right';
    ctx.fillText('Wtorek, 22 września 2026', x + width - 20, y + height / 2);

    // Dolna linia rozdzielająca nagłówek
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + height);
    ctx.lineTo(x + width - 10, y + height);
    ctx.stroke();

    ctx.restore();
}
