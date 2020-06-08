import React, { Component } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Container, Row, Col } from 'reactstrap';


import {API_CODE, API_LIST, encryptPassword, TODOLIST_URL} from '../../common/js/api'
import {apiRequest} from "../../common/js/actions";
import '../../common/css/Login.css';




class regist extends Component {

    state = {
        username: '',
        password: '',
        loading: false
    }


    handleAccountChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    //提交注册
    registSubmit() {
        var that = this;
        if (this.state.username.length === 0) {
            alert('请输入账号');
            return false
        }
        if (this.state.password.length === 0) {
            alert('请输入密码');
            return false
        }
        const username = this.state.username
        const password = encryptPassword(this.state.password)
        this.setState({loading: true})
        let data = {
            username,
            password,
        }
        apiRequest(API_LIST.USER_SIGNUP, data,function (result) {
            that.setState({loading: false})
            if (result.code === API_CODE.OK) {
                window.localStorage.setItem('loginInfo', JSON.stringify({
                    userid: result.userInfo.userid,
                    username: result.userInfo.username,
                    usertype: result.userInfo.usertype,
                    apikey: result.userInfo.apikey,
                    logintime: result.userInfo.logintime
                }))
                window.location.href=TODOLIST_URL
            } else {
                alert(result.message);
            }
        })
    }

    render() {

        return (

            <Container className="login-body">
                <Row>
                    <Col md={{ size: 4, offset: 4 }}>
                        <div className="login-title">
                            Regist to TodoList
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={{size: 4, offset: 4}}>
                        <div className="login-content">
                            <TextField label="User Name" Value={this.state.username} errorMessage={this.state.errorMsg}
                                       onChange={this.handleAccountChange.bind(this)}/>
                            <TextField label="Password" value={this.state.password} type="Password" onChange={this.handlePasswordChange.bind(this)}/>
                            <DefaultButton className="login-button" text="Regist" onClick={this.registSubmit.bind(this)}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default regist
