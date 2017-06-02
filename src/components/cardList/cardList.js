import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Draggable from 'react-draggable';
import { halfDayValue, fullDayValue } from '../../constants';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';

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
            newCardTitle: 'New Card Title',
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

    renderCard(card){
        const styles = {
            card: {
                flex: '0 0 300px',
                backgroundColor: card.colour,
                margin: '10px'
            },
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
            draggable: {
                position: 'relative',
                height: '252px',
                width: '300px',
            },
            buttons: {
                display: 'flex',
                alignItems: 'center',
            },
        };

        return (
            <Paper key={card.id} zDepth={2} style={styles.card}>
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
                </div>
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
                <TextField hintText={'New Card Title'} onChange={(event, newCardTitle) => this.setState({ newCardTitle})}/>
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
            </div>
        );
    }
}

CardList.propTypes = propTypes;

export default CardList;
