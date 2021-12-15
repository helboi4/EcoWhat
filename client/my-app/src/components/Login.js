import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    useEffect(() => {
        setEmail("")
        setPassword("")
    }, [])

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        if (error) {
            setError(null)
        }
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        if (error) {
            setError(null)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch(`http://localhost:8080/api/users/login?email=${email}&&password=${password}`,
            {
                method: 'POST'   
            }
        )
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {throw new Error(err.message)})
            }
            return response.json()    
        })
        .then(data => onLogin(data))
        .catch(err => {
            setError(err)
        })
    }

    return (
        <section className="login">
            <main className="login-main">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-header">Login</h1>

                    <label forhtml="user-email">Email</label>
                    <input type="text" id="user-email" value={email} required onChange={handleEmailChange}/>

                    <label forhtml="user-password">Password</label>
                    <input type="password" id="user-password" value={password} required onChange={handlePasswordChange}/>

                    <input className="login-btn" type="submit" value="Login"/>
                    
                    <div className="login-register">
                        <p>Need an account?</p>
                        <Link to="/registration">Sign Up</Link>
                    </div>

                    {(() => {
                        if (error) {
                            return (
                                <p>{error.message}</p>
                            )
                        }
                    })()}
                    
                </form>
            </main>  
        </section>
    )
}

export default Login