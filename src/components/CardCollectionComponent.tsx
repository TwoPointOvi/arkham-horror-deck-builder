import { Grid } from '@material-ui/core';
import React from 'react';
import { ARKHAMDB_CARDS } from '../shared/urls';
import CardDetails from './CardComponent';

type CardState = {
    isLoading: boolean,
    investigatorCollection: any
    cardCollection: any
}

class CardCollection extends React.Component<{}, CardState> {
    state: CardState = {
        isLoading: true,
        investigatorCollection: {},
        cardCollection: {}
    };

    componentDidMount() {
        this.getCollectionFromUrl();
    }

    investigatorCollection(res: any) {
        const investigators = res.filter((card: any) => card.type_code === "investigator"
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
        this.setState({ investigatorCollection: investigatorNoDup });
    }

    cardCollection(res: any) {
        const cards = res.filter((card: any) => (card.type_code === "asset"
                                                || card.type_code === "event"
                                                || card.type_code === "skill")
                                                && card.subtype_code !== "weakness"
                                                && card.subtype_code !== "basicweakness"
                                                && card.imagesrc);
        let seenNames:any = {};                                                    
        const cardCollection = cards.filter((card: any) => {
            if (!(card.name in seenNames)) {
                seenNames[card.name] = true;
                return true;
            }
        });
        this.setState({ cardCollection: cardCollection });
    }

    getCollectionFromUrl() {
        return fetch(ARKHAMDB_CARDS)
            .then((res) => res.json())
            .then((resJSON: any) => {
                this.investigatorCollection(resJSON);
                this.cardCollection(resJSON);
            })
            .catch(error => console.error(error))
            .finally(() => { 
                this.setState({ isLoading: false });
            });
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <Grid container spacing={1}>
                    {
                        this.state.cardCollection.map((card: any) => {
                            return (
                                <Grid item xs={4} key={card.name}>
                                    <CardDetails cardInfo={card}></CardDetails>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            );
        } else {
            return (
                <div></div>
            );
        }
    }
}

export default CardCollection;