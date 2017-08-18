import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
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
    openRenameDialog: PropTypes.func.isRequired,
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

const renderCardMenu = (card, openColourPickerDialog, openRenameDialog, onUpdate) => {
    const textColour = (parseInt(card.colour.replace('#', '0x'), 16) > 0xffffff/2) ? 'black':'white';

    return (
        <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon color={textColour}/></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
            <MenuItem primaryText="Rename Card" onClick={() => openRenameDialog(card, onUpdate)}/>
            <MenuItem primaryText="Set Card Colour" onClick={() => openColourPickerDialog(card)}/>
            <MenuItem primaryText="Clear Dots" onClick={() => onDeleteDots(card.id, onUpdate)}/>
            <MenuItem primaryText="Delete Card" onClick={() => onDeleteCard(card.id, onUpdate)}/>
        </IconMenu>
    );
};

const renderCardHeader = (card, timeColours, openColourPickerDialog, openRenameDialog, onUpdate) => {
    const textColour = (parseInt(card.colour.replace('#', '0x'), 16) > 0xffffff/2) ? 'black':'white';
    const halfDayTextColour = (parseInt(timeColours.halfDay.replace('#', '0x'), 16) > 0xffffff/2) ? 'black':'white';
    const fullDayTextColour = (parseInt(timeColours.fullDay.replace('#', '0x'), 16) > 0xffffff/2) ? 'black':'white';

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
            color: textColour,
        },
        buttons: {
            display: 'flex',
            alignItems: 'center',
        },
        button: {
            boxShadow: 'none',
            margin: '2px'
        }
    };


    return (
        <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>{card.title}</span>
            <span style={styles.buttons}>
                    <FloatingActionButton style={styles.button} onClick={() => onAddDot(card.id, halfDayValue, onUpdate)} backgroundColor={timeColours.halfDay} mini={true}>
                        <span style={{color: halfDayTextColour}}>
                            ½
                        </span>
                    </FloatingActionButton>
                    <FloatingActionButton style={styles.button} onClick={() => onAddDot(card.id, fullDayValue, onUpdate)} backgroundColor={timeColours.fullDay} mini={true}>
                        <span style={{color: fullDayTextColour}}>
                            1
                        </span>
                    </FloatingActionButton>
                </span>
            {renderCardMenu(card, openColourPickerDialog, openRenameDialog, onUpdate)}
        </div>
    );
};

const Card = (props) => {
    const { card, timeColours, openColourPickerDialog, openRenameDialog, onUpdate } = props;
    const numberOfDots = card.dots.length;
    const maxNumberOfDotsPerSize = 35;
    const baseCardHeight = 324;
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
        delete: {
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '40px',
            height: '40px',
        }
    };

    const deleteColour = (parseInt(card.colour.replace('#', '0x'), 16) > 0xffffff/2) ? 'black':'white';

    return (
        <Paper key={card.id} zDepth={2} style={styles.card}>
            {renderCardHeader(card, timeColours, openColourPickerDialog, openRenameDialog, onUpdate)}
            <div style={styles.draggable}>
                <DeleteIcon color={deleteColour} style={styles.delete}/>
                {card.dots.map((dot, index) => (
                        <Dot
                            key={dot.id}
                            dot={{...dot, index: index}}
                            timeColours={timeColours}
                            draggableHeight={draggableHeight}
                            onUpdate={() => props.onUpdate()}
                        />
                    )
                )}
            </div>
        </Paper>
    )
};

Card.propTypes = propTypes;

export default Card;