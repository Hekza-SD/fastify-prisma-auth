const localCache = new Map<string, any>();

export function cacheGet(key: string) {
    return localCache.get(key);
}

export function cacheSet(key: string, value: any) {
    localCache.set(key, value);
}

export function cacheClearPrefix(prefix: string) {
    for (const key of localCache.keys()) {
        if (key.startsWith(prefix)) localCache.delete(key);
    }
}
