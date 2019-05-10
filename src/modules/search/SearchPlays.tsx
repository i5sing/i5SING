import * as React from 'react';
import { IPlay } from "../../interfaces/IPlay";
import { ImgCard } from "../../components/ImgCard";

export interface ISearchPlaysProps {
    plays: IPlay[];
}

export class SearchPlays extends React.Component<ISearchPlaysProps> {
    render() {
        const { plays } = this.props;
        return <ImgCard count={ 4 }>
            { plays.map((play: IPlay) =>
                <ImgCard.Item
                    height={ 171.5 }
                    key={ play.id }
                    title={ play.title }
                    extra={ play.playCount }
                    img={ play.picture }
                    onClick={ () => location.hash = `#/plays/${ play.id }` }
                />
            ) }
        </ImgCard>
    }
}
