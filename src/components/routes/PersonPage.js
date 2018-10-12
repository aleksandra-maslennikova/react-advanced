import React, { Component } from 'react';
import { connect } from 'react-redux';

import NewPersonForm from '../people/NewPersonForm';
import PeopleTable from '../people/PeopleTable';
import Loader from '../common/Loader';

import { addPerson, moduleName } from '../../ducks/people';

class PersonPage extends Component {
    render() {
        const { loading } = this.props;
        console.log('personPage', this.props);
        return (
            <div>
                <PeopleTable />
                {loading ? <Loader /> : <NewPersonForm onSubmit={this.props.addPerson} />}
            </div>

        )
    }
}

export default connect(state => ({
    loading: state[moduleName].loading
}), { addPerson })(PersonPage)
