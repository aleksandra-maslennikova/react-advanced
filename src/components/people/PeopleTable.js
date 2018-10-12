import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import { TransitionMotion, spring } from 'react-motion';
import Loader from '../common/Loader';
import { fetchAllPeople, moduleName, peopleListSelector } from '../../ducks/people';

class PeopleTable extends Component {
    componentDidMount() {
        this.props.fetchAllPeople()
    }

    componentDidUpdate({ people }) {
        if (people.length && this.props.people.length > people.length) {
            setTimeout(() => {
                this.table.scrollToRow(this.props.people.length);
            }, 100)
        }
    }

    getStyles = () => this.props.people.map(person => ({
        key: person.uid,
        style: { opacity: spring(1, { stiffness: 10 }) },
        data: person
    }))


    rowGetter = ({ index }) => {
        return this.props.people[index];
    }

    setTableRef = ref => this.table = ref;

    willEnter = () => ({
        opacity: 0
    })

    render() {
        const { people } = this.props;
        if (!people.length) return null;
        return (
            <TransitionMotion
                willEnter={this.willEnter}
                styles={this.getStyles}
            >
                {interpolated => (
                    <Table
                        ref={this.setTableRef}
                        rowHeight={35}
                        headerHeight={50}
                        height={300}
                        width={600}
                        rowGetter={this.rowGetter}
                        rowCount={interpolated.length}
                        rowStyle={({ index }) => index < 0 ? {} : interpolated[index].style}
                        overscanRowCount={2}
                    >
                        <Column
                            label="firstName"
                            dataKey="firstName"
                            width={200}
                        />
                        <Column
                            label="lastName"
                            dataKey="lastName"
                            width={200}
                        />
                        <Column
                            label="email"
                            dataKey="email"
                            width={200}
                        />
                    </Table>
                )}
            </TransitionMotion>
        )
    }

}

export default connect(state => ({
    people: peopleListSelector(state),
    loading: state[moduleName].loading
}), { fetchAllPeople })(PeopleTable)