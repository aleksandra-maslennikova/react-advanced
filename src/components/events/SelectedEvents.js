import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectedEventsSelector } from '../../ducks/events';
import SelectedEventCard from './SelectedEventCard';


class SelectedEvents extends Component {
    render() {
        console.log('events', this.props.events);
        return (
            <div>
                {this.props.events && this.props.events.map(event => <SelectedEventCard event={event} key={event.uid} />)}
            </div>
        )
    }
}

export default connect(state => ({
    events: selectedEventsSelector(state)
}))(SelectedEvents)