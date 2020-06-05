import React, { Component } from "react";
import FlipMove from "react-flip-move";


import "../../common/css/box.css"

var count = 0;

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class TodoItems extends Component {

    constructor(props) {
        super(props);
        this.createTasks = this.createTasks.bind(this);
    }
    _inputElement=""
    isdone = false
    delete(taskid) {
        this.props.delete(taskid);
    }
    changeInput(taskid,state){
        this.props.changeInput(taskid,state);
    }

    changeItem(taskid,changedState) {
        this.props.change(taskid, changedState)
    }


    Click = (item) => {
        count += 1;
        setTimeout(() => {
            if (count === 1) {
                this.changeInput(item.taskid,!item.isChangeInput)
            } else if (count === 2) {
                this.delete(item.taskid)
            }
            count = 0;
        }, 300);
    }

    /*createTasks(item) {
        return <li onClick={() => this.delete(item.taskid)}
                   key={item.taskid}>{item.task}</li>
    }*/

    handleKeyDown(event,item) {
        if (event.keyCode === ESCAPE_KEY) {
            this.changeInput(item.taskid,!item.isChangeInput)
            this._inputElement.focus()
        } else if (event.keyCode === ENTER_KEY) {
            this.changeItem(item.taskid,{task:this._inputElement,
                                                     isdone:this.isdone});
            this.changeInput(item.taskid,!item.isChangeInput)
        }
    }
    handleOnblur(item){
        this.changeItem(item.taskid,{task:this._inputElement,
            isdone:this.isdone});
        this.changeInput(item.taskid,!item.isChangeInput)
    }

    createTasks(item) {
        if(!item.isChangeInput){
            return <div key={'div'+item.taskid}><input checked={item.isdone} type='checkbox' className="check" onChange={() =>this.changeItem(item.taskid,{task:item.task,isdone:!item.isdone})} key={'input'+item.taskid}/><li onClick={() =>this.Click(item)} key={item.taskid}><label style={{textDecorationLine:item.isdone?'line-through':'none'}}> {item.task}</label></li></div>
        }
        else{
            this._inputElement = item.task
            this.isdone = item.isdone
            return <li key={item.taskid}><input onBlur={e => this.handleOnblur(item)} autoFocus onChange={(e)=>this._inputElement = e.target.value} onKeyDown={e => this.handleKeyDown(e,item)} defaultValue={item.task} key={'input'+item.taskid}/>
            </li>
        }
    }

    render() {
        var todoEntries = this.props.entries;
        var listItems = todoEntries.map(this.createTasks);

        return (
            <ul className="theList" >
                <FlipMove duration={250} easing="ease-out">
                {listItems}
                </FlipMove>
            </ul>
        );
    }
};

export default TodoItems;