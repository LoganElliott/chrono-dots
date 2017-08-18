import React, { Component } from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom'
import './App.css';
import Header from './components/header/header';
import CardList from './components/cardList/cardList'
import { baseApiUri } from './constants';
import StatsTable from './components/stats/StatsTable';
import Home from './components/home/home';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            timeColours: {
                fullDay: '#555555',
                halfDay: '#D9E3F0',
            }, 
            description: 'Team Awesome',
        };
        this.updateTimeColours = this.updateTimeColours.bind(this);
    }

    async getSettings(){
        let data;
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            const myInit = {
                method: 'GET',
                headers: myHeaders
            };
            const myRequest = new Request(`${baseApiUri}/intouch/settings`, myInit);
            let response = await fetch(myRequest);
            data = await response.json();
            this.setState({timeColours: {
                halfDay: data.halfDayDotColour,
                fullDay: data.fullDayDotColour,
                description: data.description,
            }});

        } catch(e) {
            console.log('Unable to get cards', e)
        }
        return data;
    }

    async updateSettings(timeColours, description){
        let data;
        try {
            let myHeaders = new Headers();
            myHeaders.append("Access-Control-Allow-Origin", "*");
            myHeaders.append('Content-Type', 'application/json');

            const myInit = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    description: description,
                    halfDayDotColour: timeColours.halfDay,
                    fullDayDotColour: timeColours.fullDay,
                })
            };
            const myRequest = new Request(`${baseApiUri}/intouch/settings`, myInit);
            await fetch(myRequest);

            this.setState({timeColours});

        } catch(e) {
            console.log('Unable to update settings', e)
        }
        return data;
    }

    updateTimeColours(timeColours){
        this.updateSettings(timeColours, this.state.description);
    }

    componentWillMount(){
        this.getSettings();
    }

    render() {
        return (
            <div>
                <Header
                    timeColours={this.state.timeColours}
                    updateTimeColours={this.updateTimeColours}
                />
                <Switch>
                    <Route exact path='/:teamId/home' render={(props) => <Home { ...props }/>}/>
                    <Route exact path='/:teamId/time' render={(props) => <CardList { ...props } timeColours={this.state.timeColours}/>}/>
                    <Route exact path='/:teamId/statistics' render={(props) => <div><StatsTable { ...props }/></div>}/>
                </Switch>
            </div>
        );
    }
}

export default App;
