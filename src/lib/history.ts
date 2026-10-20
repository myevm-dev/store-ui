import apps from '../data/demo-apps.json';
import type { Dapp } from '../features/dapp/models/dapp';

export function readHistory(): Dapp[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = JSON.parse(window.localStorage.getItem('dApps') || '{}');
        if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return [];
        return Object.keys(stored).map((id) => apps.find((app) => app.dappId === id))
            .filter((app): app is typeof apps[number] => Boolean(app)).reverse();
    } catch {
        return [];
    }
}

export function rememberApp(id: string): void {
    if (typeof window === 'undefined') return;
    const app = apps.find((item) => item.dappId === id);
    if (!app) return;
    try {
        const previous = readHistory().reverse().filter((item) => item.dappId !== id);
        const history = Object.fromEntries([...previous, app].map((item) => [item.dappId, true]));
        window.localStorage.setItem('dApps', JSON.stringify(history));
    } catch {
        // Browsing remains available when storage is full or disabled.
    }
}
