import type { SKRSContext2D } from '@napi-rs/canvas';
import { LAYOUT } from '../../../config/layout.js';
import type { calendar_v3 } from 'googleapis';
import { localizeTime } from '../utils/time.js';

function getEventDisplayTime(
    start?: calendar_v3.Schema$Event['start'],
    end?: calendar_v3.Schema$Event['end']
): string {
    if (!start) return '--:--';

    // 1. Wydarzenia z godzina (dateTime)
    if (start.dateTime && end?.dateTime) {
        const dStart = new Date(start.dateTime);
        const dEnd = new Date(end.dateTime);

        const isSameDay = dStart.getFullYear() === dEnd.getFullYear() &&
                          dStart.getMonth() === dEnd.getMonth() &&
                          dStart.getDate() === dEnd.getDate();

        // Wydarzenie wielodniowe z czasem
        if (!isSameDay) {
            const startStr = `${String(dStart.getDate()).padStart(2, '0')}.${String(dStart.getMonth() + 1).padStart(2, '0')}`;
            const endStr = `${String(dEnd.getDate()).padStart(2, '0')}.${String(dEnd.getMonth() + 1).padStart(2, '0')}`;
            return `${startStr}-${endStr}`;
        }

        const timeStr = localizeTime(start.dateTime);
        if (!timeStr) return '--:--';

        const now = new Date();
        const isToday = dStart.getDate() === now.getDate() &&
                        dStart.getMonth() === now.getMonth() &&
                        dStart.getFullYear() === now.getFullYear();

        if (isToday) {
            return timeStr;
        } else {
            const dayStr = String(dStart.getDate()).padStart(2, '0');
            const monthStr = String(dStart.getMonth() + 1).padStart(2, '0');
            return `${dayStr}.${monthStr} ${timeStr}`;
        }
    }

    // 2. Wydarzenia całodniowe (date)
    if (start.date) {
        const dStart = new Date(start.date);
        const dEnd = end?.date ? new Date(end.date) : dStart;

        // W Google Calendar end.date dla całodniowych jest ekskluzywna (+1 dzień)
        const actualEnd = new Date(dEnd.getTime() - 24 * 60 * 60 * 1000);

        const isSameDay = dStart.getFullYear() === actualEnd.getFullYear() &&
                          dStart.getMonth() === actualEnd.getMonth() &&
                          dStart.getDate() === actualEnd.getDate();

        const startDayStr = String(dStart.getDate()).padStart(2, '0');
        const startMonthStr = String(dStart.getMonth() + 1).padStart(2, '0');

        if (!isSameDay && actualEnd > dStart) {
            const endDayStr = String(actualEnd.getDate()).padStart(2, '0');
            const endMonthStr = String(actualEnd.getMonth() + 1).padStart(2, '0');
            return `${startDayStr}.${startMonthStr}-${endDayStr}.${endMonthStr}`;
        }

        return `${startDayStr}.${startMonthStr} Cały dzień`;
    }

    return '--:--';
}

export async function renderCalendarWidget(
    ctx: SKRSContext2D,
    events: calendar_v3.Schema$Event[] | null
): Promise<void> {
    const { x, y, width, height } = LAYOUT.calendar;

    ctx.save();

    // 1. Tło widgetu (czysta biel)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // 2. Nagłówek sekcji
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px "Inter-Bold"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('KALENDARZ', x + 20, y + 10);

    // Linia pod nagłówkiem
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 32);
    ctx.lineTo(x + width - 10, y + 32);
    ctx.stroke();

    // 3. Brak wydarzeń
    if (!events || events.length === 0) {
        ctx.fillStyle = '#000000';
        ctx.font = '16px "Inter"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Brak nadchodzących wydarzeń', x + 20, y + 65);

        ctx.restore();
        return;
    }

    // 4. Renderowanie 5 najbliższych wydarzeń
    const itemsToDisplay = events.slice(0, 5);
    const startY = y + 38;
    const rowHeight = 33;

    itemsToDisplay.forEach((event, index) => {
        const rowY = startY + index * rowHeight;
        const timeStr = getEventDisplayTime(event.start, event.end);
        const titleStr = event.summary ?? 'Bez tytułu';

        // a) Czas / Data wydarzenia (lewa kolumna)
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px "Inter-Bold"';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(timeStr, x + 20, rowY + 16);

        // b) Tytuł wydarzenia (prawa kolumna)
        ctx.font = '15px "Inter"';
        let truncatedTitle = titleStr;
        if (truncatedTitle.length > 38) {
            truncatedTitle = truncatedTitle.substring(0, 35) + '...';
        }
        ctx.fillText(truncatedTitle, x + 155, rowY + 16);

        // c) Subtelna linia podziału między wierszami
        if (index < itemsToDisplay.length - 1) {
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 20, rowY + rowHeight);
            ctx.lineTo(x + width - 20, rowY + rowHeight);
            ctx.stroke();
        }
    });

    ctx.restore();
}