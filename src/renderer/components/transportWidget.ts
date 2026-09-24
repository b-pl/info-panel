import { loadImage, type SKRSContext2D } from '@napi-rs/canvas';
import path from 'path';
import { LAYOUT } from '../../../config/layout.js';
import type {TramDepartureData} from '../../types/api.js';

const SKULL_ICON = path.resolve(process.cwd(), 'assets/icons/skull.svg');

export async function renderTransportWidget(
    ctx: SKRSContext2D,
    departures: TramDepartureData[] | null
): Promise<void> {
    const { x, y, width, height } = LAYOUT.transport;

    ctx.save();

    // 1. Tło widgetu (czysta biel)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // 2. Nagłówek sekcji
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px "Inter-Bold"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('ODJAZDY', x + 20, y + 10);

    // Linia pod nagłówkiem
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 32);
    ctx.lineTo(x + width - 10, y + 32);
    ctx.stroke();

    // 3. Brak danych
    if (!departures || departures.length === 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '16px "Inter"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Brak najbliższych odjazdów', x + 20, y + 65);

        ctx.restore();
        return;
    }

    // Załadowanie ikony czaszki (dla tramwajów typu Tatra)
    const skullImage = await loadImage(SKULL_ICON);

    // 4. Renderowanie listy odjazdów (maksymalnie 5 pozycji)
    const itemsToDisplay = departures.slice(0, 5);
    const startY = y + 40;
    const rowHeight = 42;

    for (let index = 0; index < itemsToDisplay.length; index++) {
        const item = itemsToDisplay[index]!;
        const rowY = startY + index * rowHeight;

        // a) Plakietka numeru linii (czarny prostokąt z białym tekstem)
        const badgeWidth = 40;
        const badgeHeight = 26;
        const badgeX = x + 20;
        const badgeY = rowY + 4;

        ctx.fillStyle = '#000000';
        ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px "Inter-Bold"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.line, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);

        // b) Ikona czaszki dla modelu "Tatra"
        let offsetX = badgeX + badgeWidth + 12;
        const isTatra = item.tramModel?.toLowerCase().includes('tatra');

        if (isTatra) {
            ctx.drawImage(skullImage, offsetX, rowY + 7, 20, 20);
            offsetX += 26;
        }

        // c) Kierunek (Destination)
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px "Inter-Bold"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        let destText = item.destination;
        if (destText.length > 20) {
            destText = destText.substring(0, 18) + '...';
        }
        ctx.fillText(destText, offsetX, rowY + 17);

        // d) Czas odjazdu & Status
        ctx.textAlign = 'right';

        if (item.canceled) {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px "Inter-Bold"';
            ctx.fillText('ODWOŁANY', x + width - 20, rowY + 17);
        } else {
            const departureTime = item.estimatedDeparture ?? item.scheduledDeparture ?? '';

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 18px "Inter-Bold"';
            ctx.fillText(departureTime, x + width - 20, rowY + 17);

            // Kropka realTime
            if (item.realTime) {
                ctx.beginPath();
                ctx.arc(x + width - 85, rowY + 17, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#000000';
                ctx.fill();
            }
        }

        // e) Linia podziału między wierszami
        if (index < itemsToDisplay.length - 1) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 20, rowY + rowHeight);
            ctx.lineTo(x + width - 20, rowY + rowHeight);
            ctx.stroke();
        }
    }

    ctx.restore();
}