import firebase from 'firebase';
import conferences from './conferences';

var database = firebase.database();


export function saveEventsToFB() {
    const eventsRef = database.ref('/events');
    conferences.forEach(conference => eventsRef.push(conference))
};

window.runMigration = function () {
    database.ref('/events').once('value', data => {
        if (!data.val()) saveEventsToFB()
    })
};
