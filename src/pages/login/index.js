import React, { Component } from 'react'
import MD5 from 'js-md5'
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Container, Row, Col } from 'reactstrap';


import { API_CODE} from '../../common/js/api'
import '../../common/css/Login.css';
import {login} from "../../common/js/actions";


const salt="xinoxinoxino"


class Login extends Component {

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

  // 密码加密
  encryptPassword() {
    return MD5(salt+MD5(this.state.password));
  }

  // 检查合法输入
  checkValidate() {
    return this.state.username.length > 0 &&
        this.state.password.length > 0;

  }

  inputBlur() {
    window.scrollTo(0, 0)
  }

  loginSubmit() {
    var that = this;
    if (this.state.username.length === 0) {
      alert('请输入账号')
      return false
    }
    if (this.state.password.length === 0) {
      alert('请输入密码');
      return false
    }
    const {username} = this.state
    const password = this.encryptPassword()
    this.setState({loading: true})
    let data = {
      username,
      password,
    }
    login(data,function (result) {
      console.log(result);
      that.setState({loading: false})
      if (result.code === API_CODE.OK) {
        window.localStorage.setItem('loginInfo', JSON.stringify({
          userid: result.data.userid,
          username: result.data.username,
          usertype: result.data.usertype,
          apikey: result.newapikey,
          logintime: result.data.logintime
        }))
        console.log(window.localStorage.getItem('loginInfo'))
        that.props.history.push('/')
      } else {
        alert(result.data);
      }
    })
  }

  ToSignup() {
    this.props.history.push('/regist')
  }


  render() {
    if(window.localStorage.getItem('loginInfo')){
      window.location.href='/'
      return null
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