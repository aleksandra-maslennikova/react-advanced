import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { addEventToPerson, peopleListSelector } from '../../ducks/people';

class SelectedEventCard extends Component {
    render() {
        const { title, when, where } = this.props.event;
        const { connectDropTarget, canDrop, hovered, people } = this.props;
        const peopleElement = people && (people.map(person => person.email).join(', '))
        const dropStyle = {
            border: `1px solid ${canDrop ? 'red' : 'black'}`,
            backgroundColor: hovered ? 'pink' : 'white'
        };
        return connectDropTarget(
            <div style={dropStyle}>
                <h3>{title}</h3>
                <p>{where}, {when}</p>
                <p>{peopleElement}</p>
            </div>
        )
    }
}
const spec = {
    drop(props, monitor) {
        const personUid = monitor.getItem().uid;
        const eventUid = props.event.uid;
        props.addEventToPerson(eventUid, personUid);
        return { eventUid }
    }
}
const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver()
});

export default connect((state, props) => ({
    people: peopleListSelector(state).filter(person => person.events.includes(props.event.uid))
}), { addEventToPerson })(DropTarget(['person'], spec, collect)(SelectedEventCard))
