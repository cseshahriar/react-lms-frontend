import { useEffect, useState} from 'react'
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import { Link, useNavigate } from 'react-router-dom'

import apiInstance from "../../utils/axios";
import { register } from "../../utils/auth";

import Swal from 'sweetalert2'

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async(event) => {
      event.preventDefault();
      setIsLoading(true);
      setErrors({}); // Clear previous errors

      const {error} = await register(fullName, email, password, password2);
      if(error) {
        setErrors(error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          draggable: true
        });
        navigate('/'); // home page
      }
  };

  return (
    <>
      <BaseHeader />

      <section className="container d-flex flex-column" style={{ marginTop: "120px", marginBottom: "120px" }}>
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign up</h1>
                  <span>
                    Already have an account?
                    <Link to="/login" className="ms-1">
                      Sign In
                    </Link>
                  </span>
                </div>
                {/* Form */}
                <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      className={`form-control ${errors && errors.full_name ? 'is-invalid' : ''}`}
                      name="full_name"
                      placeholder="Full Name"
                      required=""
                      onChange={(e) => setFullName(e.target.value)}
                    />
                       {errors && errors.full_name && (
                            <div className="invalid-feedback">
                                {errors.full_name[0]}
                            </div>
                        )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className={`form-control ${errors && errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      placeholder="E-mail"
                      required=""
                      onChange={(e) => setEmail(e.target.value)}
                    />
                      {errors && errors.email && (
                          <div className="invalid-feedback">
                              {errors.email[0]}
                          </div>
                      )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      className={`form-control ${errors && errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      placeholder=""
                      required=""
                      onChange={(e) => setPassword(e.target.value)}
                    />
                       {errors && errors.password && (
                          <div className="invalid-feedback">
                              {errors.password[0]}
                          </div>
                      )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="password2"
                      className={`form-control ${errors && errors.password ? 'is-invalid' : ''}`}
                      name="password2"
                      placeholder=""
                      required=""
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                    {errors && errors.password2 && (
                        <div className="invalid-feedback">
                            {errors.password2[0]}
                        </div>
                    )}
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
                            Sign Up <i className='fas fa-user-plus'></i>
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

export default Register