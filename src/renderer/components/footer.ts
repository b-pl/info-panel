import type { SKRSContext2D } from '@napi-rs/canvas';
import { LAYOUT } from '../../../config/layout.js';

export function renderFooter(ctx: SKRSContext2D, updatedAt: string = '20:40'): void {
    const { x, y, width, height } = LAYOUT.footer;

    ctx.save();

    // Górna linia rozdzielająca stopkę
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + width - 10, y);
    ctx.stroke();

    // Tytuł w stopce (po lewej stronie)
    ctx.fillStyle = '#444444';
    ctx.font = '14px "Inter"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('INFO-PANEL E-INK • SZCZECIN', x + 20, y + height / 2);

    // Znacznik "Odświeżono" (przeniesiony do stopki po prawej stronie)
    ctx.textAlign = 'right';
    ctx.fillText(`Odświeżono: ${updatedAt}`, x + width - 20, y + height / 2);

    ctx.restore();
}
