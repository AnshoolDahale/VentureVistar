import React, {useCallback, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {Api} from '../../utils/Api'
import {setToken} from '../../utils/localstorage'
import './signIn.css'
function Index() {
  const {replace, push} = useHistory()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)

  const _handleSubmit = useCallback(async () => {
    // callback
    if (email.length > 2 && password.length > 2) {
      setLoading(true)
      const {statusCode, data} = await Api.postRequest('/api/user/signin', {
        email,

        password,
      })
      setLoading(false)
      if (statusCode === 400 || statusCode === 500 || statusCode === 403) {
        setLoading(false)
        alert(data)
        return
      }
      const {token} = JSON.parse(data)
      setToken(token)
      replace('/')
    }
  }, [email, password, replace])

  if (loading) return <h1>Loading.....</h1>
  return (
    <div className="signinscreen">
      <div className="container">
        <div className="innerContainer">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              // backgroundColor: 'red',
            }}
          >
            <div style={{cursor: 'pointer'}} onClick={() => push('/')}>
              <i class="fas fa-arrow-circle-left fa-5x"></i>
            </div>
            <p>Sign In</p>
          </div>

          <form autoComplete="on" onSubmit={(e) => { e.preventDefault(); _handleSubmit(); }}>
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email.."
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Your Password.."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Link to="/signup" className="link">
              <span>Creat a new account ?</span>
            </Link>
            <br />

            <input type="submit" value="Sign in" />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Index
