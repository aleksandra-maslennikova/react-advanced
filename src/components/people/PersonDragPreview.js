import React, { Component } from 'react';
import { connect } from 'react-redux';
import { personSelector } from '../../ducks/people';

class PersonDragPreview extends Component {
    render() {
        const { person } = this.props;
        return (<h1>{person.firstName}</h1>);
    }
}


export default connect((state, props) => ({
    person: personSelector(state, props)
}))(PersonDragPreview)
