import {useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import Pagination from '../partials/Pagination'

import { useAuthStore } from "../../store/auth";
import Rating from '../partials/Rating'
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

import useAxios from "../../utils/useAxios";
import CartId from "../plugin/CartId";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";
import { CartContext } from "../plugin/Context";

import apiInstance from "../../utils/axios";

function Index() {
    const navigate = useNavigate();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [ratings, setRatings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All"); // default : Featured

    const allUserData = useAuthStore((state) => state.allUserData);
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const [cartCount, setCartCount] = useContext(CartContext);
    const cartId = CartId();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // fetch courses
    const fetchCourses = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await apiInstance.get(`course/course-list/?page=${page}`);
            setCourses(response.data.results);
            setTotalPages(response.data.total_pages);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.log('Error fetching courses:', error);
            Swal.fire({
                title: "Error loading courses",
                text: "Please try again later",
                icon: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // fetch ratings
    const fetchRatings = async () => {
        try {
            await apiInstance.get(`course/reviews`).then((response) => {
                setRatings(response.data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    // fetch categories
    const fetchCategories = async () => {
        try {
            await apiInstance.get(`course/category/`).then((response) => {
                setCategories(response.data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // setActiveCategory("All");
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                await fetchCourses();
                await fetchRatings();
                await fetchCategories();

                if (allUserData) {
                    setUser(allUserData);
                }
            } catch(error) {
                console.log(error);
            }
        };

        fetchInitialData();
    }, []); // Empty dependency array for initial load only

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

    // categories
    const handleCategory = async (title) => {
        console.log('handleCategory 1', 'title', title, 'state', activeCategory);
        setActiveCategory(title);
        console.log('handleCategory 2', 'title', title, 'state', activeCategory);
        try {
            setIsLoading(true);
            const response = await apiInstance.get(`course/course-list/?page=${1}&category_title=${title}`);
            setCourses(response.data.results);
            setTotalPages(response.data.total_pages);
            setCurrentPage(response.data.current_page);
        } catch (error) {
            console.log('Error fetching courses:', error);
            Swal.fire({
                title: "Error loading courses",
                text: "Please try again later",
                icon: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const itemsPerSlide = 3;
    const chunkedCategories = [];
    for (let i = 0; i < categories.length; i += itemsPerSlide) {
        chunkedCategories.push(categories.slice(i, i + itemsPerSlide));
    }
    // Only show arrows if there are multiple slides
    const shouldShowArrows = chunkedCategories.length > 1;

    const addToWishlist = (courseId) => {
        const formdata = new FormData();
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("course_id", courseId);

        apiInstance.post(`student/wishlist/${UserData()?.user_id}/`, formdata).then((res) => {
            console.log(res.data);
            Toast().fire({
                icon: "success",
                title: res.data.message,
            });
        });
    };


    return (
        <>
            <BaseHeader />
            {/** hero section */}
            <section className="py-lg-8 py-5 shadow-sm">
                {/* container */}
                <div className="container my-lg-8">
                    {/* row */}
                    <div className="row align-items-center">
                        {/* col */}
                        <div className="col-lg-6 mb-6 mb-lg-0">
                            <div>
                                {/* heading */}
                                <h5 className="text-dark mb-4">
                                    <i className="fe fe-check icon-xxs icon-shape bg-light-success text-success rounded-circle me-2" />
                                    Most trusted education platform
                                </h5>
                                {/* heading */}
                                <h1 className="display-4 fw-bold mb-3">
                                    Grow your skills and advance career
                                </h1>
                                {/* para */}
                                <p className="pe-lg-10 mb-5">
                                    Start, switch, or advance your career with more than 5,000
                                    courses, Professional Certificates, and degrees from world-class
                                    universities and companies.
                                </p>
                                {/* btn */}
                                <a href="#" className="btn btn-primary fs-4 text-inherit ms-3">
                                    Join Free Now <i className='fas fa-plus'></i>
                                </a>
                                <a
                                    href="https://www.youtube.com/watch?v=Nfzi7034Kbg"
                                    className="btn btn-outline-success fs-4 text-inherit ms-3"
                                >

                                    Watch Demo <i className='fas fa-video'></i>
                                </a>
                            </div>
                        </div>
                        {/* col */}
                        <div className="col-lg-6 d-flex justify-content-center">
                            {/* images */}
                            <div className="position-relative">
                                <img
                                    src="https://geeksui.codescandy.com/geeks/assets/images/landing-immigration/front-view-young-man-going-university-with-bag.png"
                                    alt="girl"
                                    className="end-0 bottom-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/** counter */}
            <section className="pb-8 shadow-sm">
                <div className="container mb-lg-8">
                    {/* row */}
                    <div className="row mb-5">
                        <div className="col-md-6 col-lg-3 border-top-md border-top pb-4  border-end-md">
                            {/* text */}
                            <div className="py-7 text-center">
                                <div className="mb-3">
                                    <i className="fe fe-award fs-2 text-info" />
                                </div>
                                <div className="lh-1">
                                    <h2 className="mb-1">316,000+</h2>
                                    <span>Qualified Instructor</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 border-top-md border-top border-end-lg">
                            {/* icon */}
                            <div className="py-7 text-center">
                                <div className="mb-3">
                                    <i className="fe fe-users fs-2 text-warning" />
                                </div>
                                {/* text */}
                                <div className="lh-1">
                                    <h2 className="mb-1">1.8 Billion+</h2>
                                    <span>Course enrolment</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 border-top-lg border-top border-end-md">
                            {/* icon */}
                            <div className="py-7 text-center">
                                <div className="mb-3">
                                    <i className="fe fe-tv fs-2 text-primary" />
                                </div>
                                {/* text */}
                                <div className="lh-1">
                                    <h2 className="mb-1">41,000+</h2>
                                    <span>Courses in 42 languages</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 border-top-lg border-top">
                            {/* icon */}
                            <div className="py-7 text-center">
                                <div className="mb-3">
                                    <i className="fe fe-film fs-2 text-success" />
                                </div>
                                {/* text */}
                                <div className="lh-1">
                                    <h2 className="mb-1">179,000+</h2>
                                    <span>Online Videos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/** course */}
            <section className='mb-5'>
                <div className="container mb-lg-8 ">

                    <div className="row mb-3 mt-3">
                        {/* col */}
                        <div className="col-12">
                            <div className="mb-6">
                                <h2 className="mb-1 h1">Upcoming Live Courses</h2>
                                <p>
                                    These are the most demandable upcoming courses among geeks courses learners
                                    worldwide in year 2025
                                </p>
                            </div>
                        </div>
                    </div>

                    {/** Category slider */}
                    <div className="row py-3 mb-5">
                        <div className="col-md-12">
                            <div
                                id="category-carousel"
                                className="carousel slide section-bg"
                                data-bs-ride="false"
                                data-bs-interval="false"
                                style={{ background: "#e5e7eb", padding: "15px", borderRadius: "5px" }}
                                >
                                <div className="carousel-inner text-center">
                                    {chunkedCategories.map((group, index) => (
                                    <div
                                        key={index}
                                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                                    >
                                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                                        <button
                                            type="button"
                                            className={`btn btn-lg px-5 ${
                                                activeCategory === "All" ? "btn-dark" : "btn-light"
                                            }`}
                                            onClick={() => handleCategory("All")}
                                        >
                                            All
                                        </button>
                                        {group.map((category, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className={`btn btn-lg px-5 ${
                                                    activeCategory === category.title ? "btn-dark" : "btn-light"
                                                }`}
                                                onClick={() => handleCategory(category.title)}
                                                data-title={category.title}
                                            >
                                                {category.title}
                                            </button>
                                        ))}
                                        </div>
                                    </div>
                                    ))}
                                </div>

                                {/* Conditionally render arrows */}
                                {shouldShowArrows && (
                                    <>
                                    <button
                                        className="carousel-control-prev"
                                        type="button"
                                        data-bs-target="#category-carousel"
                                        data-bs-slide="prev"
                                    >
                                        <span
                                        className="carousel-control-prev-icon"
                                        style={{ filter: "invert(100%) brightness(0)" }}
                                        ></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button
                                        className="carousel-control-next"
                                        type="button"
                                        data-bs-target="#category-carousel"
                                        data-bs-slide="next"
                                    >
                                        <span
                                        className="carousel-control-next-icon"
                                        style={{ filter: "invert(100%) brightness(0)" }}
                                        ></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                    </>
                                )}
                                </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                {
                                    isLoading === true ?
                                    <p className='text-center py-3' style={{fontSize: '50px'}}>Loading <i className='fas fa-spinner fa-spin'></i></p>
                                    :
                                     <>
                                         {courses.map((course, course_index) => (
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
                                                             <div>
                                                                <span className="badge bg-info">{course.level}</span>
                                                                <span className="badge bg-success ms-2">{course.language}</span>
                                                             </div>
                                                             {/** make read hert if whishlist exist elese dart */}
                                                            <a onClick={() => addToWishlist(course.id)} className="fs-5">
                                                                 <i className="fas fa-heart text-danger align-middle" />
                                                            </a>
                                                         </div>

                                                         <h4 className="mb-2 text-truncate-line-2 ">
                                                             <Link to={`/course-detail/${course.slug}/`} className="text-inherit text-decoration-none text-dark fs-5">
                                                                 {course.title}
                                                             </Link>
                                                         </h4>
                                                         <small>By: {course.teacher?.full_name}</small> <br />
                                                          <small>
                                                            {course.students?.length} Student
                                                            {course.students?.length > 1 && "s"}
                                                        </small>{" "}

                                                         <div className="lh-1 mt-3 d-flex">
                                                             <span className="align-text-top">
                                                                <Rater total={5} rating={course.average_rating || 0} />
                                                             </span>
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
                                        {/** pagination */}
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                        {courses?.length == 0 && <p>No course found!</p>}
                                        </>
                                }
                            </div>
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
                                        <img src="https://geeksui.codescandy.com/geeks/assets/images/svg/dollor.svg" alt="dollor" />
                                    </div>
                                    {/* img */}
                                    <div className="me-n4 position-absolute top-0 end-0">
                                        <img src="https://geeksui.codescandy.com/geeks/assets/images/svg/graph.svg" alt="graph" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-12">
                            <div className="text-white p-5 p-lg-0">
                                {/* text */}
                                <h2 className="h1 text-white">Become an instructor today</h2>
                                <p className="mb-0">
                                    Instructors from around the world teach millions of students on
                                    Geeks. We provide the tools and skills to teach what you love.
                                </p>
                                <a href="#" className="btn bg-white text-dark fw-bold mt-4">
                                    Start Teaching Today <i className='fas fa-arrow-right'></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-200 pt-8 pb-8 mt-5">
                <div className="container pb-8">
                    {/* row */}
                    <div className="row mb-lg-8 mb-5">
                        <div className="offset-lg-1 col-lg-10 col-12">
                            <div className="row align-items-center">

                                {/* col */}
                                <div className="col-lg-6 col-md-8">
                                    {/* rating */}
                                    <div>
                                        <div className="mb-3">
                                            <span className="lh-1">
                                                <Rating total={5} rating={4.5} />
                                                <span className="text-dark fw-semibold">4.5/5.0</span>
                                            </span>
                                            <span className="ms-2">(Based on 3265 ratings)</span>
                                        </div>
                                        {/* heading */}
                                        <h2 className="h1">What our students say</h2>
                                        <p className="mb-0">
                                            Hear from
                                            <span className="text-dark">teachers</span>,
                                            <span className="text-dark">trainers</span>, and
                                            <span className="text-dark">leaders</span>
                                            in the learning space about how Geeks empowers them to provide
                                            quality online learning experiences.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-4 text-md-end mt-4 mt-md-0">
                                    {/* btn */}
                                    <a href="#" className="btn btn-primary">
                                        View Reviews
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* review */}
                    <div className="row">
                        {/* col */}
                        <div className="col-md-12">
                            <div className="position-relative">
                                {/* controls */}
                                {/* slider */}
                                <div className="sliderTestimonial">
                                    {/* item */}
                                    <div className="row">
                                        { ratings?.map((rating, index) => (
                                            <div className="col-lg-4" key={index}>
                                                <div className="item">
                                                    <div className="card">
                                                        <div className="card-body text-center p-6">
                                                            {/* img */}
                                                            <img
                                                                src={rating.profile?.image}
                                                                alt="avatar"
                                                                className="avatar avatar-lg rounded-circle"
                                                                style={{width:"80px"}}
                                                            />
                                                            <p className="mb-0 mt-3">
                                                                “{rating.review}”
                                                            </p>
                                                            {/* rating */}
                                                            <div className="lh-1 mb-3 mt-4">
                                                                <span className="fs-6 align-top">
                                                                   <Rating total={5} rating={rating.rating} />
                                                                </span>
                                                                {/* text */}
                                                            </div>
                                                            <span>{rating?.profile?.about}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    )
}

export default Index
