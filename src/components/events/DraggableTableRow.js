import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

class DraggableTableRow extends Component {
    componentDidMount() {
        this.props.connectPreview(getEmptyImage());
    }
    render() {
        const { columns, style, isDragging, connectDragSource, className } = this.props;
        const dragStyle = {
            backgroundColor: isDragging ? 'pink' : 'white'
        };
        return connectDragSource(<div className={className} style={style}>{columns}</div>)
    }
}

const spec = {
    beginDrag(props) {
        console.log('begin', props.rowData.get('uid'));
        return {
            uid: props.rowData.get('uid')
        }
    },
    endDrag(props, monitor) {
        console.log('rowprops', props);
        const dropResult = monitor.getDropResult();
        console.log('dropResult', dropResult);
    }
};

const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
});

export default DragSource('event', spec, collect)(DraggableTableRow)