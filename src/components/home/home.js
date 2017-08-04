import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom'

import image from '../../chronoDotsIcon.png';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px'
    },
    image: {
        width: '400px',
        height: '400px',
    },
    text: {
        margin: '20px',
        fontSize: '18px',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        margin: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    link: {
        textDecoration: 'none',
        display: 'flex',
        color: 'white',
        justifyContent: 'center',
    }
};

const home = () => (
    <div>
        <div  style={styles.container}>
            <div>
                <img style={styles.image} src={image} alt='Chrono Dots Icon'/>
            </div>
            <div style={styles.text}>
                This is a tool created by Logan Elliott & Oscar Kuo with the help of the InTouch team to track team time
            </div>
        </div>
        <div style={styles.buttonsContainer}>
            <RaisedButton primary={true} style={styles.button}>
                <Link to='/time' style={styles.link}>Time</Link>
            </RaisedButton>
            <RaisedButton primary={true} style={styles.button}>
                <Link to='/statistics' style={styles.link}>Statistics</Link>
            </RaisedButton>
        </div>
    </div>
);

export default home;
