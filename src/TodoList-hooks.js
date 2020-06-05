import React from "react";
import TodoItems from "./pages/todolist/TodoItems";
import "./TodoList.css";
import { useState } from 'react';

function TodoListhooks() {
    const [items, setItem] = useState([]);
    const [inputElement,setinputElement] = useState();

    function deleteItem(key) {
        var filteredItems = items.filter(function (item) {
            return (item.key !== key);
        });
        setItem(filteredItems);
    }

    function addItem(e) {
        if (inputElement !== "") {
            var newItem = {
                text: inputElement.value,
                key: Date.now()
            };
            setItem(items.concat(newItem))
        }
        ;
        console.log(inputElement.value);
        setinputElement ("");
        console.log(items);
        e.preventDefault();
    }
        return (
            <div className="todoListMain">
                <div className="header">
                    <form onSubmit={addItem}>
                        <input ref={(a) => setinputElement (a)} placeholder="enter task">
                        </input>
                        <button type="submit">add-hooks</button>
                    </form>
                </div>

                <TodoItems entries={items}
                           delete={deleteItem}/>
            </div>
        );
}

export default TodoListhooks;