/**
 * Created by zhaofeng on 7/11/16.
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';

export function createRedux(initialState) {
    let middleware = [thunk];

    let finalCreateStore = applyMiddleware(...middleware)(createStore);

    let store = finalCreateStore(reducer, initialState);

    if (module.hot) {
        module.hot.accept('../redux/reducer', () => {
            store.replaceReducer(reducer);
        });
    }
    return store;
}