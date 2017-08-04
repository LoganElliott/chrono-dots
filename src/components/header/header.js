import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ColourDialog from '../colourDialog/colourDialog';

const propTypes = {
    timeColours: PropTypes.shape({
        fullDay: PropTypes.string.isRequired,
        halfDay: PropTypes.string.isRequired,
    }),
    updateTimeColours: PropTypes.func.isRequired,
};

class header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDrawerOpen: false,
            isColourDialogOpen: false,
            colourPickerOpenId: ''
        };
    }

    handleToggle = () => this.setState({isDrawerOpen: !this.state.isDrawerOpen});

    handleToggleIsColourDialogOpen = (id) => {
        if(!this.state.isColourDialogOpen) {
            this.setState({colourPickerOpenId: id, colourPickerTitle: `Select ${id} colour`});
        } else {
            this.setState({colourPickerOpenId: ''});
        }
        this.setState({isColourDialogOpen: !this.state.isColourDialogOpen});
    };

    handleClose = () => this.setState({isDrawerOpen: false});

    handleSetColour = (colour) => {
        let timeColours = this.props.timeColours;
        timeColours[this.state.colourPickerOpenId] = colour;

        this.handleToggleIsColourDialogOpen();
        this.props.updateTimeColours(timeColours);
    };

    render() {
        const styles = {
            fullDayStyle: {
                backgroundColor: this.props.timeColours.fullDay,
            },
            halfDayStyle: {
                backgroundColor: this.props.timeColours.halfDay,
            }
        };

        return (
            <div>
                <AppBar
                    title="Chrono Dots"
                    onLeftIconButtonTouchTap={this.handleToggle}

                />
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.isDrawerOpen}
                    onRequestChange={(isDrawerOpen) => this.setState({isDrawerOpen})}
                >
                    <MenuItem onTouchTap={() => {
                        this.handleToggle();
                    }}>
                        <Link to='/' style={{ textDecoration: 'none', display: 'flex', color: 'black' }}>Home</Link>
                    </MenuItem>
                    <MenuItem onTouchTap={() => {
                        this.handleToggle();
                    }}>
                        <Link to='/time' style={{ textDecoration: 'none', display: 'flex', color: 'black' }}>Time</Link>
                    </MenuItem>
                    <MenuItem onTouchTap={() => {
                        this.handleToggle();
                    }}>
                        <Link to='/statistics' style={{ textDecoration: 'none', display: 'flex', color: 'black' }}>Statistics</Link>
                    </MenuItem>
                    <br />
                    <MenuItem onTouchTap={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('fullDay')}} style={styles.fullDayStyle}>
                        Full Day Colour
                    </MenuItem>
                    <MenuItem onTouchTap={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('halfDay')}} style={styles.halfDayStyle}>
                        Half Day Colour
                    </MenuItem>
                </Drawer>
                <ColourDialog title={this.state.colourPickerTitle} isOpen={this.state.isColourDialogOpen} onCancel={this.handleToggleIsColourDialogOpen} onSubmit={this.handleSetColour}/>
            </div>
        );
    }
}

header.propTypes = propTypes;

export default header;
