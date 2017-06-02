import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Draggable from 'react-draggable';
import { halfDayValue, fullDayValue } from '../../constants';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ColourDialog from '../colourDialog/colourDialog';

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
    }

    async getCards() {
        let data;
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            const myInit = {
                method: 'GET',
                headers: myHeaders
            };
            const myRequest = new Request('http://vdt107/ChronoDotsWeb/api/intouch/dashboard', myInit);
            let response = await fetch(myRequest);
            data = await response.json();
            console.log('data', data);
            this.setState({cards: data});

        } catch(e) {
            console.log('Unable to get cards', e)
        }
        return data;
    }

    async addDot(cardId, timeAmount){
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append('Content-Type', 'application/json');

            const myInit = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({type: timeAmount})
            };
            const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/cards/${cardId}/dots`, myInit);
            await fetch(myRequest);
            this.getCards();
        } catch(e) {
            console.log('Unable to get cards', e)
        }
    }

    componentWillMount() {
        this.getCards();
    }

    renderDot(dot){
        const styles = {
            avatar: {
                margin: '2px',
                height: '40px',
                width: '40px',
                backgroundColor: dot.type === fullDayValue ? this.props.timeColours.fullDay : this.props.timeColours.halfDay
            },
        };
        return (
            <Draggable key={dot.id} bounds="parent">
                <Avatar style={styles.avatar} color={dot.colour}>{dot.ownerFirstName[0] + dot.ownerLastName[0]}</Avatar>
            </Draggable>
        )
    }

    async deleteCard(cardId){
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append('Content-Type', 'application/json');

            const myInit = {
                method: 'DELETE',
                headers: myHeaders,
            };
            const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/cards/${cardId}`, myInit);
            await fetch(myRequest);
            this.getCards();
        } catch(e) {
            console.log('Unable to get cards', e)
        }
    }

    async updateCard(card, colour){
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append('Content-Type', 'application/json');

            const myInit = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({title: card.title, colour: colour})
            };
            const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/cards/${card.id}`, myInit);
            await fetch(myRequest);
            this.getCards();
        } catch(e) {
            console.log('Unable to get cards', e)
        }
    }

    handleSetColour = (colour) => {
        this.handleToggleIsColourDialogOpen();
        this.updateCard(this.state.selectedCard, colour);
    };

    handleToggleIsColourDialogOpen = () => {
        this.setState({isColourDialogOpen: !this.state.isColourDialogOpen});
    };

    renderCardMenu(card) {
        return (
            <IconMenu
                iconButtonElement={<IconButton onTouchTap={() => this.setState({selectedCard: card})}><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                on
            >
                <MenuItem primaryText="Set Card Colour" onTouchTap={this.handleToggleIsColourDialogOpen}/>
                <MenuItem primaryText="Delete Card" onTouchTap={() => this.deleteCard(card.id)}/>
            </IconMenu>
        );
    }

    renderCardHeader(card) {
        const styles = {
            cardHeader: {
                height: '48px',
                display: 'flex',
                flexDirection: 'row',
                margin: '6px',
            },
            cardTitle: {
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                fontSize: '20px'
            },
            buttons: {
                display: 'flex',
                alignItems: 'center',
            },
        };

        return (
            <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>{card.title}</span>
                <span style={styles.buttons}>
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => this.addDot(card.id, halfDayValue)} backgroundColor={this.props.timeColours.halfDay} mini={true}>
                        ½
                    </FloatingActionButton>
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => this.addDot(card.id, fullDayValue)} backgroundColor={this.props.timeColours.fullDay} mini={true}>
                        1
                    </FloatingActionButton>
                </span>
                {this.renderCardMenu(card)}
            </div>
        );
    }

    renderCard(card){
        const styles = {
            card: {
                flex: '0 0 300px',
                backgroundColor: card.colour,
                margin: '10px'
            },
            draggable: {
                position: 'relative',
                height: '252px',
                width: '300px',
            },
        };

        return (
            <Paper key={card.id} zDepth={2} style={styles.card}>
                {this.renderCardHeader(card)}
                <div style={styles.draggable}>
                    {card.dots.map((dot) => this.renderDot(dot))}
                </div>
            </Paper>
        )
    }

    async addCard(title){
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append('Content-Type', 'application/json');

            const myInit = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    title: title,
                    colour: '#' + Math.random().toString(16).slice(2, 8)
                })
            };
            const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/intouch/cards`, myInit);
            await fetch(myRequest);
            this.setState({newCardTitle: 'New Card Title'});
            this.getCards();
        } catch(e) {
            console.log('Unable to get cards', e)
        }
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
                {this.state.cards.map((card) => this.renderCard(card))}
                {this.renderAddCard()}
                <ColourDialog isOpen={this.state.isColourDialogOpen} onCancel={this.handleToggleIsColourDialogOpen} onSubmit={this.handleSetColour}/>
            </div>
        );
    }
}

CardList.propTypes = propTypes;

export default CardList;
