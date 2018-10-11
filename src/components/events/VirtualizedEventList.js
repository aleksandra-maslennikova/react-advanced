import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column, InfiniteLoader } from 'react-virtualized';

import DraggableTableRow from './DraggableTableRow';
import { moduleName, fetchLazy, selectEvent, eventListSelector } from '../../ducks/events';

import 'react-virtualized/styles.css'

export class EventList extends Component {
    componentDidMount() {
        this.props.fetchLazy();
    }

    isRowLoaded = ({ index }) => index < this.props.events.length

    loadMoreRows = () => {
        this.props.fetchLazy();
    }

    rowGetter = ({ index }) => {
        return this.props.events[index];
    }

    rowRenderer = (props) => <DraggableTableRow {...props} />

    handleRowClick = ({ rowData }) => {
        const { selectEvent } = this.props;
        selectEvent && selectEvent(rowData.uid);
    }

    render() {
        const { loaded, events } = this.props;
        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                rowCount={loaded ? events.length : events.length + 1}
                loadMoreRows={this.loadMoreRows}
            >
                {({ onRowsRendered, registerChild }) =>
                    <Table
                        ref={registerChild}
                        rowCount={events.length}
                        rowGetter={this.rowGetter}
                        rowRenderer={this.rowRenderer}
                        rowHeight={40}
                        headerHeight={50}
                        overscanRowCount={5}
                        width={700}
                        height={300}
                        onRowClick={this.handleRowClick}
                        onRowsRendered={onRowsRendered}
                    >
                        <Column
                            label="title"
                            dataKey="title"
                            width={300}
                        />
                        <Column
                            label="where"
                            dataKey="where"
                            width={250}
                        />
                        <Column
                            label="when"
                            dataKey="month"
                            width={150}
                        />
                    </Table>
                }
            </InfiniteLoader>
        )
    }

}

export default connect(state => ({
    events: eventListSelector(state),
    loading: state[moduleName].loading
}), { fetchLazy, selectEvent })(EventList)
