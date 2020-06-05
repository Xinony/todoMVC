import React, { Component, Fragment } from 'react'
import Login from './pages/login'
import regist from './pages/regist'
import TodoList from './pages/todolist'
import { HashRouter, Route, Switch } from 'react-router-dom'

class App extends Component {
    loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
    render() {
            return (
                <Fragment>
                    <HashRouter>
                        <Switch>
                            <Route exact path="/regist" component={regist} />
                            <Route exact path="/login" component={Login} />
                            <Route path="/" component={TodoList} />
                        </Switch>
                    </HashRouter>
                </Fragment>
            )
    }
}

export default App