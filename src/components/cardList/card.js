import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { halfDayValue, fullDayValue } from '../../constants';
import Dot from './dot';
import { AddDot, DeleteCard, DeleteDots } from './actions';

const propTypes = {
    card: PropTypes.shape({
        title: PropTypes.string.isRequired,
        colour: PropTypes.any.isRequired,
        dots: PropTypes.any.isRequired,
    }).isRequired,
    timeColours: PropTypes.shape({
        halfDay: PropTypes.string.isRequired,
        fullDay: PropTypes.string.isRequired,
    }).isRequired,
    openColourPickerDialog: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

const onDeleteCard = async (cardId, onUpdate) => {
    await DeleteCard(cardId);
    onUpdate();
};

const onDeleteDots = async (cardId, onUpdate) => {
    await DeleteDots(cardId);
    onUpdate();
};

const onAddDot = async (cardId, time, onUpdate) => {
    await AddDot(cardId, time);
    onUpdate();
};

const renderCardMenu = (card, openColourPickerDialog, onUpdate) => (
    <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
        <MenuItem primaryText="Set Card Colour" onTouchTap={() => openColourPickerDialog(card)}/>
        <MenuItem primaryText="Clear Dots" onTouchTap={() => onDeleteDots(card.id, onUpdate)}/>
        <MenuItem primaryText="Delete Card" onTouchTap={() => onDeleteCard(card.id, onUpdate)}/>
    </IconMenu>
);

const renderCardHeader = (card, timeColours, openColourPickerDialog, onUpdate) => {
    const styles = {
        cardHeader: {
            height: '48px',
            display: 'flex',
            flexDirection: 'row',
            margin: '6px',
        },
        cardTitle: {
            alignItems: 'center',
            flexGrow: 1,
            fontSize: '20px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '170px',
            lineHeight: '48px',
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
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => onAddDot(card.id, halfDayValue, onUpdate)} backgroundColor={timeColours.halfDay} mini={true}>
                        ½
                    </FloatingActionButton>
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => onAddDot(card.id, fullDayValue, onUpdate)} backgroundColor={timeColours.fullDay} mini={true}>
                        1
                    </FloatingActionButton>
                </span>
            {renderCardMenu(card, openColourPickerDialog, onUpdate)}
        </div>
    );
};

const Card = (props) => {
    const { card, timeColours, openColourPickerDialog, onUpdate } = props;
    const numberOfDots = card.dots.length;
    const maxNumberOfDotsPerSize = 35;
    const baseCardHeight = 325;
    const dotsRatio = Math.ceil(numberOfDots/maxNumberOfDotsPerSize);
    const cardHeight = dotsRatio*baseCardHeight || baseCardHeight;
    const draggableHeight = cardHeight - 60;

    const styles = {
        card: {
            flex: '0 0 325px',
            backgroundColor: card.colour,
            margin: '10px',
            height: `${cardHeight}px`,
        },
        draggable: {
            position: 'relative',
            height: `${draggableHeight}px`,
            width: '325px',
        },
    };

    return (
        <Paper key={card.id} zDepth={2} style={styles.card}>
            {renderCardHeader(card, timeColours, openColourPickerDialog, onUpdate)}
            <div style={styles.draggable}>
                {card.dots.map((dot) => <Dot key={dot.id} dot={dot} timeColours={timeColours}/>)}
            </div>
        </Paper>
    )
};

Card.propTypes = propTypes;

export default Card;