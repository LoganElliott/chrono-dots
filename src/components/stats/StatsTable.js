import React from 'react';
import { GetCards } from '../cardList/actions';
import {
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
    cell: {
        color: 'black',
        fontSize: '16px'
    },
    totalNumber: {
        fontWeight: 'bold',
    },
    featureTotal: {
        backgroundColor: '#E0F7FA',
    },
    header: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    userHeader: {
        backgroundColor: '#D1C4E9',
    },
};

class StatsTable extends React.Component {
    constructor() {
        super();
        this.getCards = this.getCards.bind(this);
        this.state = {
            cards: []
        };
    }

    async getCards(){
        const cards = await GetCards();
        this.setState({cards});
    }

    componentWillMount() {
        this.getCards();
    }

    mapCardsToStats(cards) {
        const stats = {};
        for (let card of cards) {
            for (let dot of card.dots) {
                const userName = `${dot.ownerFirstName} ${dot.ownerLastName}`;
                if (stats[userName] === undefined) stats[userName] = { };
                if (stats[userName][card.title] === undefined) {
                    stats[userName][card.title] = 0;
                }
                stats[userName][card.title] += (dot.type === 0) ? 0.5 : 1;
            }
        }

        return stats;
    };

    totalWorkLoggedRow(userTotals) {
        const columns = [];

        columns.push(<TableRowColumn style={{...styles.cell, ...styles.totalNumber}} key={'totals'}>{'User Totals (days)'}</TableRowColumn>);
        for (let username in userTotals) {
            columns.push(<TableRowColumn style={{...styles.cell, ...styles.totalNumber}} key={username}>{userTotals[username]}</TableRowColumn>);
        }

        return <TableRow selectable={false} key={"Row#Total"} style={{backgroundColor: '#FFE082'}}>{columns}</TableRow>;
    };

    mapStatsToRows(stats, cards) {
        const rows = [];
        const userTotals = {};

        for (let card of cards) {
            const columns = [];
            let first = true;
            let featureWorkTotal = 0;
            for (let username in stats) {
                if (!stats.hasOwnProperty(username))
                    continue;
                if (first) {
                    columns.push(<TableRowColumn key={card.title}>{card.title}</TableRowColumn>);
                    first = false;
                }
                let workLogged = stats[username][card.title];
                if(userTotals[username] === undefined){
                    userTotals[username] = 0;
                }

                if(workLogged !== undefined){
                    featureWorkTotal += workLogged;
                    userTotals[username] += workLogged;
                }
                columns.push(<TableRowColumn style={styles.cell} key={username}>{workLogged}</TableRowColumn>);
            }
            columns.push(<TableRowColumn style={{...styles.cell, ...styles.totalNumber, ...styles.featureTotal}} key={'featureWorkTotal'}>{featureWorkTotal}</TableRowColumn>);

            if (featureWorkTotal !== 0){
                rows.push(<TableRow selectable={false} key={"Row#" + card.title}>{columns}</TableRow>);
            }
        }

        rows.push(this.totalWorkLoggedRow(userTotals));

        return rows;
    }

    renderTable(cards) {
        const stats = this.mapCardsToStats(cards);
        const columns = [];

        for (let username in stats) {
            columns.push(<TableHeaderColumn style={{...styles.header, ...styles.userHeader}} key={"header#" + username}>{username}</TableHeaderColumn>);
        }
        columns.push(<TableHeaderColumn style={{...styles.header, ...styles.featureTotal}} key={"header#Totals"}>{'Feature Totals (days)'}</TableHeaderColumn>);

        const rows = this.mapStatsToRows(stats, cards);
        return (
            <Table>
                <TableBody displayRowCheckbox={false}>
                    <TableRow key="header">
                        <TableHeaderColumn style={{...styles.header, ...styles.userHeader}} key="header#Users">Users</TableHeaderColumn>);
                        {columns}
                    </TableRow>
                    {rows}
                </TableBody>
            </Table>
        );
    }

    render() {
        if(!this.state.cards || this.state.cards.length === 0){
            return null;
        }

       return this.renderTable(this.state.cards)
    }
}

export default StatsTable;
