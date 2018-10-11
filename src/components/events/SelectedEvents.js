import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { TransitionMotion, spring } from 'react-motion';
import { selectedEventsSelector } from '../../ducks/events';
import SelectedEventCard from './SelectedEventCard';


class SelectedEvents extends Component {
    getStyles = () => {
        return this.props.events && this.props.events.map(event => ({
            style: { opacity: spring(1, { stiffness: 50 }) },
            key: event.uid,
            data: event
        }))
    }

    willLeave = () => ({
        opacity: spring(0, { stiffness: 100 })
    })

    willEnter = () => ({
        opacity: 0
    })

    render() {
        return (
            <TransitionMotion
                styles={this.getStyles()}
                willLeave={this.willLeave}
                willEnter={this.willEnter}
            >
                {(interpolated) => <Fragment>{interpolated.map(config => <div key={config.key} style={config.style}><SelectedEventCard event={config.data} /></div>)}</Fragment>}

            </TransitionMotion>
        )
    }
}

export default connect(state => ({
    events: selectedEventsSelector(state)
}))(SelectedEvents)
