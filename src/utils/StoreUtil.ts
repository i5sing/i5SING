import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export function configureStore(preloadState, ...middleware) {
    const store = createStore(
        rootReducer,
        preloadState,
        compose(
            applyMiddleware(thunk, ...middleware)
        )
    );

    // if ((module as any).hot) {
    //     (module as any).hot.accept(() => {
    //         const nextRootReducer = require('../reducers');
    //         store.replaceReducer(nextRootReducer)
    //     });
    // }

    return store;
}
