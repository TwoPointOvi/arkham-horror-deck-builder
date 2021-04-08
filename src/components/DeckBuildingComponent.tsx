import React from 'react';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import CardCollection from './CardCollectionComponent';
import { ARKHAMDB_CARDS } from '../shared/urls';

type DeckBuildingState = {
    isLoading: boolean
    investigatorCollection: any,
}


class DeckBuildingComponent extends React.Component<{}, DeckBuildingState> {
    state: DeckBuildingState = {
        isLoading: true,
        investigatorCollection: {}
    }

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
        console.log(investigatorNoDup);
    }

    getCollectionFromUrl() {
        return fetch(ARKHAMDB_CARDS)
            .then((res) => res.json())
            .then((resJSON: any) => {
                this.investigatorCollection(resJSON);
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
                    <Grid item xs={12} sm={4}>
                        <Paper>Investigator</Paper>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CardCollection></CardCollection>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <CircularProgress></CircularProgress>
            );
        }
    }
}

export default DeckBuildingComponent;