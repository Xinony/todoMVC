import React, { Component, Fragment } from 'react'
import Login from './pages/login'
import regist from './pages/regist'
import TodoList from './pages/todolist'
import { HashRouter, Route, Switch } from 'react-router-dom'
import {loadtime} from "./common/js/actions";

class App extends Component {
    loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
    render() {
        loadtime();
            return (
                <Fragment>
                    <HashRouter>
                        <Switch>
                            <Route exact path="/todolist" component={TodoList} />
                            <Route exact path="/regist" component={regist} />
                            <Route path="/" component={Login} />
                        </Switch>
                    </HashRouter>
                </Fragment>
            )
    }
}

export default App