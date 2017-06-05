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
import { AddDot, DeleteCard } from './actions';

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
    onDelete: PropTypes.func.isRequired,
};

const onDeleteCard = async (cardId, onDelete) => {
    await DeleteCard(cardId);
    onDelete();
};

const renderCardMenu = (card, openColourPickerDialog, onDelete) => (
    <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
        <MenuItem primaryText="Set Card Colour" onTouchTap={() => openColourPickerDialog(card)}/>
        <MenuItem primaryText="Delete Card" onTouchTap={() => onDeleteCard(card.id, onDelete)}/>
    </IconMenu>
);

const renderCardHeader = (card, timeColours, openColourPickerDialog, onDelete) => {
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
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => AddDot(card.id, halfDayValue)} backgroundColor={timeColours.halfDay} mini={true}>
                        ½
                    </FloatingActionButton>
                    <FloatingActionButton style={{boxShadow: 'none', margin: '2px'}} onTouchTap={() => AddDot(card.id, fullDayValue)} backgroundColor={timeColours.fullDay} mini={true}>
                        1
                    </FloatingActionButton>
                </span>
            {renderCardMenu(card, openColourPickerDialog, onDelete)}
        </div>
    );
};

const Card = (props) => {
    const { card, timeColours, openColourPickerDialog, onDelete } = props;
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
            {renderCardHeader(card, timeColours, openColourPickerDialog, onDelete)}
            <div style={styles.draggable}>
                {card.dots.map((dot) => <Dot key={dot.id} dot={dot} timeColours={timeColours}/>)}
            </div>
        </Paper>
    )
};

Card.propTypes = propTypes;

export default Card;