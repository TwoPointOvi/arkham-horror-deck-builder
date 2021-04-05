import React from 'react';
import CardFilterButton from './CardFilterButton';

type FilterState = {
    filteredClass: string
}

type FilterProps = {
    filterFunction: any
}

class CardCollectionFilter extends React.Component<FilterProps, FilterState> {
    state: FilterState = {
        filteredClass: 'all'
    }

    filterDeckCollection(type: string) {
        this.setState({
            filteredClass: type
        });

        this.props.filterFunction(type);
    }

    render() {
        return (
            <div>
                <CardFilterButton disabled={this.state.filteredClass === 'neutral'} classAH={"neutral"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'guardian'} classAH={"guardian"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'seeker'} classAH={"seeker"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'rogue'} classAH={"rogue"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'mystic'} classAH={"mystic"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'survivor'} classAH={"survivor"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
                <CardFilterButton disabled={this.state.filteredClass === 'all'} classAH={"all"} filterDeck={(type: string) => this.filterDeckCollection(type)}></CardFilterButton>
            </div>
        );
    }
}

export default CardCollectionFilter;