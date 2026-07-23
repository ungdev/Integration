import type pLimit from 'p-limit' with { 'resolution-mode': 'import' };

let pLimitPromise: Promise<typeof pLimit> | null = null;

function getPLimit() {
    if (!pLimitPromise) {
        pLimitPromise = import('p-limit').then((mod) => mod.default);
    }
    return pLimitPromise;
}

export default getPLimit;
