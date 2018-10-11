import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import Loader from './common/Loader';
import { deleteEvent, moduleName } from '../ducks/events';

class Trash extends Component {
    render() {
        const { canDrop, hovered, connectDropTarget } = this.props;
        const trashStyle = {
            position: 'fixed',
            top: '15px',
            right: '15px',
            backgroundColor: hovered ? 'red' : 'pink',
            border: `1px solid ${canDrop ? 'red' : 'pink'}`,
            borderRadius: '50%',
            height: '100px',
            width: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        };
        return connectDropTarget(<div style={trashStyle}>Trash</div>)
    }
}

const spec = {
    drop(props, monitor) {
        const eventUid = monitor.getItem().uid;
        props.deleteEvent(eventUid);
    }
};

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver()
});

export default connect(null, { deleteEvent })(DropTarget(['event'], spec, collect)(Trash))