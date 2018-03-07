/**
 * Created by zhaofeng on 2016/8/1.
 */
import Collections from '../page/Collections';
import Collection from '../page/Collection';

export default [{
    path: 'collections',
    component: Collections
}, {
    path: 'collections/:collectionId',
    component: Collection
}]