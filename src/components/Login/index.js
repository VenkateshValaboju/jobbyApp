import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    error: false,
    errorMsg: '',
  }

  onSumitForm = event => {
    event.preventDefault()
    this.getTheToken()
  }

  changeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  changePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  getTheToken = async () => {
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const url = 'https://apis.ccbp.in/login'

    const response = await fetch(url, options)

    if (response.ok) {
      const {history} = this.props
      const body = await response.json()
      const token = body.jwt_token
      Cookies.set('jwt_token', token, {expires: 30})
      console.log(body)
      history.replace('/')
    } else {
      const body = await response.json()
      this.setState({
        errorMsg: body.error_msg,
        error: true,
      })
    }
  }

  render() {
    const {errorMsg, error} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      console.log('VKHV')
      return <Redirect to="/" />
    }

    return (
      <div className="bg">
        <div className="loginForm">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form onSubmit={this.onSumitForm}>
            <label htmlFor="usernameInput">USERNAME</label>
            <br />
            <input
              type="text"
              id="usernameInput"
              onChange={this.changeUsername}
            />
            <br />
            <label htmlFor="passwordInput">PASSWORD</label>
            <br />
            <input
              type="password"
              id="passwordInput"
              onChange={this.changePassword}
            />
            <br />
            <button type="submit">Login</button>
          </form>
          {error && <p>{`*${errorMsg}`}</p>}
        </div>
      </div>
    )
  }
}

export default Login
