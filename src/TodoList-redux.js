import React, { Component } from "react";
import TodoItems from "./pages/todolist/TodoItems";
import "./TodoList.css";

import store from './store/index'

class TodoListredux extends Component {

    constructor(props) {
        super(props);
        this.state = store.getState();
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.storeChagne=this.storeChagne.bind(this)
        store.subscribe(this.storeChagne)
    }

    storeChagne () {
        this.setState({
            items:store.getState().items
        })
    }

    deleteItem(key) {
        var action={
            type:"deleteItem",
            key: key
        };
        store.dispatch(action)
        console.log(this.state);
    }

    addItem(e) {
        if (this._inputElement.value !== "") {
            var action = {
                type:"addItem",
                text: this._inputElement.value,
                key: Date.now()
            };
            store.dispatch(action)
            this._inputElement.value = "";
        }
        console.log(this.state);
        e.preventDefault();
    }

    render() {
        return (
            <div className="todoListMain">
                <div className="header">
                    <form onSubmit={this.addItem}>
                        <input ref={(a) => this._inputElement = a} placeholder="enter task">
                        </input>
                        <button type="submit">add-redux</button>
                    </form>
                </div>
                <TodoItems entries={this.state.items}
                           delete={this.deleteItem}/>
            </div>
        );
    }
}

export default TodoListredux;