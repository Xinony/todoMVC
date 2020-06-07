import React, { Component } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Container, Row, Col } from 'reactstrap';


import {API_CODE, encryptPassword, REGIST_URL, TODOLIST_URL} from '../../common/js/api'
import '../../common/css/Login.css';
import {login,logout} from "../../common/js/actions";





class Login extends Component {

  state = {
    username: '',
    password: '',
    loading: false
  }

  //获取用户名
  handleAccountChange(event) {
    this.setState({username: event.target.value});
  }

  //获取密码
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  //提交登录
  loginSubmit() {
    var that = this;
    //验证用户名
    if (this.state.username.length === 0) {
      alert('请输入用户名')
      return false
    }
    //验证密码
    if (this.state.password.length === 0) {
      alert('请输入密码');
      return false
    }

    const username = this.state.username
    //密码加密
    const password = encryptPassword(this.state.password)
    this.setState({loading: true})
    let data = {
      username,
      password,
    }
    //提交数据给后台服务器
    login(data,function (result) {
      that.setState({loading: false})
      //登录成功
      if (result.code === API_CODE.OK) {
        window.localStorage.setItem('loginInfo', JSON.stringify({
          userid: result.data.userid,
          username: result.data.username,
          usertype: result.data.usertype,
          apikey: result.newapikey,
          logintime: result.data.logintime
        }))
        window.location.href=TODOLIST_URL
      } else {
        alert(result.message);//登录失败
      }
    })
  }

  //到注册页面
  ToSignup() {
    window.location.href=REGIST_URL;
  }


  render() {
    //获取用户上次获取的apikey并初步检测是否过期
    if(window.localStorage.getItem('loginInfo'))
    {
      var pre_load_time=window.localStorage.getItem('loginInfo').apikey
      if(Date.now()-pre_load_time>60*1000*1000){
        logout()
      }
      else{
        window.location.href='/#/todolist'
        return null
      }
    }
    else{
    return (
        <Container className="login-body">
          <Row>
            <Col md={{ size: 4, offset: 4 }}>
              <div className="login-title">
                Sign in to TodoList
              </div>
            </Col>
          </Row>
          <Row>
          <Col md={{size: 4, offset: 4}}>
            <div className="login-content">
              <TextField label="User Name" Value={this.state.username} errorMessage={this.state.errorMsg}
                         onChange={this.handleAccountChange.bind(this)}/>
              <TextField label="Password" value={this.state.password} type="Password" onChange={this.handlePasswordChange.bind(this)}/>
              <DefaultButton className="login-button" text="Login" onClick={this.loginSubmit.bind(this)}/>
              <DefaultButton className="login-button" text="Sign up" onClick={this.ToSignup.bind(this)}/>
            </div>
          </Col>
          </Row>
        </Container>
    );
  }
  }
}

export default Login