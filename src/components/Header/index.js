import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const deleteToken = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div>
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
      </li>
      <li>
        <Link to="/">
          <button type="button">Home</button>
        </Link>
      </li>
      <li>
        <Link to="/jobs">
          <button type="button">Jobs</button>
        </Link>
      </li>
      <li>
        <button type="button" onClick={deleteToken}>
          Logout
        </button>
      </li>
    </div>
  )
}
export default withRouter(Header)
