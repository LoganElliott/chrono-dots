import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Draggable from 'react-draggable';
import { halfDayValue, fullDayValue } from '../../constants';

const propTypes = {
    dot: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf([halfDayValue, fullDayValue]).isRequired,
        ownerFirstName: PropTypes.string.isRequired,
        ownerLastName: PropTypes.string.isRequired,
        colour: PropTypes.string.isRequired,
    }),
    timeColours: PropTypes.shape({
        halfDay: PropTypes.string.isRequired,
        fullDay: PropTypes.string.isRequired,
    }),
};

const Dot = (props) => {
    const { dot, timeColours } = props;
    const styles = {
        avatar: {
            margin: '2px',
            height: '40px',
            width: '40px',
            backgroundColor: dot.type === fullDayValue ? timeColours.fullDay : timeColours.halfDay
        },
    };
    return (
        <Draggable bounds="parent">
            <Avatar style={styles.avatar} color={dot.colour}>
                {dot.ownerFirstName[0] + dot.ownerLastName[0]}
            </Avatar>
        </Draggable>
    )
};

Dot.propTypes = propTypes;

export default Dot;
