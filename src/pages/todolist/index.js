import React, { Component } from "react";

import TodoItems from "./TodoItems";
import "../../TodoList.css";
import {API_CODE, LOGIN_URL, KEY_CODE, API_LIST} from "../../common/js/api";
import {logout, apiRequest} from "../../common/js/actions";

class TodoList extends Component {
  loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
  constructor(props) {
    super(props);
    this.state={
      items:[]
    }
    var that=this
    //获取后台服务器中的Todo数据并存入本地
    apiRequest(API_LIST.GET_TODO,this.loginInfo,function (result) {
      if(result.code === API_CODE.ERR_LOGOUT){
        logout();
        alert(result.message)
        return;
      }
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

  //删除事件
  deleteItem(taskid) {
    var that=this;
    let data = {
      userid: this.loginInfo.userid,
      apikey:this.loginInfo.apikey,
      taskid:taskid
    }
    apiRequest(API_LIST.DELETE_TODO, data,function (result) {
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

  //添加事件
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
      apiRequest(API_LIST.ADD_TODO, newItem,function (result) {
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

  //更改事件名称或完成情况
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
        apiRequest(API_LIST.CHANGE_TODO, changedItem,function (result) {
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

  //更改是否为输入框
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

  //登出
  logout() {
    window.localStorage.removeItem('loginInfo')
    this.props.history.push('/login')
  }

  //键盘按下触发
  handleKeyDown(event) {
   if (event.keyCode === KEY_CODE.ENTER_KEY) {
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