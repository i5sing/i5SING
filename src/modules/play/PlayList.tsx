import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from "../../reducers";
import { bindActionCreators, Dispatch } from "redux";
import { actions } from "../../utils/ActionUtil";
import { PlayAction } from "../../actions";
import { IPlay } from "../../interfaces/IPlay";
import { ImgCard } from "../../components/ImgCard";

import './PlayList.less';
import { Layout } from "../../components/Layout";
import { Tool } from "../../components/Tool";
import { Tag } from "../../components/Tag";
import { EndLoader } from "../../components/EndLoader";
import { Loading } from "../../components/Loading";
import { INetwork } from "../../interfaces/INetwork";
import { PLAY_LIST } from "../../constants/NetworkStatus";

export interface IPlayListProps {
    actions?: {
        play: typeof PlayAction;
    };
    network?: INetwork;
    plays?: IPlay[];
}

interface IPlayListState {
    page: number;
    label: string;
}

@connect(
    (state: IState) => ({
        plays: state.plays,
        network: state.networks[PLAY_LIST]
    }),
    (dispatch: Dispatch) => ({
        actions: {
            play: bindActionCreators(actions(PlayAction), dispatch)
        }
    })
)
export class PlayList extends React.Component<IPlayListProps, IPlayListState> {
    public state = {
        page: 1,
        label: '',
    };

    componentDidMount(): void {
        this.props.actions.play.getRecommendPlayLists(1);
    }

    nextPage() {
        this.setState({ page: this.state.page + 1 }, () => {
            if (this.state.label) {
                this.props.actions.play.getPlaysByLabel(this.state.label, this.state.page, 10);
            } else {
                this.props.actions.play.getRecommendPlayLists(this.state.page);
            }
        });
    }

    changeLabel(label?: string) {
        this.setState({ label, page: 1 }, () => {
            if (this.state.label) {
                this.props.actions.play.getPlaysByLabel(this.state.label, this.state.page, 10);
            } else {
                this.props.actions.play.getRecommendPlayLists(this.state.page);
            }
        })
    }

    render() {
        const { plays, network = { loading: true, nodata: false } } = this.props;
        const { label } = this.state;
        return <Layout id="main">
            <EndLoader target="main" onLoad={() => !network.nodata && this.nextPage()}>
                <Tool>
                    <Tag title="话语" selected={label === '话语'} onClick={() => this.changeLabel("话语")}/>
                    <Tag title="流行" selected={label === '流行'} onClick={() => this.changeLabel("流行")}/>
                    <Tag title="摇滚" selected={label === '摇滚'} onClick={() => this.changeLabel("摇滚")}/>
                    <Tag title="民谣" selected={label === '民谣'} onClick={() => this.changeLabel("民谣")}/>
                    <Tag title="电子" selected={label === '电子'} onClick={() => this.changeLabel("电子")}/>
                    <Tag title="古风" selected={label === '古风'} onClick={() => this.changeLabel("古风")}/>
                    <Tag title="轻音乐" selected={label === '轻音乐'} onClick={() => this.changeLabel("轻音乐")}/>
                    <Tag title="中国风" selected={label === '中国风'} onClick={() => this.changeLabel("中国风")}/>
                    <Tag title="武侠" selected={label === '武侠'} onClick={() => this.changeLabel("武侠")}/>
                    <Tag title="推荐" selected={!label} onClick={() => this.changeLabel()}/>
                </Tool>
                <div className="playlist">
                    <ImgCard count={4}>
                        {plays.map((play: IPlay, index) =>
                            <ImgCard.Item
                                height={171.5}
                                key={index}
                                title={play.title}
                                extra={play.playCount}
                                img={play.picture}
                                onClick={() => location.hash = `#/plays/${play.id}`}
                            />
                        )}
                    </ImgCard>
                </div>
                <Loading loading={network.loading} nodata={network.nodata}/>
            </EndLoader>
        </Layout>
    }
}
