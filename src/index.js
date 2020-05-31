import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TodoList from "./TodoList";
import TodoListhooks from "./TodoList-hooks";
import TodoListredux from "./TodoList-redux";
import TodoListLocalStorage from "./TodoList-localStorage";

var destination = document.querySelector("#container")

ReactDOM.render(
    <div>
        <TodoList/>
        <TodoListhooks/>
        <TodoListredux/>
        <TodoListLocalStorage/>
    </div>,
    destination
);