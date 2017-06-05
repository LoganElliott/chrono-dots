import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ColourDialog from '../colourDialog/colourDialog';
import Card from './card';
import { GetCards, AddCard, UpdateCard } from './actions';

const propTypes = {
    timeColours: PropTypes.shape({
        fullDay: PropTypes.string.isRequired,
        halfDay: PropTypes.string.isRequired,
    }),
};

class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            newCardTitle: '',
            isColourDialogOpen: false,
            selectedCard: null,
        };
        this.handleToggleIsColourDialogOpen = this.handleToggleIsColourDialogOpen.bind(this);
        this.handleSetColour = this.handleSetColour.bind(this);
        this.getCards = this.getCards.bind(this);
    }

    async getCards(){
        const cards = await GetCards();
        this.setState({cards});
    }

    componentWillMount() {
        this.getCards();
    }

    handleToggleIsColourDialogOpen() {
        this.setState({isColourDialogOpen: !this.state.isColourDialogOpen});
    };

    async handleSetColour(colour) {
        this.handleToggleIsColourDialogOpen();
        await UpdateCard(this.state.selectedCard, colour);
        this.getCards();
    };

    async addCard (cardTitle) {
        await AddCard(cardTitle);
        this.setState({newCardTitle: 'New Card Title'});
        this.getCards();
    }

    renderAddCard(){
        const styles = {
            container: {
                margin: '10px',
            }
        };

        return (
            <div style={styles.container}>
                <TextField hintText={'New Card Title'} value={this.state.newCardTitle} onChange={(event, newCardTitle) => this.setState({ newCardTitle})}/>
                <FloatingActionButton mini={true} onTouchTap={() => this.addCard(this.state.newCardTitle)}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }

    render() {
        const styles = {
            gridTile: {
                display: 'flex',
                flexWrap: 'wrap',
            }
        };

        return (
            <div style={styles.gridTile}>
                {this.state.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            timeColours={this.props.timeColours}
                            openColourPickerDialog={(card => {
                                this.setState({selectedCard: card});
                                this.handleToggleIsColourDialogOpen();
                            })}
                            onDelete={this.getCards}
                        />
                    )
                )}
                {this.renderAddCard()}
                <ColourDialog isOpen={this.state.isColourDialogOpen} onCancel={this.handleToggleIsColourDialogOpen} onSubmit={this.handleSetColour}/>
            </div>
        );
    }
}

CardList.propTypes = propTypes;

export default CardList;
