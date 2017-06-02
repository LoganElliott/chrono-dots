import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { BlockPicker } from 'react-color';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

class ColourDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colour: '#ff0000',
        };
    }

    handleChangeComplete = (colour, event) => {
        console.log(colour);
        this.setState({ colour: colour.hex });
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.onCancel}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.props.onSubmit(this.state.colour)}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Dialog With Actions"
                    actions={actions}
                    modal={false}
                    open={this.props.isOpen}
                    onRequestClose={this.props.onCancel}
                >
                    <BlockPicker
                        color={ this.state.colour }
                        onChangeComplete={this.handleChangeComplete}/>
                </Dialog>
            </div>
        );
    }
}

ColourDialog.propTypes = propTypes;

export default ColourDialog;