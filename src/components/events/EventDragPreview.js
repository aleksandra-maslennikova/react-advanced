import React, { Component } from 'react';
import { connect } from 'react-redux';
import { eventSelector } from '../../ducks/events';

class EventDragPreview extends Component {
    render() {
        const { event } = this.props;
        return (<h1>{event.get('title')}</h1>);
    }
}

export default connect((state, props) => ({
    event: eventSelector(state, props)
}))(EventDragPreview)
