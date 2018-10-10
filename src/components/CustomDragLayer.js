import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import PersonDragPreview from '../components/people/PersonDragPreview';

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
    person: PersonDragPreview
};

class CustomDragLayer extends Component {
    getItem() {
        const { offset, item, itemType } = this.props;
        const PreviewComponent = previewMap[itemType];

        if (!offset || !PreviewComponent) return null;
        const style = {
            transform: `translate(${x}px, ${y}px)`
        }
        const { x, y } = offset;
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
