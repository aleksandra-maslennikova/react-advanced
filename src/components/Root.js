import React, { Component } from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import PersonPage from './routes/PersonPage';
import EventsPage from './routes/EventsPage';
import ProtectedRoute from './common/ProtectedRoute';
import CustomDragLayer from './CustomDragLayer';

import { moduleName, signOut } from '../ducks/auth'

class Root extends Component {
    render() {
        const { signOut, signedIn } = this.props
        const btn = signedIn
            ? <button onClick={signOut}>Sign out</button>
            : <Link to="/auth/signin">sign in</Link>
        return (
            <div>
                {btn}
                <ul>
                    <li><NavLink to="/admin" activeStyle={{ color: 'blue' }}>Admin</NavLink></li>
                    <li><NavLink to="/people" activeStyle={{ color: 'blue' }}>People</NavLink></li>
                    <li><NavLink to="/events" activeStyle={{ color: 'blue' }}>Events</NavLink></li>
                </ul>
                <ProtectedRoute path="/admin" component={AdminPage} />
                <ProtectedRoute path="/people" component={PersonPage} />
                <ProtectedRoute path="/events" component={EventsPage} />
                <Route path="/auth" component={AuthPage} />
                <CustomDragLayer />
            </div>
        )
    }
}

export default connect(state => ({
    signedIn: !!state[moduleName].user
}), { signOut }, null, { pure: false })(Root)
