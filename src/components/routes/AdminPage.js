import React, { Component } from 'react';

import PeopleList from '../people/PeopleList';
import SelectedEvents from '../events/SelectedEvents';
import EventsList from '../events/VirtualizedEventList';

class AdminPage extends Component {
    render() {
        return (
            <div>
                <h1>Admin Page</h1>
                <PeopleList />
                <SelectedEvents />
                <EventsList />
            </div>
        )
    }
}

export default AdminPage
