/**
 * Created by zhaofeng on 2016/8/1.
 */
import Collections from '../containers/collections';
import Collection from '../containers/collection';

export default [{
    path: 'collections',
    component: Collections
}, {
    path: 'collections/:collectionId',
    component: Collection
}]