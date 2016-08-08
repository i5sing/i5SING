/**
 * Created by zhaofeng on 2016/8/1.
 */
export default {
    path: 'favorite',
    childRoutes: [
        require('./my_attention'),
        require('./my_collections'),
        require('./my_fans'),
        require('./my_songs')
    ]
}