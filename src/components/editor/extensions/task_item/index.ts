import { TaskItemNodeView } from '@/components/editor';
import { TaskItemExtension } from '@lunaproject/web-editor';
import { ReactNodeViewRenderer } from '@tiptap/react';

export const TaskItem = TaskItemExtension.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            nested: true
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(TaskItemNodeView, { as: 'li' });
    }
});

export * from './components';
