import {useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import Rater from 'react-rater';

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import Pagination from '../partials/Pagination'

import apiInstance from '../../utils/axios'
import { useAuthStore } from "../../store/auth";
import CartId from '../plugin/CartId';

import { CartContext } from '../plugin/Context'
import CategoryCarousel from './CategoryCarousel'

function Search() {
  const navigate = useNavigate();

    const allUserData = useAuthStore((state) => state.allUserData);
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [cartCount, setCartCount] = useContext(CartContext);
    const cartId = CartId();

    const fetchCourses = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await apiInstance.get(`course/course-list/?page=${page}`);
            setCourses(response.data.results);
            setTotalPages(response.data.total_pages);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.log('Error fetching courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        if(allUserData) {
            setUser(allUserData);
            console.log('user', allUserData);
        }
    }, [cartCount, allUserData])

    const handlePageChange = (page) => {
        fetchCourses(page);
    };


    const addToCart = async (courseId, price, userId, country_name, cartId) => {
        console.log('add to cart called with:', { courseId, userId, price, country_name, cartId });
        if(!user) {
            Swal.fire({
                    title: "Login first!",
                    icon: "error",
                    draggable: true
            });
            return;
        }
        const formData = new FormData();
        formData.append("course_id", courseId);
        formData.append("user_id", userId);
        formData.append("price", price);
        formData.append("country_name", country_name);
        formData.append("cart_id", cartId);

        // To verify FormData contents, you need to iterate through it
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            await apiInstance.post(`course/cart/`, formData);
            Swal.fire({
                    title: 'Add to cart successfully',
                    icon: "success",
                    draggable: true
            });

            // set cart count
            await apiInstance.get(`course/cart-list/${cartId}`)
            .then((response) => {
                setCartCount(response.data?.length);
            });
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error; // Re-throw the error so calling code can handle it
        }

        // set cart count
        await apiInstance.get(`course/cart-list/${cartId}`)
            .then((response) => {
                console.log('cart course after add cart : ', response.data.length);
                setCartCount(response.data?.length);
        })
    }

  const enrolment = (courseId, price, userId, country_name, cartId) => {
    addToCart(courseId, price, userId, country_name, cartId);
    navigate('/cart');
  }

  // search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if(query === "") {
      // no search full course list
      fetchCourses();
    } else {
      const filteredCourses = courses.filter((course) => {
        return course.title.toLowerCase().includes(query);
      })
      setCourses(filteredCourses);
    }
  }

  // pagination
  const itemsPerPage = 1
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(courses.length / itemsPerPage)
  const pageNumbers = Array.from(
    {length: totalPages},
    (_, index) => index + 1
  )


  return (
    <>
      <BaseHeader />

      <section className="mb-5" style={{ marginTop: "100px" }}>
        <div className="container mb-lg-8 ">
          <div className="row mb-5 mt-3">
            {/* col */}
            <div className="col-12">
              <div className="mb-6">
                <h2 className="mb-1 h1">
                  Showing Results for "{searchQuery || "No Search Query"}"
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <input
                  type="text"
                  className="form-control lg mt-3"
                  placeholder="Search Courses..."
                  name="search"
                  id="search"
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {currentItems.map((course, course_index) => (
                <div className="col" key={course_index}>
                      <div className="card card-hover">
                          <Link to={`/course-detail/${course.slug}/`}>
                              <img
                                  src={course.image}
                                  alt={course.title}
                                  className="card-img-top"
                                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                              />
                          </Link>
                          {/* Card Body */}
                          <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="badge bg-info">{course.level}</span>
                                  <a href="#" className="fs-5">
                                      <i className="fas fa-heart text-danger align-middle" />
                                  </a>
                              </div>
                              <h4 className="mb-2 text-truncate-line-2 ">
                                  <Link to={`/course-detail/${course.slug}/`} className="text-inherit text-decoration-none text-dark fs-5">
                                      {course.title}
                                  </Link>
                              </h4>
                              <small>By: {course.teacher?.full_name}</small> <br />
                              <small>{course.students?.length || 0} Students</small> <br />
                              <div className="lh-1 mt-3 d-flex">
                                  <span className="align-text-top">
                                      <span className="fs-6">
                                          {/* Dynamic Star Rating */}
                                          {(() => {
                                              const rating = parseFloat(course.average_rating) || 0;
                                              const fullStars = Math.floor(rating);
                                              const hasHalfStar = rating % 1 >= 0.5;

                                              return (
                                              <>
                                                  {[...Array(fullStars)].map((_, i) => (
                                                      <i key={`full-${i}`} className="fas fa-star text-warning" />
                                                  ))}

                                                  {hasHalfStar && <i key="half" className="fas fa-star-half-alt text-warning" />}

                                                  {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                                                      <i key={`empty-${i}`} className="far fa-star text-warning" />
                                                  ))}
                                              </>
                                              );
                                          })()}
                                      </span>
                                  </span>
                                  <span className="text-warning">{course.average_rating}</span>
                                  <span className="fs-6 ms-2">({course.rating_count || 0})</span>
                              </div>
                          </div>
                          {/* Card Footer */}
                          <div className="card-footer">
                              <div className="row align-items-center g-0">
                                  <div className="col">
                                      <h5 className="mb-0">৳{course.price}</h5>
                                  </div>
                                  <div className="col-auto">
                                      <button
                                          type='button' className="btn-sm text-inherit text-decoration-none btn btn-primary me-2"
                                          onClick={
                                              () => addToCart(
                                                  course.id,
                                                  course.price,
                                                  user?.user_id || null,
                                                  user?.country || null,
                                                  CartId()
                                              )
                                          }
                                      >
                                          <i className="fas fa-shopping-cart text-primary text-white" />
                                      </button>

                                      <button
                                          onClick={
                                              () => enrolment(
                                                  course.id,
                                                  course.price,
                                                  user?.user_id || null,
                                                  user?.country || null,
                                                  CartId()
                                              )
                                          }
                                          type='button'  className="btn-sm text-inherit text-decoration-none btn btn-primary">
                                          Enroll Now <i className="fas fa-arrow-right text-primary align-middle me-2 text-white" />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                ))}
              </div>

              {/** pagination */}
              <nav className="d-flex mt-5">
                <ul className="pagination">
                      <li className="page-item">
                        <p className="me-3" disabled style={{border: '0 !important', padding: '5px', fontWeight: "700"}}>
                          {courses.length || 0} Courses
                        </p>
                      </li>
                </ul>

                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                      <i className="ci-arrow-left me-2" />
                      Previous
                    </button>
                  </li>
                </ul>

                <ul className="pagination">
                  {
                    pageNumbers.map((number) => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''} `}>
                        <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                      </li>
                    ))
                  }
                </ul>

                <ul className="pagination">
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                      Next
                      <i className="ci-arrow-right ms-3" />
                    </button>
                  </li>
                </ul>
              </nav>


            </div>
          </div>
        </div>
      </section>

      <section className="my-8 py-lg-8">
        {/* container */}
        <div className="container">
          {/* row */}
          <div className="row align-items-center bg-primary gx-0 rounded-3 mt-5">
            {/* col */}
            <div className="col-lg-6 col-12 d-none d-lg-block">
              <div className="d-flex justify-content-center pt-4">
                {/* img */}
                <div className="position-relative">
                  <img
                    src="https://geeksui.codescandy.com/geeks/assets/images/png/cta-instructor-1.png"
                    alt="image"
                    className="img-fluid mt-n8"
                  />
                  <div className="ms-n8 position-absolute bottom-0 start-0 mb-6">
                    <img
                      src="https://geeksui.codescandy.com/geeks/assets/images/svg/dollor.svg"
                      alt="dollor"
                    />
                  </div>
                  {/* img */}
                  <div className="me-n4 position-absolute top-0 end-0">
                    <img
                      src="https://geeksui.codescandy.com/geeks/assets/images/svg/graph.svg"
                      alt="graph"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-12">
              <div className="text-white p-5 p-lg-0">
                {/* text */}
                <h2 className="h1 text-white">Become an instructor today</h2>
                <p className="mb-0">
                  Instructors from around the world teach millions of students
                  on Geeks. We provide the tools and skills to teach what you
                  love.
                </p>
                <a href="#" className="btn bg-white text-dark fw-bold mt-4">
                  Start Teaching Today <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BaseFooter />
    </>
  );
}

export default Search;
