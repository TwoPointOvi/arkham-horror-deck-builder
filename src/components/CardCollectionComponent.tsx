import React from 'react';
import { ARKHAMDB_CARDS } from '../shared/urls';
import CardDetails from './CardComponent';

type CardState = {
    isLoading: boolean,
    cardCollection: any
}

class CardCollection extends React.Component<{}, CardState> {
    state: CardState = {
        isLoading: true,
        cardCollection: {}
    };

    componentDidMount() {
        this.getCardsFromUrl();
    }

    getCardsFromUrl() {
        return fetch(ARKHAMDB_CARDS)
            .then((res) => res.json())
            .then((resJSON: any) => {
                const investigators = resJSON.filter((card: any) => card.type_code === "investigator"
                                                                && card.pack_code !== "promo"
                                                                && card.imagesrc);
                let seenNames:any = {};                                                    
                const investigatorNoDup = investigators.filter((card: any) => {
                    if (!(card.name in seenNames)) {
                        seenNames[card.name] = true;
                        return true;
                    }
                });
                // this.saveData(investigatorNoDup);
                this.setState({ cardCollection: investigatorNoDup });
            })
            .catch(error => console.error(error))
            .finally(() => { 
                this.setState({ isLoading: false });
            });
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <div>
                    {
                        this.state.cardCollection.map((card: any) => {
                            return (
                                <CardDetails cardInfo={card} key={card.name}></CardDetails>
                            );
                        })
                    }
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
}

export default CardCollection;