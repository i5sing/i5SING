import * as _ from 'lodash';
import { DELETE_BY_ID, PUSH, SET, UNSHIFT, UPDATE, UPDATE_PROPERTY } from '../constants/Actions';
import { AnyAction, Reducer } from 'redux';
import { isArray } from "lodash";

export function createReducer<T>(actionType: string, defaults?: T): Reducer<T, AnyAction> {
    return function (state = defaults, action: AnyAction) {
        let newState, data = action.data;
        if (action.type !== actionType) {
            return state;
        }

        switch (action.action) {
            case SET:
            case UPDATE:
                newState = data;
                break;
            case UPDATE_PROPERTY:
                newState = isArray(state) ? [...(state as any)] : { ...state };
                _.set(newState, action.path, data);
                break;
            case UNSHIFT:
                newState = isArray(state) ? [...(state as any)] : { ...state };
                const array1 = _.get(newState, action.path, []);
                array1.unshift(data);
                break;
            case PUSH:
                newState = isArray(state) ? [...(state as any)] : { ...state };
                const array2 = _.get(newState, action.path, []);
                array2.push(data);
                break;
            case DELETE_BY_ID:
                newState = isArray(state) ? [...(state as any)] : { ...state };
                const array3 = _.get(newState, action.path, []);
                const index = _.findIndex(array3, action.id);
                array3.splice(index, 1);
                break;
            default:
                newState = state;
        }

        return newState;
    }
}
