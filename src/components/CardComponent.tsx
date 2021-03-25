import React from 'react';
import { ARKHAMDB } from '../shared/urls';

type CardProps = {
    cardInfo: any
}

type CardState = {
    isLoading: boolean,
    cardInfo: any
}

class CardDetails extends React.Component<CardProps, CardState> {
    state: CardState = {
        isLoading: true,
        cardInfo: {}
    };

    render() {
        return (
            <div>
                <img
                    src={ARKHAMDB + this.props.cardInfo.imagesrc}
                    key={this.props.cardInfo.name}
                ></img>
            </div>
        );
    }
}

export default CardDetails;