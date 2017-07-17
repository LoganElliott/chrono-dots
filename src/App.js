import React, { Component } from 'react';
import './App.css';
import Header from './components/header/header';
import CardList from './components/cardList/cardList'
import { baseApiUri } from './constants';
import StatsTable from './components/stats/StatsTable';

const ROUTE_CARDS = 'cards';
const ROUTE_STATS = 'stats';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            timeColours: {
                fullDay: '#555555',
                halfDay: '#D9E3F0',
            }, 
            description: 'Team Awesome',
            route: ROUTE_CARDS,
        };
        this.updateTimeColours = this.updateTimeColours.bind(this);
        this.onSelectCardsView = this.onSelectCardsView.bind(this);
        this.onSelectStatsView = this.onSelectStatsView.bind(this);
    }

    onSelectStatsView() {
        this.setState({ route: ROUTE_STATS });
    }

    onSelectCardsView() {
        this.setState({ route: ROUTE_CARDS });
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
            const myRequest = new Request('http://vdt107/ChronoDotsWeb/api/intouch/settings', myInit);
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
        const view = this.state.route === ROUTE_CARDS
            ? <CardList timeColours={this.state.timeColours}/>
            : <div><StatsTable /></div>;

        return (
            <div>
                <Header 
                    timeColours={this.state.timeColours} 
                    updateTimeColours={this.updateTimeColours}
                    onSelectCardsView={this.onSelectCardsView}
                    onSelectStatsView={this.onSelectStatsView}
                />
                {view}
            </div>
        );
    }
}

export default App;
