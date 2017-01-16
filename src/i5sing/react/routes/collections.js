/**
 * Created by zhaofeng on 2016/8/1.
 */
import Collections from '../page/collections';
import Collection from '../page/collection';

export default [{
    path: 'collections',
    component: Collections
}, {
    path: 'collections/:collectionId',
    component: Collection
}]