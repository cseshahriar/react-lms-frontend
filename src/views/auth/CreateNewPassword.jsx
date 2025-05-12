import { useState, useEffect } from 'react'
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import apiInstance from '../../utils/axios'

function CreateNewPassword() {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  const otp = searchParam.get("otp");
  const uuidb64 = searchParam.get("uuidb64");
  const refresh_token = searchParam.get("refresh_token");

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!password || !password2) {
      Swal.fire({
        title: "Password is required.",
        icon: "error",
        draggable: true
      });
      return
    }

    if(password !== password2) {
      Swal.fire({
        title: "Password does not match.",
        icon: "error",
        draggable: true
      });
      return
    }

    const formData = new FormData();
    formData.append('password', password);
    formData.append('otp', otp);
    formData.append('uuidb64', uuidb64);

    setIsLoading(true);
    try {
      console.log(password);
      await apiInstance.post('user/password-change/', formData)
      .then(res => {
        console.log('reset ', res.data)
        setIsLoading(false)
        Swal.fire({
          title: "Password Reset Email Sent Successful",
          icon: "success",
          draggable: true
        });
        navigate('/login');
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
                  <h1 className="mb-1 fw-bold">Create New Password</h1>
                  <span>
                    Choose a new password for your account
                  </span>
                </div>
                <form className="needs-validation" noValidate="" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Enter New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="password2"
                      className="form-control"
                      name="password2"
                      placeholder="**************"
                      required=""
                       onChange={(e) => setPassword2(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
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
                          Save New Password <i className='fas fa-check-circle'></i>
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

export default CreateNewPassword