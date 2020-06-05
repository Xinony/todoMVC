import React, { Component } from "react";


import TodoItems from "./TodoItems";
import "../../TodoList.css";
import {API_CODE, LOGIN_URL} from "../../common/js/api";
import {addTodo, deleteTodo, getTodo,changeTodo, logout} from "../../common/js/actions";


const ENTER_KEY = 13;
const ESCAPE_KEY = 27;


class TodoList extends Component {
  loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
  constructor(props) {
    super(props);
    this.state={
      items:[]
    }
    var that=this
    getTodo(this.loginInfo,function (result) {
      if(result.code === API_CODE.OK){
        for(let j = 0,len=result.data.length; j < len; j++) {
          result.data[j].isChangeInput=false
        }
        that.setState({
          items: result.data
        })

        window.localStorage.setItem('items',JSON.stringify(result.data));
      }
    })
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  deleteItem(taskid) {
    var that=this;
    let data = {
      userid: this.loginInfo.userid,
      apikey:this.loginInfo.apikey,
      taskid:taskid
    }
    deleteTodo(data,function (result) {
      if(result.code === API_CODE.ERR_LOGOUT){
        alert(result.message)
        logout(that)
        return;
      }
      if(result.code === API_CODE.OK){
        var filteredItems = that.state.items.filter(function (item) {
          return (item.taskid !== taskid);
        });
        that.setState({
          items: filteredItems
        });
        window.localStorage.setItem('items',JSON.stringify(filteredItems));
      }
      else{
        alert(result.message)
      }
    })
  }

  addItem(e) {
    var that=this
    if (this._inputElement.value !== "") {
      var newItem = {
        userid: this.loginInfo.userid,
        apikey:this.loginInfo.apikey,
        task: this._inputElement.value,
        isdone: false,
        key: Date.now(),
        isChangeInput:false
      };
      addTodo(newItem,function (result) {
        console.log(result)
        if (result.code === API_CODE.ERR_LOGOUT) {
          logout(that);
          return;
        }
        if(result.code === API_CODE.OK){
          newItem.taskid=result.taskid;
          var addedItems = that.state.items.concat(newItem)
          that.setState({
            items: addedItems
          },()=>{
          });
          window.localStorage.setItem('items',JSON.stringify(addedItems));
        }

      })
      this._inputElement.value = "";
    }
    e.preventDefault();
  }
  changeItem(taskid,changedState) {
    const that=this;
    for(let j = 0,len=this.state.items.length; j < len; j++) {
      if(taskid === this.state.items[j].taskid) {
        var changedItem = {
          userid: this.loginInfo.userid,
          apikey:this.loginInfo.apikey,
          taskid:taskid,
          task: changedState.task,
          isdone:changedState.isdone,
          key: Date.now()
        };
        changeTodo(changedItem,function (result) {
          if (result.code === API_CODE.ERR_LOGOUT) {
            logout(that);
            return;
          }
          if(result.code === API_CODE.OK){
            that.state.items[j].task = changedState.task
            that.state.items[j].isdone = changedState.isdone
            that.setState({
              items:that.state.items
            })
          }
        })
        break;
      }
    }
  }

  changeInput(taskid,state){
    for(let j = 0,len=this.state.items.length; j < len; j++) {
      if(taskid === this.state.items[j].taskid) {
        let changedItems=this.state.items
        changedItems[j].isChangeInput = state
        this.setState({
          items:changedItems
        })
        return;
      }
    }
  }

  logout() {
    window.localStorage.removeItem('loginInfo')
    this.props.history.push('/login')
  }

  handleKeyDown(event) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      this.addItem(event);
    }
  }


  render() {
    if (!this.loginInfo) {
      alert('请先登录')
      window.location.href = LOGIN_URL
      return null
    }
    else {
      return (
          <div className="todoListMain">
            <div>
              <label className="username">{this.loginInfo.username}</label>
              <button className="logout-button" onClick={this.logout.bind(this)}><span>Logout</span></button>
            </div>
            <div className="header">
                <input ref={(a) => this._inputElement = a} placeholder="enter task" onKeyDown={ e => this.handleKeyDown(e) }>
                </input>
            </div>
            <TodoItems entries={this.state.items}
                       delete={this.deleteItem}
                       changeInput={this.changeInput}
                       change={this.changeItem}/>
          </div>
      );
    }
  }
}

export default TodoList;