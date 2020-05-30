import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TodoList from "./TodoList";
import TodoListhooks from "./TodoList-hooks";
var destination = document.querySelector("#container")

ReactDOM.render(
    <div>
        <TodoList/>
        <TodoListhooks/>
    </div>,
    destination
);