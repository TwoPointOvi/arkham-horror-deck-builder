import { Grid, List, ListItemText, Paper } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { ARKHAMDB } from '../shared/urls';

type InvestigatorDeckProps = {
    investigator: string,
    investigatorData: any,
    deckCollection: any
}

const mapStateToProps = (state: any) => {
    return {
        deckCollection: state.deckCollection
    };
}

class InvestigatorDeckComponent extends React.Component<InvestigatorDeckProps, {}> {


    render() {
        if (this.props.investigator) {
            return (
                <Grid container item spacing={2} xs={12}>
                    <Grid item xs={12}>
                        <Paper>{this.props.investigator || 'Investigator'}</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{backgroundColor:'transparent'}} elevation={0}>
                            <img
                                style={{width:"90%", maxHeight:350, alignSelf: 'start'}}
                                src={ARKHAMDB + this.props.investigatorData.imagesrc}
                            ></img>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{backgroundColor:'transparent'}} elevation={0}>
                            <img
                                style={{width:"90%", maxHeight:350, alignSelf: 'start'}}
                                src={ARKHAMDB + this.props.investigatorData.backimagesrc}
                            ></img>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        {
                            this.props.deckCollection.cards.map((cardInDeck:any) => {
                                return (
                                    <List dense key={cardInDeck.id} style={{color:'black'}}>
                                        <ListItemText primary={cardInDeck.cardId} secondary={cardInDeck.amount}></ListItemText>
                                    </List>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            );
        } else {
            return (<div></div>);
        }
    }
}

export default connect(mapStateToProps)(InvestigatorDeckComponent);