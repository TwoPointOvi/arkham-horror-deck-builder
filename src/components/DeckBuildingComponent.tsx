import React from 'react';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import CardCollection from './CardCollectionComponent';
import { ARKHAMDB_CARDS } from '../shared/urls';
import InvestigatorDeckComponent from './InvestigatorDeckComponent';

type DeckBuildingState = {
    isLoading: boolean
    investigatorCollection: any,
    cardCollection: any,
    filteredCardCollection: any,
    investigator: string,
    investigatorInfo: any,
}


class DeckBuildingComponent extends React.Component<{}, DeckBuildingState> {
    state: DeckBuildingState = {
        isLoading: true,
        investigatorCollection: {},
        cardCollection: {},
        filteredCardCollection: {},
        investigator: '',
        investigatorInfo: {}
    }

    constructor(props: any) {
        super(props);
        this.handleInvestigatorChange = this.handleInvestigatorChange.bind(this);
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
            card.filtered = false;
            if (!(card.name in seenNames)) {
                seenNames[card.name] = true;
                return true;
            }
        });
        this.setState({ cardCollection: cardCollection });
        this.setState({ filteredCardCollection: cardCollection });
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

    handleInvestigatorChange(event: React.ChangeEvent<{ value: unknown }>) {

        const invInfo = this.state.investigatorCollection.find((inv: any) => {
            if (inv.name === event.target.value) {
                return inv;
            }
        });

        if (invInfo) {
            this.setState({
                investigator: invInfo.name,
                investigatorInfo: invInfo
            });
        }
    }

    render() {
        if (!this.state.isLoading) {
            return (
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                        <Grid item xs={12}>
                            <FormControl style={{minWidth: 200, backgroundColor: 'white', marginBottom: '20px'}} variant='filled'>
                                <InputLabel id='investigator-name-label'>Investigator</InputLabel>
                                <Select id='investigator-name' labelId='investigator-name-label' value={this.state.investigator} 
                                    onChange={this.handleInvestigatorChange} label='Investigator'>
                                    <MenuItem value=""><b>None</b></MenuItem>
                                    {
                                        this.state.investigatorCollection.map((investigator:any) => {
                                            return (
                                                <MenuItem key={investigator.code} value={investigator.name}>{investigator.name}</MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <InvestigatorDeckComponent investigator={this.state.investigator} investigatorData={this.state.investigatorInfo}></InvestigatorDeckComponent>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <CardCollection cardCollection={this.state.cardCollection} filteredCardCollection={this.state.filteredCardCollection}></CardCollection>
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