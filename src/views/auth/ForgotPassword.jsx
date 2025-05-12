import { useState, useEffect } from 'react'
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import apiInstance from '../../utils/axios'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(email);
      await apiInstance.get(`user/password-reset/${email}/`).then(res => {
        console.log(res.data)
        setIsLoading(false)
        Swal.fire({
          title: "Password Reset Email Sent Successful",
          icon: "success",
          draggable: true
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <BaseHeader />

      <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Forgot Password</h1>
                  <span>
                    Let's help you get back into your account
                  </span>
                </div>
                <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required=""
                      className="form-control"
                      placeholder="johndoe@gmail.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
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
                            Reset Password <i className='fas fa-arrow-right'></i>
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

export default ForgotPassword