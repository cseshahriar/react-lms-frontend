import { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import { login } from "../../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});  // Clear previous errors

    const { error } = await login(email, password);
    if (error) {
        setErrors(error);  // Set new errors
    } else {
      setIsLoading(false);
      Swal.fire({
        title: "Registration Successful",
        icon: "success",
        draggable: true
      });
      navigate("/");  // Redirect on success
    }
    setIsLoading(false);
  };


  return (
    <>
      <BaseHeader />

      <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign in</h1>
                  <span>
                    Don’t have an account?
                    <Link to="/register" className="ms-1">
                      Sign up
                    </Link>
                  </span>
                </div>
                {/* Form */}
                <form className="needs-validation" noValidate=""  onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
                      name="email"
                      placeholder="johndoe@gmail.com"
                      required=""
                      onChange={(e) => setEmail(e.target.value)}
                    />
                       {errors?.email && (
                          <div className="invalid-feedback">
                              {errors.email[0]}  // e.g., "Enter a valid email address."
                          </div>
                      )}
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
                      name="password"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setPassword(e.target.value)}
                    />
                      {errors?.password && (
                          <div className="invalid-feedback">
                              {errors.password[0]}  // e.g., "Password must be 8+ characters."
                          </div>
                      )}

                      {errors?.nonFieldErrors && (
                          <div className="alert alert-danger mt-3">
                              {errors.nonFieldErrors[0]}  // e.g., "Account is disabled."
                          </div>
                      )}

                      {errors?.detail && (
                          <div className="alert alert-danger mt-3">
                              {errors.detail[0]}  // e.g., "No active account found."
                          </div>
                      )}
                  </div>
                  {/* Checkbox */}
                  <div className="d-lg-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberme"
                        required=""
                      />
                      <label className="form-check-label" htmlFor="rememberme">
                        Remember me
                      </label>
                      <div className="invalid-feedback">
                        You must agree before submitting.
                      </div>
                    </div>
                    <div>
                      <Link to="/forgot-password">Forgot your password?</Link>
                    </div>
                  </div>
                  <div>
                    <div className="d-grid">
                      {
                        isLoading === true && (
                          <button type="submit" className="btn btn-primary" disabled>
                            Processing <i className='fas fa-spinner fa-spin'></i>
                          </button>
                        )
                      }

                      {
                        isLoading === false && (
                          <button type="submit" className="btn btn-primary">
                            Sign in <i className='fas fa-sign-in-alt'></i>
                          </button>
                        )
                      }

                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      <BaseFooter />
    </>
  )
}

export default Login