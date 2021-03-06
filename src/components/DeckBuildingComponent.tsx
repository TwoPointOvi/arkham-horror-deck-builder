import React from 'react';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import CardCollection from './CardCollectionComponent';
import { ARKHAMDB_CARDS } from '../shared/urls';
import InvestigatorDeckComponent from './InvestigatorDeckComponent';
import { connect } from 'react-redux';
import { deleteDeck } from '../redux/ActionCreators';

type DeckBuildingState = {
    isLoading: boolean,
    isLoadingCollection: boolean,
    investigatorCollection: any,
    cardCollection: any,
    filteredCardCollection: any,
    investigator: string,
    investigatorInfo: any,
}

type DeckBuildingProps = {
    deleteDeck: any
}

const mapDispatchToProps = (dispatch: any) => ({
    deleteDeck: () => dispatch(deleteDeck())
});


class DeckBuildingComponent extends React.Component<DeckBuildingProps, DeckBuildingState> {
    state: DeckBuildingState = {
        isLoading: true,
        isLoadingCollection: true,
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
        this.setState({ investigatorCollection: investigatorNoDup });
    }

    cardCollection(res: any) {
        const cards = res.filter((card: any) => (card.type_code === "asset"
                                                || card.type_code === "event"
                                                || card.type_code === "skill")
                                                && card.subtype_code !== "weakness"
                                                && card.subtype_code !== "basicweakness"
                                                && card.imagesrc);
        let seenCodes:any = {};                                                    
        const cardCollection = cards.filter((card: any) => {
            // card.filtered = false;
            if (!((card.code) in seenCodes)) {
                seenCodes[card.code] = true;
                return true;
            }
        });

        //re-arrange collection
        const cardMap: any = {};
        const arrangedCollection = cardCollection.filter((card: any) => {
            if (card.restrictions) {
                return true;
            } else {
                if (cardMap[card.faction_code + card.type_code + card.xp]) {
                    cardMap[card.faction_code + card.type_code + card.xp].push(card);
                } else {
                    cardMap[card.faction_code + card.type_code + card.xp] = [card];
                }
            }
        });

        Object.keys(cardMap).sort().forEach((key: string) => {
            cardMap[key].forEach((card: any) => {
                arrangedCollection.push(card);
            });
        });

        this.setState({ cardCollection: arrangedCollection });
        this.setState({ filteredCardCollection: arrangedCollection });
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
                this.setState({ isLoading: false, isLoadingCollection: false });
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
                investigatorInfo: invInfo,
                isLoadingCollection: true
            });
            
            this.filterCardCollectionForInvestigator(invInfo);
        } else {
            this.setState({
                investigator: '',
                investigatorInfo: {},
                isLoadingCollection: true,
                filteredCardCollection: this.state.cardCollection
            });

            setTimeout(() => {
                this.setState({
                    isLoadingCollection: false
                })
            }, 1500);
        }

        this.props.deleteDeck();
    }

    filterCardCollectionForInvestigator(invInfo: any) {
        let filteredCollection: any = [];

        filteredCollection = this.state.cardCollection.filter((card:any) => {
            if (card.restrictions?.investigator) {
                return Object.keys(card.restrictions.investigator).includes(invInfo.code);
            }

            for (let i = 0; i < invInfo.deck_options.length; i++) {
                const deckOption = invInfo.deck_options[i];
                let checkToAdd: boolean = true;

                if (deckOption.not) {
                    if (!deckOption.level) {
                        deckOption.level = {
                            min: 0,
                            max: 5
                        };
                    }

                    checkToAdd = !(card.traits?.toLowerCase().includes(deckOption.trait[0]) &&
                        card.xp >= deckOption.level.min && card.xp <= deckOption.level.max);
                }
                if (!checkToAdd) return false;

                if (deckOption.faction) {
                    if ((deckOption.faction.includes(card.faction_code) ||
                        (card.faction2_code && deckOption.faction.includes(card.faction2_code))) &&
                        card.xp >= deckOption.level.min && card.xp <= deckOption.level.max) {
                        return true;
                    }
                } else if (deckOption.trait) {
                    if (card.traits?.toLowerCase().includes(deckOption.trait[0]) &&
                        card.xp >= deckOption.level.min && card.xp <= deckOption.level.max) {
                        return true;
                    }
                } else if (deckOption.uses) {
                    if (card.text && card.text?.indexOf("Uses (") !== -1 && card.text?.indexOf(deckOption.uses[0] + ")") !== -1 &&
                        card.xp >= deckOption.level.min && card.xp <= deckOption.level.max) {
                            return true;
                    }
                } else if (deckOption.text) {
                    const regex = new RegExp(deckOption.text[0], 'g');
                    if (card.text && regex.test(card.text)) {
                        return true;
                    }
                }
                else if (deckOption.level &&
                    card.xp >= deckOption.level.min && card.xp <= deckOption.level.max) {
                    return true;
                }
            }
        });

        this.setState({
            filteredCardCollection: filteredCollection
        });

        setTimeout(() => {
            this.setState({
                isLoadingCollection: false
            })
        }, 1500);
    }

    render() {
        let deckCollection;
        if (!this.state.isLoadingCollection) {
            deckCollection = <CardCollection cardCollection={this.state.filteredCardCollection} filteredCardCollection={this.state.filteredCardCollection}></CardCollection>;
        } else {
            deckCollection = <CircularProgress></CircularProgress>;
        }

        if (!this.state.isLoading) {
            return (
                <Grid container spacing={1} style={{justifyContent: 'center'}}>
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
                    <Grid item xs={12} sm={7}>
                        {deckCollection}
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

export default connect(null, mapDispatchToProps)(DeckBuildingComponent);