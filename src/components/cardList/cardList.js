import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ColourDialog from '../colourDialog/colourDialog';
import Card from './card';
import { GetCards, AddCard, UpdateCard } from './actions';
import './styles.css';

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
            isRenameCardDialogOpen: false,
            renameCardTitle: '',
        };
        this.handleToggleIsRenameDialogOpen = this.handleToggleIsRenameDialogOpen.bind(this);
        this.handleToggleIsColourDialogOpen = this.handleToggleIsColourDialogOpen.bind(this);
        this.handleRenameCard = this.handleRenameCard.bind(this);
        this.handleSetColour = this.handleSetColour.bind(this);
        this.getCards = this.getCards.bind(this);
    }

    async getCards(){
        const cards = await GetCards();
        this.setState({cards});
    }

    componentWillMount() {
        this.getCards();
        // setInterval(() => this.getCards(), 500);
    }

    handleToggleIsRenameDialogOpen() {
        this.setState({isRenameCardDialogOpen: !this.state.isRenameCardDialogOpen});
    };

    handleToggleIsColourDialogOpen() {
        this.setState({isColourDialogOpen: !this.state.isColourDialogOpen});
    };

    async handleRenameCard(title) {
        this.handleToggleIsRenameDialogOpen();
        await UpdateCard({...this.state.selectedCard, title});
        this.getCards();
    };

    async handleSetColour(colour) {
        this.handleToggleIsColourDialogOpen();
        await UpdateCard({...this.state.selectedCard, colour});
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
                width: '318px',
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

    renderRenameDialog(){
        if(!this.state.isRenameCardDialogOpen || !this.state.selectedCard){
            return null;
        }
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleToggleIsRenameDialogOpen}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleRenameCard(this.state.renameCardTitle)}
            />,
        ];

        return (
            <Dialog title={'Rename ' + this.state.selectedCard.title + ' card'}
                actions={actions}
                modal={false}
                open={this.state.isRenameCardDialogOpen}
                onRequestClose={this.handleToggleIsRenameDialogOpen}
                contentStyle={{width: '325px'}}
            >
                <TextField id="RenameCardDialog" defaultValue={this.state.selectedCard.title} onChange={(event, renameCardTitle) => this.setState({ renameCardTitle})}/>
            </Dialog>
        );
    }

    render() {
        if(!this.state.cards || this.state.cards.length === 0){
            return null;
        }

        const styles = {
            gridTile: {
                display: 'flex',
                flexWrap: 'wrap',
            }
        };

        return (
            <div style={styles.gridTile} className="card">
                {this.state.cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            timeColours={this.props.timeColours}
                            openColourPickerDialog={(card => {
                                this.setState({
                                    selectedCard: card,
                                    colourPickerTitle: 'Select ' + card.title + 'card colour',
                                });
                                this.handleToggleIsColourDialogOpen();
                            })}
                            openRenameDialog={(card => {
                                this.setState({
                                    selectedCard: card,
                                });
                                this.handleToggleIsRenameDialogOpen();
                            })}
                            onUpdate={this.getCards}
                        />
                    )
                )}
                {this.renderAddCard()}
                {this.renderRenameDialog()}
                <ColourDialog title={this.state.colourPickerTitle} isOpen={this.state.isColourDialogOpen} onCancel={this.handleToggleIsColourDialogOpen} onSubmit={this.handleSetColour} />
            </div>
        );
    }
}

CardList.propTypes = propTypes;

export default CardList;
