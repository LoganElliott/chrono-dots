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

        const match = window.location.href.match(/#\/(.+)\/(home|statistics|time)/);
        let teamId;
        if (match) {
            teamId = match[1];
        }

        this.state = {
            isDrawerOpen: false,
            isColourDialogOpen: false,
            colourPickerOpenId: '',
            teamId,
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

    renderRouteLinks () {
        if(this.state.teamId) {
            return (
                <div>
                    <MenuItem onClick={() => {
                        this.handleToggle();
                    }}>
                        <Link to={`/${this.state.teamId}/home`}
                              style={{textDecoration: 'none', display: 'flex', color: 'black'}}>Home</Link>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        this.handleToggle();
                    }}>
                        <Link to={`/${this.state.teamId}/time`}
                              style={{textDecoration: 'none', display: 'flex', color: 'black'}}>Time</Link>
                    </MenuItem>
                    <MenuItem onClick={() => {
                        this.handleToggle();
                    }}>
                        <Link to={`/${this.state.teamId}/statistics`}
                              style={{textDecoration: 'none', display: 'flex', color: 'black'}}>Statistics</Link>
                    </MenuItem>
                    <br />
                </div>
            )
        }
    }

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
                    {this.renderRouteLinks()}
                    <MenuItem onClick={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('fullDay')}} style={styles.fullDayStyle}>
                        Full Day Colour
                    </MenuItem>
                    <MenuItem onClick={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('halfDay')}} style={styles.halfDayStyle}>
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
