import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Column } from 'react-virtualized';
import { fetchAllPeople, moduleName, peopleListSelector } from '../../ducks/people';
import Loader from '../common/Loader';

class PeopleTable extends Component {
    componentDidMount() {
        this.props.fetchAllPeople()
    }
    render() {
        const { loading, people } = this.props;
        if (loading) return <Loader />
        return (
            <Table
                rowHeight={35}
                headerHeight={50}
                height={300}
                width={600}
                rowGetter={this.rowGetter}
                rowCount={people.length}
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
        )
    }
    rowGetter = ({ index }) => {
        console.log('index', index);
        return this.props.people[index];
    }
}

export default connect(state => ({
    people: peopleListSelector(state),
    loading: state[moduleName].loading
}), { fetchAllPeople })(PeopleTable)