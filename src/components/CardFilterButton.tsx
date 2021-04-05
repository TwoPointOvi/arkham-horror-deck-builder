import { IconButton, PropTypes } from '@material-ui/core';
import { Language, MenuBook, MonetizationOn, PanTool, People, Visibility, Warning } from '@material-ui/icons';
import React from 'react';

type FilterState = {
    disabled: boolean,
    classAH: string
}

type FilterProps = {
    disabled: boolean,
    classAH: string,
    filterDeck: any
}

class CardFilterButton extends React.Component<FilterProps, FilterState> {
    state: FilterState = {
        disabled: false,
        classAH: ''
    }

    componentDidMount() {
        this.setState({
            disabled: this.props.disabled,
            classAH: this.props.classAH
        });
    }

    renderIcon() {
        switch(this.state.classAH) {
            case 'neutral': 
                return <People></People>
            case 'guardian':
                return <PanTool></PanTool>
            case 'seeker':
                return <MenuBook></MenuBook>
            case 'rogue':
                return <MonetizationOn></MonetizationOn>
            case 'mystic':
                return <Visibility></Visibility>
            case 'survivor':
                return <Warning></Warning>
            default:
                return <Language></Language>
        }
    }

    onClickAction() {

        this.props.filterDeck(this.state.classAH);
    }

    render() {
        return (
            <IconButton disabled={this.props.disabled} color='primary' size='medium' onClick={() => { this.onClickAction() }}>
                {
                    this.renderIcon()
                }
            </IconButton>
        );
    }
}

export default CardFilterButton;