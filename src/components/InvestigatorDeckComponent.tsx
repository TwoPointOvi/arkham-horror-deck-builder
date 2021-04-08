import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import { ARKHAMDB } from '../shared/urls';

type InvestigatorDeckProps = {
    investigator: string,
    investigatorData: any
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
                                style={{width:"100%", height:"100%", alignSelf: 'start'}}
                                src={ARKHAMDB + this.props.investigatorData.imagesrc}
                            ></img>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper style={{backgroundColor:'transparent'}} elevation={0}>
                            <img
                                style={{width:"100%", height:"100%", alignSelf: 'start'}}
                                src={ARKHAMDB + this.props.investigatorData.backimagesrc}
                            ></img>
                        </Paper>
                    </Grid>
                </Grid>
            );
        } else {
            return (<div></div>);
        }
    }
}

export default InvestigatorDeckComponent;