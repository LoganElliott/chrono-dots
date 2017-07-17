import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import Draggable from 'react-draggable';
import { halfDayValue, fullDayValue } from '../../constants';
import { DeleteDot } from './actions';

const propTypes = {
    dot: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.oneOf([halfDayValue, fullDayValue]).isRequired,
        ownerFirstName: PropTypes.string.isRequired,
        ownerLastName: PropTypes.string.isRequired,
        colour: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    timeColours: PropTypes.shape({
        halfDay: PropTypes.string.isRequired,
        fullDay: PropTypes.string.isRequired,
    }),
    draggableHeight: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

class Dot extends Component {
    constructor(props){
        super(props);
        this.state = {
            x: props.dot.x,
            y: props.dot.y,
        };
        this.handleDrag = this.handleDrag.bind(this);
        this.onDragStop = this.onDragStop.bind(this);
    }

    handleDrag(e, ui) {
        this.setState({
            x: this.state.x + ui.deltaX,
            y: this.state.y + ui.deltaY,
        });
    };

    async onDragStop(){
        let leftPos = (this.props.dot.index+1)%7;
        if(leftPos === 0){
            leftPos = 7;
        }
        const topPos = Math.ceil((this.props.dot.index+1)/7);
        const leftCalc = this.state.x + (leftPos - 1) * 44;
        const topCalc = this.state.y - (this.props.draggableHeight - topPos * 44);
        if(leftCalc === 0 && topCalc === 0){
            await DeleteDot(this.props.dot.id);
            this.props.onUpdate();
        } else {
            this.setState({
                x: 0,
                y: 0,
            });
        }
    }

    render() {
        const {dot, timeColours} = this.props;
        const styles = {
            avatar: {
                margin: '2px',
                height: '40px',
                width: '40px',
                backgroundColor: dot.type === fullDayValue ? timeColours.fullDay : timeColours.halfDay
            },
        };
        return (
            <Draggable
                bounds="parent"
                onDrag={this.handleDrag}
                onStop={this.onDragStop}
                position={{x: this.state.x, y: this.state.y}}
                grid={[44, 44]}
            >
                <Avatar style={styles.avatar} color={dot.colour}>
                    {dot.ownerFirstName[0] + dot.ownerLastName[0]}
                </Avatar>
            </Draggable>
        )
    }
};

Dot.propTypes = propTypes;

export default Dot;
