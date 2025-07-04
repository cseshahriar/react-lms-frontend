import {useEffect} from 'react'
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import { logout } from '../../utils/auth';
import { Link } from 'react-router-dom'

import Swal from 'sweetalert2'

function Logout() {

  useEffect(() => {
    logout();
    // navigate('/login'); // home page
  }, [])

  console.log('logout component called');
  return (
    <>
      <BaseHeader />

      <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-6 col-md-8 py-8 py-xl-0">
            <div className="card shadow py-5">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h2 className="mb-1 fw-bold">You have been logged out</h2>
                  <span>
                    Thanks for visiting our website, come back anytime!
                  </span>
                </div>
                <form className="needs-validation mt-5" noValidate="">
                  <div className="d-grid d-flex">
                    <Link to="/login" className="btn btn-primary me-2 w-100">
                      Login <i className='fas fa-sign-in-alt'></i>
                    </Link>
                    <Link to="/register" className="btn btn-primary w-100">
                      Register <i className='fas fa-user-plus'></i>
                    </Link>
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

export default Logout