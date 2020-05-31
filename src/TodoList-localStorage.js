import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./TodoList.css";
import storage from "./localStorage";

var localItems=storage.get("items")

class TodoListLocalStorage extends Component {

    constructor(props) {
        super(props);
        if(localItems){
        this.state = {
            items: localItems
        };
        }
        else{
            this.state = {
            items: localItems
        };
        }
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem(key) {
        var filteredItems = this.state.items.filter(function (item) {
            return (item.key !== key);
        });

        this.setState({
            items: filteredItems
        });
        storage.set('items',filteredItems);
    }

    addItem(e) {
        if (this._inputElement.value !== "") {
            var newItem = {
                text: this._inputElement.value,
                key: Date.now()
            };
            var addedItems = this.state.items.concat(newItem)
            this.setState({
                    items: addedItems
            });
            storage.set('items',addedItems);
            this._inputElement.value = "";
        }
        console.log(this.state.items);
        console.log("localStorage:",storage.get("items"))
        e.preventDefault();
    }
    render() {
        return (
            <div className="todoListMain">
                <div className="header">
                    <form onSubmit={this.addItem}>
                        <input ref={(a) => this._inputElement = a} placeholder="enter task">
                        </input>
                        <button type="submit">add-state</button>
                    </form>
                </div>
                <TodoItems entries={this.state.items}
                           delete={this.deleteItem}/>
            </div>
        );
    }
}

export default TodoListLocalStorage;