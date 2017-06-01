import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ColourDialog from '../colourDialog/colourDialog';

class header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDrawerOpen: false,
            isColourDialogOpen: false,
            timeColours: {
                fullDay: '#e57373',
                halfDay: '#00e676',
            },
            colourPickerOpenId: ''
        };
    }

    handleToggle = () => this.setState({isDrawerOpen: !this.state.isDrawerOpen});

    handleToggleIsColourDialogOpen = (id) => {
        if(!this.state.isColourDialogOpen) {
            this.setState({colourPickerOpenId: id});
        } else {
            this.setState({colourPickerOpenId: ''});
        }
        this.setState({isColourDialogOpen: !this.state.isColourDialogOpen});
    };

    handleClose = () => this.setState({isDrawerOpen: false});

    handleSetColour = (colour) => {
        let timeColours = this.state.timeColours;
        timeColours[this.state.colourPickerOpenId] = colour;

        this.handleToggleIsColourDialogOpen();
        this.setState({timeColours});
    };

    render() {
        const styles = {
            fullDayStyle: {
                backgroundColor: this.state.timeColours.fullDay,
            },
            halfDayStyle: {
                backgroundColor: this.state.timeColours.halfDay,
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
                    <MenuItem onTouchTap={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('fullDay')}} style={styles.fullDayStyle}>
                        Full Day Colour
                    </MenuItem>
                    <MenuItem onTouchTap={() => {this.handleClose(); this.handleToggleIsColourDialogOpen('halfDay')}} style={styles.halfDayStyle}>
                        Half Day Colour
                    </MenuItem>
                </Drawer>
                <ColourDialog isOpen={this.state.isColourDialogOpen} onCancel={this.handleToggleIsColourDialogOpen} onSubmit={this.handleSetColour}/>
            </div>
        );
    }
}

export default header;
