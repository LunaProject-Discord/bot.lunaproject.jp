'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

export default function RootStyleRegistry({ children }: { children: JSX.Element; }): React.ReactElement {
    const [{ cache, flush }] = useState(() => {
        const cache = createCache({ key: 'cache-key' });
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args): string | void => {
            const serialized = args[1];
            if (!cache.inserted[serialized.name])
                inserted.push(serialized.name);
            return prevInsert(...args);
        };
        const flush = (): string[] => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0)
            return null;
        let styles = '';
        for (const name of names) {
            let style = cache.inserted[name];
            const removeThemeColors = typeof style === 'string' && style.indexOf('html{') === 0;
            if (removeThemeColors)
                style = (style as string)
                    .replace(/(body{[^}]*)(background-color:[^;]*;)/i, '$1')
                    .replace(/(body{[^}]*)(color:[^;]*;)/i, '$1');
            styles += style;
        }

        return (
            <style
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles
                }}
            />
        );
    });

    return <CacheProvider value={cache}>{children}</CacheProvider>;
}
