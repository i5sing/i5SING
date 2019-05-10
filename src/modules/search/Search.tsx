import * as React from 'react';
import { connect } from 'react-redux';
import { Layout } from "../../components/Layout";
import { IState } from "../../reducers";
import { ISearch } from "../../interfaces/ISearch";
import { IDownload } from "../../interfaces/IDownload";
import { ISong } from "../../interfaces/ISong";
import { ICloudSong } from "../../interfaces/ICloudSong";
import { toMap } from "../../utils/DataUtil";
import { SearchSongs } from "./SearchSongs";
import { bindActionCreators } from "redux";
import { actions } from "../../utils/ActionUtil";
import { SearchAction } from "../../actions";
import { IUser } from "../../interfaces/IUser";
import { SearchUsers } from "./SearchUsers";
import { IPlay } from "../../interfaces/IPlay";
import { SearchPlays } from "./SearchPlays";
import { Tabs } from "antd";
import { SEARCH } from "../../constants/ActionTypes";
import { UPDATE } from "../../constants/Actions";
import { INetwork } from "../../interfaces/INetwork";
import { EndLoader } from "../../components/EndLoader";
import { Loading } from "../../components/Loading";

export interface ISearchProps {
    actions?: {
        search: typeof SearchAction;
    };
    match?: {
        params: {
            type: string;
            id: string;
        };
    };
    network?: INetwork;
    search?: ISearch;
    downloads?: { [songId: string]: IDownload },
    loveSongs?: ISong[];
    cloudSongs?: ICloudSong[];
    loadings?: { [key: string]: boolean };
}

interface ISearchState {
    page: number;
    size: number;
}

@connect(
    (state: IState) => ({
        network: state.networks[`${ SEARCH }_${ UPDATE }`],
        search: state.search,
        downloads: state.downloads,
        loveSongs: state.love.songs,
        cloudSongs: state.cloud.songs,
        loadings: state.cloud.loadings,
    }),
    dispatch => ({
        actions: {
            search: bindActionCreators(actions(SearchAction), dispatch),
        }
    })
)
export class Search extends React.Component<ISearchProps, ISearchState> {
    public state = {
        page: 1,
        size: 20,
    };

    componentWillReceiveProps(nextProps: Readonly<ISearchProps>, nextContext: any): void {
        if ((nextProps.match.params.id !== this.props.match.params.id) ||
            (nextProps.match.params.type !== this.props.match.params.type)) {
            this.setState({ page: 1 }, () => {
                const key = nextProps.match.params.id;
                const type = nextProps.match.params.type;
                this.props.actions.search.search(key, type, this.state.page, this.state.size);
            });
        }
    }

    renderSongs(songs: ISong[]) {
        const { downloads = {}, loveSongs = [], cloudSongs = [], loadings = {} } = this.props;
        const clouds = toMap<ICloudSong>(cloudSongs, i => i.key);
        const loves = toMap<ISong>(loveSongs, i => `${ i.kind }-${ i.id }`);

        return <SearchSongs songs={ songs }
                            downloads={ downloads }
                            loves={ loves }
                            loadings={ loadings }
                            clouds={ clouds }/>;
    }

    renderUsers(users: IUser[]) {
        return <SearchUsers musicians={ users }/>;
    }

    renderPlays(plays: IPlay[]) {
        return <SearchPlays plays={ plays }/>;
    }

    componentDidMount(): void {
        const { type, id } = this.props.match.params;
        this.props.actions.search.search(id, type, this.state.page, this.state.size);
    }

    nextPage() {
        const { type, id } = this.props.match.params;
        this.setState({ page: this.state.page + 1 }, () => {
            this.props.actions.search.search(id, type, this.state.page, this.state.size);
        });
    }

    render() {
        const { songs, users, plays } = this.props.search;
        const { type, id } = this.props.match.params;
        const { network = { nodata: false, loading: true } } = this.props;
        return <Layout id="main">
            <EndLoader target="main" onLoad={ () => !network.nodata && this.nextPage() }>
                <Tabs animated={ false }
                      activeKey={ type }
                      style={ { margin: '0 -30px' } }
                      tabBarStyle={ { paddingLeft: 30, paddingRight: 30 } }
                      onChange={ key => location.hash = `#/search/${ key }/${ id }` }>
                    <Tabs.TabPane tab="歌曲" key="song">
                        { this.renderSongs(songs) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="原创" key="yc">
                        { this.renderSongs(songs) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="翻唱" key="fc">
                        { this.renderSongs(songs) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="伴奏" key="bz">
                        { this.renderSongs(songs) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="歌单" key="play" style={ { padding: '0 30px' } }>
                        { this.renderPlays(plays) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="音乐人" key="user" style={ { padding: '0 30px' } }>
                        { this.renderUsers(users) }
                    </Tabs.TabPane>
                </Tabs>
                <div style={ { marginTop: ['song', 'yc', 'fc', 'bz'].includes(type) ? 40 : 0 } }>
                    <Loading loading={ network.loading } nodata={ network.nodata }/>
                </div>
            </EndLoader>
        </Layout>

    }
}
