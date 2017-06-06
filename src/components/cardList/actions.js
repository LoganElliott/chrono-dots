import { baseApiUri } from '../../constants.js';
import $ from "jquery";

export const GetCards = async () => {
    let data;
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        const myInit = {
            method: 'GET',
            headers: myHeaders
        };
        const myRequest = new Request(`${baseApiUri}/intouch/dashboard`, myInit);
        let response = await fetch(myRequest);
        data = await response.json();
        return data;
    } catch(e) {
        console.log('Unable to get cards', e)
    }

};

export const AddDot = async (cardId, timeAmount) => {
    try {
        await $.post(`${baseApiUri}/cards/${cardId}/dots2`, { type: timeAmount });
    } catch(e) {
        console.log('Unable to add dot', e)
    }
};

export const DeleteDot = async (dotId) => {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append('Content-Type', 'application/json');

        const myInit = {
            method: 'DELETE',
            headers: myHeaders,
        };
        const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/dots/${dotId}`, myInit);
        await fetch(myRequest);
    } catch(e) {
        console.log('Unable to delete dots', e)
    }
};

export const DeleteDots = async (cardId) => {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append('Content-Type', 'application/json');

        const myInit = {
            method: 'DELETE',
            headers: myHeaders,
        };
        const myRequest = new Request(`http://vdt107/ChronoDotsWeb/api/cards/${cardId}/dots`, myInit);
        await fetch(myRequest);
    } catch(e) {
        console.log('Unable to delete dots', e)
    }
};

export const DeleteCard = async (cardId) => {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append('Content-Type', 'application/json');

        const myInit = {
            method: 'DELETE',
            headers: myHeaders,
        };
        const myRequest = new Request(`${baseApiUri}/cards/${cardId}`, myInit);
        await fetch(myRequest);
    } catch(e) {
        console.log('Unable to delete card', e)
    }
};

export const UpdateCard = async (card, colour) => {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append('Content-Type', 'application/json');

        const myInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({title: card.title, colour: colour})
        };
        const myRequest = new Request(`${baseApiUri}/cards/${card.id}`, myInit);
        await fetch(myRequest);
    } catch(e) {
        console.log('Unable to updated card', e)
    }
};

export const AddCard = async (title) => {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append('Content-Type', 'application/json');

        const myInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                title: title,
                colour: '#' + Math.random().toString(16).slice(2, 8)
            })
        };
        const myRequest = new Request(`${baseApiUri}/intouch/cards`, myInit);
        await fetch(myRequest);
    } catch(e) {
        console.log('Unable to add card', e)
    }
};
