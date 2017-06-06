import React from 'react';
import { GetCards } from '../cardList/actions';
import {
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const mapCardsToStats = (cards) => {
    const stats = {};
    for (let card of cards) {
        for (let dot of card.dots) {
            const userName = `${dot.ownerFirstName} ${dot.ownerLastName}`;
            if (stats[userName] === undefined) stats[userName] = { };
            if (stats[userName][card.title] === undefined) {
                stats[userName][card.title] = 0;
            } else { 
                stats[userName][card.title] += (dot.type === 0) ? 0.5 : 1;
            }
        }
    }

    return stats;
};

const mapStatsToRows = (stats, cards) => { 
    const rows = [];
    
    for (let username in stats) {
        if (!stats.hasOwnProperty(username)) 
            continue;

        const columns = [];

        columns.push(<TableRowColumn key={username}>{username}</TableRowColumn>);
    
        for (let card of cards) {
            const key = username + "#" + card.title;
            columns.push(<TableRowColumn key={key}>{stats[username][card.title]}</TableRowColumn>);
        }

        rows.push(<TableRow key={"Row#" + username}>{columns}</TableRow>);
    }

    return rows;
};

class StatsTable extends React.Component {
    constructor() {
        super();
        this.getCards = this.getCards.bind(this);
        this.state = { cards: [] };
    }

    async getCards(){
        const cards = await GetCards();
        this.setState({cards});
    }

    componentWillMount() {
        this.getCards();
    }

    render() {
        const columns = this.state.cards.map(c => <TableHeaderColumn key={"header#" + c.title}>{c.title}</TableHeaderColumn>);
        const stats = mapCardsToStats(this.state.cards);
        const rows = mapStatsToRows(stats, this.state.cards);
        return (
            <Table>
                <TableBody displayRowCheckbox={false}>
                    <TableRow key="header">
                        <TableHeaderColumn key="header#Users">Users</TableHeaderColumn>);
                        {columns}
                    </TableRow>
                    {rows}
                </TableBody>
            </Table>
        );
    }
}

export default StatsTable;
