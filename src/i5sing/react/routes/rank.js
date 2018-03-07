/**
 * Created by zhaofeng on 2016/8/1.
 */
import Rank from '../page/Rank';
import RankList from '../page/RankList';

export default [{
    path: 'rank',
    component: Rank
}, {
    path: 'rank/:rankId',
    component: RankList
}]