/**
 * Created by zhaofeng on 2016/8/1.
 */
import Rank from '../containers/rank';
import RankList from '../containers/ranklist';

export default [{
    path: 'rank',
    component: Rank
}, {
    path: 'rank/:rankId',
    component: RankList
}]