/**
 * Created by zhaofeng on 2016/8/1.
 */
import Rank from '../page/rank';
import RankList from '../page/ranklist';

export default [{
    path: 'rank',
    component: Rank
}, {
    path: 'rank/:rankId',
    component: RankList
}]