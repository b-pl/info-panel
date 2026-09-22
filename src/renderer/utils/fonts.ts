import { GlobalFonts } from '@napi-rs/canvas';
import path from 'path';

let fontsLoaded = false;

export function setupFonts(): void {
    if (fontsLoaded) return;

    const fontsDir = path.resolve(process.cwd(), 'assets', 'fonts');

    GlobalFonts.registerFromPath(path.join(fontsDir, 'Inter-Regular.ttf'), 'Inter');
    GlobalFonts.registerFromPath(path.join(fontsDir, 'Inter-Bold.ttf'), 'Inter-Bold');

    fontsLoaded = true;
}
