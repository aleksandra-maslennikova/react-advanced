import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import PersonDragPreview from '../components/people/PersonDragPreview';
import EventDragPreview from '../components/events/EventDragPreview';

const layerStyle = {
    position: 'fixed',
    pointerEvents: 'none',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 10000
};

const previewMap = {
    person: PersonDragPreview,
    event: EventDragPreview
};

class CustomDragLayer extends Component {
    getItem() {
        const { offset, item, itemType } = this.props;
        const PreviewComponent = previewMap[itemType];
        console.log('offcet', offset);
        if (!offset || !PreviewComponent) return null;
        const { x, y } = offset;
        const style = {
            transform: `translate(${x}px, ${y}px)`,
            display: 'inline-block'
        }
        return (<div style={style}><PreviewComponent {...item} /></div>)

    }
    render() {
        const { isDragging } = this.props;
        const item = this.getItem();
        if (!isDragging || !item) return null;

        return (<div style={layerStyle}>{item}</div>);

    }
}

const collect = (monitor) => ({
    isDragging: monitor.isDragging(),
    offset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
    itemType: monitor.getItemType()
});

export default DragLayer(collect)(CustomDragLayer)
