import { flattenChangeset, IChange } from 'json-diff-ts';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

export type ActionType = 'add' | 'remove' | 'update';

export interface Change {
    action: ActionType;
    key: string;
    path: string;
    type: string | null;
    value?: any;
    oldValue?: any;
}

export const mapChanges = (changes: IChange[]): Change[] => flattenChangeset(changes).map((change): Change => ({
    action: change.type.toLowerCase() as ActionType,
    key: change.key,
    path: change.path,
    type: change.valueType,
    value: change.value,
    oldValue: change.oldValue
}));

export type ChangesGroupByAction = { [key in ActionType]: Change[] };

export const groupByAction = (changes: Change[]): ChangesGroupByAction => ({
    add: changes.filter((change) => change.action === 'add'),
    remove: changes.filter((change) => change.action === 'remove'),
    update: changes.filter((change) => change.action === 'update')
});

export type ChangesGroupByPath = Record<string, Change[]>;

export const groupByPath = (changes: Change[] | undefined): ChangesGroupByPath => groupBy(
    changes,
    (change) => {
        const path = change.path;
        const parentPath = path.substring(0, path.lastIndexOf('.'));
        if (isChangeArray(parentPath))
            return parentPath;
        return path;
    }
);

export type Changes = { [key in ActionType]: ChangesGroupByPath };

export const groupByChanges = (
    changes: IChange[],
    callback?: (changes: Change[] | undefined) => ChangesGroupByPath
): Changes => mapValues(
    groupByAction(mapChanges(changes)),
    callback ?? ((changes) => groupByPath(changes))
);

export const isChangeArray = (path: string): boolean => /\[.+]$/g.test(path);
