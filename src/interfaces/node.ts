import { ReactNode } from 'react';

export type RenderableReactNode = Exclude<ReactNode, boolean | null | undefined>;
