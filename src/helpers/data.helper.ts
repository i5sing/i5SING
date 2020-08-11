import { isArray } from 'lodash';

export function toList<T extends any>(object: any, filter?: (i: T) => string): T[] {
    const newObj = Object.create(object);
    const result: T[] = [];
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result.push(object[key]);
        }
    }

    if (filter) {
        return result.filter(item => {
            const bool = newObj[filter(item)];
            if (bool) {
                delete newObj[filter(item)];
            }
            return bool;
        });
    }

    return result;
}

export function toMap<T extends any>(list: T[], cb: (i: T) => string): { [key: string]: T } {
    const map = {};
    if (!isArray(list)) {
        return map;
    }
    list.forEach(item => {
        const key = cb(item);
        map[key] = item;
    });
    return map;
}

export function prettySongKind(kind: string) {
    switch (kind) {
        case 'yc':
            return '原创';
        case 'fc':
            return '翻唱';
        case 'bz':
            return '伴奏';
    }
}
