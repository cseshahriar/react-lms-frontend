import { useState, useEffect, useContext } from 'react'
import moment from 'moment'

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'

import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

import { Link, useParams, useNavigate } from 'react-router-dom'
import CartId from '../plugin/CartId';
import UserData from '../plugin/UserData'
import Toast from '../plugin/Toast'

import { CartContext } from '../plugin/Context'
import apiInstance from '../../utils/axios'

import Rating from '../partials/Rating'
import { BASE_URL } from '../../utils/constants'

function CourseDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const slug = params.slug;
    const [addToCartBtn, setAddToCartBtn] = useState("Add To Cart");
    const [course, setCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const cartId = CartId();

    const [cartCount, setCartCount] = useContext(CartContext);

    const fetchCourse = () => {
        apiInstance.get(`course/course-detail/${slug}/`).then(res => {
            setCourse(res.data);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        fetchCourse();
        if(!user) {
           const current_user = UserData();
           if(current_user) {
            setUser(current_user);
           }
        }
    }, [cartCount])

    const addToCart = async (courseId, price, userId, country_name, cartId) => {
        console.log('add to cart called with:', { courseId, userId, price, country_name, cartId });
        setAddToCartBtn("Adding To Cart");
        if(!user) {
            Toast().fire({
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
            const response = await apiInstance.post(`course/cart/`, formData);
            Toast().fire({
                    title: response.data.message,
                    icon: "success",
                    draggable: true
            });
            setAddToCartBtn("Added To Cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            setAddToCartBtn("Add To Cart");
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

            {
                isLoading === true ?
                <p className='text-center py-3'>Loading <i className='fas fa-spinner fa-spin'></i></p>
                :
                <>
                    <section className="bg-light py-0 py-sm-5">
                        <div className="container">
                            <div className="row py-5">
                                <div className="col-lg-8">
                                    {/* Badge */}
                                    <h6 className="mb-3 font-base bg-primary text-white py-2 px-4 rounded-2 d-inline-block">
                                        {course.category.title }
                                    </h6>
                                    {/* Title */}
                                    <h1 className='mb-3'>{course.title}</h1>
                                    <p className='mb-3' dangerouslySetInnerHTML={{__html:`${course?.description?.slice(0, 250)}`}}></p>
                                    {/* Content */}
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                            <span className="align-text-top">
                                            <Rating total={5} rating={course.average_rating} />
                                            </span>
                                            <span className="fs-6 ms-2">({course.rating_count || 0})</span>

                                        </li>
                                        <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                            <i className="fas fa-user-graduate text-orange me-2" />
                                            {course.students?.length || 0} Enrolled
                                        </li>
                                        <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                            <i className="fas fa-signal text-success me-2" />
                                            {course.level}
                                        </li>
                                        <li className="list-inline-item h6 me-3 mb-1 mb-sm-0">
                                            <i className="bi bi-patch-exclamation-fill text-danger me-2" />
                                            Date Published {moment(course.date).format("DD MMM, YYYY")}
                                        </li>
                                        <li className="list-inline-item h6 mb-0">
                                            <i className="fas fa-globe text-info me-2" />
                                            {course.language}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/** tabs */}

                    <section className="pb-0 py-lg-5">
                        <div className="container">
                            <div className="row">
                                {/* Main content START */}
                                <div className="col-lg-8">
                                    <div className="card shadow rounded-2 p-0">
                                        {/* Tabs START */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <ul
                                                className="nav nav-pills nav-tabs-line py-0"
                                                id="course-pills-tab"
                                                role="tablist"
                                            >
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0 active" id="course-pills-tab-1" data-bs-toggle="pill" data-bs-target="#course-pills-1" type="button" role="tab" aria-controls="course-pills-1" aria-selected="true">
                                                        Overview
                                                    </button>
                                                </li>
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0" id="course-pills-tab-2" data-bs-toggle="pill" data-bs-target="#course-pills-2" type="button" role="tab" aria-controls="course-pills-2" aria-selected="false">
                                                        Curriculum
                                                    </button>
                                                </li>
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0" id="course-pills-tab-3" data-bs-toggle="pill" data-bs-target="#course-pills-3" type="button" role="tab" aria-controls="course-pills-3" aria-selected="false">
                                                        Instructor
                                                    </button>
                                                </li>
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0" id="course-pills-tab-4" data-bs-toggle="pill" data-bs-target="#course-pills-4" type="button" role="tab" aria-controls="course-pills-4" aria-selected="false">
                                                        Reviews
                                                    </button>
                                                </li>
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4 d-none" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0" id="course-pills-tab-5" data-bs-toggle="pill" data-bs-target="#course-pills-5" type="button" role="tab" aria-controls="course-pills-5" aria-selected="false">
                                                        FAQs
                                                    </button>
                                                </li>
                                                {/* Tab item */}
                                                <li className="nav-item me-2 me-sm-4 d-none" role="presentation">
                                                    <button className="nav-link mb-2 mb-md-0" id="course-pills-tab-6" data-bs-toggle="pill" data-bs-target="#course-pills-6" type="button" role="tab" aria-controls="course-pills-6" aria-selected="false">
                                                        Comment
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* Tabs END */}

                                        {/* Tab contents START */}
                                        <div className="card-body p-4">
                                            <div className="tab-content pt-2" id="course-pills-tabContent">
                                                {/* Content START */}
                                                <div className="tab-pane fade show active" id="course-pills-1" role="tabpanel" aria-labelledby="course-pills-tab-1" >
                                                    <h5 className="mb-3">Course Description</h5>
                                                    <p className="mb-3"  dangerouslySetInnerHTML={{__html:`${course?.description}`}}></p>
                                                    {/* Course detail END */}
                                                </div>
                                                {/* Content END */}

                                                {/* Content START */}
                                                <div
                                                    className="tab-pane fade"
                                                    id="course-pills-2"
                                                    role="tabpanel"
                                                    aria-labelledby="course-pills-tab-2"
                                                >
                                                    {/* Course accordion START */}
                                                    <div
                                                        className="accordion accordion-icon accordion-bg-light"
                                                        id="accordionExample2"
                                                    >
                                                        {
                                                            course?.curriculum?.map((module, index) => (
                                                                <div className="accordion-item mb-3" key={index}>
                                                                    <h6 className="accordion-header font-base" id="heading-1">
                                                                        <button
                                                                            className="accordion-button fw-bold rounded d-sm-flex d-inline-block collapsed"
                                                                            type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#collapse-${module.variant_id}`}
                                                                            aria-expanded="true"
                                                                            aria-controls={`collapse-${module.variant_id}`}
                                                                        >
                                                                            {module.title}
                                                                            <span className="small ms-0 ms-sm-2">
                                                                                ({module.variant_items?.length} Lectures)
                                                                            </span>
                                                                        </button>
                                                                    </h6>
                                                                    <div
                                                                        id={`collapse-${module.variant_id}`}
                                                                        className="accordion-collapse collapse show"
                                                                        aria-labelledby="heading-1"
                                                                        data-bs-parent="#accordionExample2"
                                                                    >
                                                                        <div className="accordion-body mt-3">
                                                                            {
                                                                                module.variant_items?.map((lecture) => (
                                                                                    <div key={lecture.id}>
                                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                                            <div className="position-relative d-flex align-items-center">
                                                                                                <a
                                                                                                    href={ lecture.preview === true ? lecture.file : '#'}
                                                                                                    className="btn btn-danger-soft btn-round btn-sm mb-0 stretched-link position-static"
                                                                                                >
                                                                                                     {
                                                                                                        lecture.preview === true ?
                                                                                                        <i className="fas fa-play me-0" />
                                                                                                        :
                                                                                                        <i className="fas fa-lock me-0" />
                                                                                                     }
                                                                                                </a>
                                                                                                <span className="d-inline-block text-truncate ms-2 mb-0 h6 fw-light w-100px w-sm-200px w-md-400px">
                                                                                                    { lecture.title }
                                                                                                </span>
                                                                                            </div>
                                                                                            <p className="mb-0">{lecture.content_duration || 0}</p>
                                                                                        </div>
                                                                                        <hr /> {/* Divider */}
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>
                                                    {/* Course accordion END */}
                                                </div>
                                                {/* Content END */}

                                                {/* Content START */}
                                                <div
                                                    className="tab-pane fade"
                                                    id="course-pills-3"
                                                    role="tabpanel"
                                                    aria-labelledby="course-pills-tab-3"
                                                >
                                                    {/* Card START */}
                                                    <div className="card mb-0 mb-md-4">
                                                        <div className="row g-0 align-items-center">
                                                            <div className="col-md-5">
                                                                {/* Image */}
                                                                <img
                                                                    src={course?.teacher?.image}
                                                                    className="img-fluid rounded-3"
                                                                    alt="instructor-image"
                                                                />
                                                            </div>
                                                            <div className="col-md-7">
                                                                {/* Card body */}
                                                                <div className="card-body">
                                                                    {/* Title */}
                                                                    <h3 className="card-title mb-0">{course?.teacher?.full_name}</h3>
                                                                    <p className="mb-2">{course?.teacher?.bio}</p>
                                                                    {/* Social button */}
                                                                    <ul className="list-inline mb-3">
                                                                        <li className="list-inline-item me-3">
                                                                            <a href={course?.teacher?.twitter} className="fs-5 text-twitter" target='_blank'>
                                                                                <i className="fab fa-twitter-square" />
                                                                            </a>
                                                                        </li>
                                                                        <li className="list-inline-item me-3">
                                                                            <a href={course?.teacher?.facebook} className="fs-5 text-facebook" target='_blank'>
                                                                                <i className="fab fa-facebook-square" />
                                                                            </a>
                                                                        </li>
                                                                        <li className="list-inline-item me-3">
                                                                            <a href={course?.teacher?.linkedin} className="fs-5 text-linkedin" target='_blank'>
                                                                                <i className="fab fa-linkedin" />
                                                                            </a>
                                                                        </li>

                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Card END */}

                                                    {/* Instructor info */}
                                                    <h5 className="mb-3">About Instructor</h5>
                                                    <p className="mb-3">
                                                       {course?.teacher?.about }
                                                    </p>
                                                </div>

                                                <div
                                                    className="tab-pane fade"
                                                    id="course-pills-4"
                                                    role="tabpanel"
                                                    aria-labelledby="course-pills-tab-4"
                                                >
                                                    {/* Review START */}
                                                    <div className="row mb-1">
                                                        <h5 className="mb-4">Our Student Reviews</h5>
                                                    </div>


                                                    <div className="row">
                                                        <div className="d-md-flex my-4">
                                                            <div className="avatar avatar-xl me-4 flex-shrink-0">
                                                                <img
                                                                    className="avatar-img rounded-circle"
                                                                    src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-1.jpg"
                                                                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                                                                    alt="avatar"
                                                                />
                                                            </div>
                                                            {/* Text */}
                                                            <div>
                                                                <div className="d-sm-flex mt-1 mt-md-0 align-items-center">
                                                                    <h5 className="me-3 mb-0">Sam Jay</h5>
                                                                    {/* Review star */}
                                                                    <ul className="list-inline mb-0">
                                                                        <i className="fas fa-star text-warning" />
                                                                        <i className="fas fa-star text-warning" />
                                                                        <i className="fas fa-star text-warning" />
                                                                        <i className="fas fa-star text-warning" />
                                                                        <i className="far fa-star text-warning" />
                                                                    </ul>
                                                                </div>
                                                                {/* Info */}
                                                                <p className="small mb-2">5 days ago</p>
                                                                <p className="mb-2">
                                                                    Perceived end knowledge certainly day sweetness why
                                                                    cordially. Ask a quick six seven offer see among.
                                                                    Handsome met debating sir dwelling age material. As
                                                                    style lived he worse dried. Offered related so
                                                                    visitors we private removed. Moderate do subjects to
                                                                    distance.
                                                                </p>
                                                                {/* Like and dislike button */}
                                                            </div>
                                                        </div>
                                                        {/* Comment children level 1 */}
                                                        <hr />
                                                        {/* Review item END */}
                                                        {/* Review item START */}
                                                        <div className="d-md-flex my-4">
                                                            {/* Avatar */}
                                                            <div className="avatar avatar-xl me-4 flex-shrink-0">
                                                                <img
                                                                    className="avatar-img rounded-circle"
                                                                    src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-1.jpg"
                                                                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                                                                    alt="avatar"
                                                                />
                                                            </div>
                                                            {/* Text */}
                                                            <div>
                                                                <div className="d-sm-flex mt-1 mt-md-0 align-items-center">
                                                                    <h5 className="me-3 mb-0">Benny Doggo</h5>
                                                                    {/* Review star */}
                                                                    <ul className="list-inline mb-0">
                                                                        <li className="list-inline-item me-0">
                                                                            <i className="fas fa-star text-warning" />
                                                                        </li>
                                                                        <li className="list-inline-item me-0">
                                                                            <i className="fas fa-star text-warning" />
                                                                        </li>
                                                                        <li className="list-inline-item me-0">
                                                                            <i className="fas fa-star text-warning" />
                                                                        </li>
                                                                        <li className="list-inline-item me-0">
                                                                            <i className="fas fa-star text-warning" />
                                                                        </li>
                                                                        <li className="list-inline-item me-0">
                                                                            <i className="far fa-star text-warning" />
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                {/* Info */}
                                                                <p className="small mb-2">2 days ago</p>
                                                                <p className="mb-2">
                                                                    Handsome met debating sir dwelling age material. As
                                                                    style lived he worse dried. Offered related so
                                                                    visitors we private removed. Moderate do subjects to
                                                                    distance.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {/* Review item END */}
                                                        {/* Divider */}
                                                        <hr />
                                                    </div>
                                                    {/* Student review END */}
                                                    {/* Leave Review START */}
                                                    <div className="mt-2">
                                                        <h5 className="mb-4">Leave a Review</h5>
                                                        <form className="row g-3">

                                                            {/* Rating */}
                                                            <div className="col-12 bg-light-input">
                                                                <select
                                                                    id="inputState2"
                                                                    className="form-select js-choice"
                                                                >
                                                                    <option selected="">★★★★★ (5/5)</option>
                                                                    <option>★★★★☆ (4/5)</option>
                                                                    <option>★★★☆☆ (3/5)</option>
                                                                    <option>★★☆☆☆ (2/5)</option>
                                                                    <option>★☆☆☆☆ (1/5)</option>
                                                                </select>
                                                            </div>
                                                            {/* Message */}
                                                            <div className="col-12 bg-light-input">
                                                                <textarea
                                                                    className="form-control"
                                                                    id="exampleFormControlTextarea1"
                                                                    placeholder="Your review"
                                                                    rows={3}
                                                                    defaultValue={""}
                                                                />
                                                            </div>
                                                            {/* Button */}
                                                            <div className="col-12">
                                                                <button type="submit" className="btn btn-primary mb-0">
                                                                    Post Review
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    {/* Leave Review END */}
                                                </div>
                                                {/* Content END */}

                                                {/* Content START */}
                                                <div
                                                    className="tab-pane fade"
                                                    id="course-pills-5"
                                                    role="tabpanel"
                                                    aria-labelledby="course-pills-tab-5"
                                                >
                                                    {/* Title */}
                                                    <h5 className="mb-3">Frequently Asked Questions</h5>
                                                    {/* Accordion START */}
                                                    <div
                                                        className="accordion accordion-flush"
                                                        id="accordionExample"
                                                    >
                                                        {/* Item */}
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="headingOne">
                                                                <button
                                                                    className="accordion-button collapsed"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target="#collapseOne"
                                                                    aria-expanded="true"
                                                                    aria-controls="collapseOne"
                                                                >
                                                                    <span className="text-secondary fw-bold me-3">
                                                                        01
                                                                    </span>
                                                                    <span className="h6 mb-0">
                                                                        How Digital Marketing Work?
                                                                    </span>
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id="collapseOne"
                                                                className="accordion-collapse collapse show"
                                                                aria-labelledby="headingOne"
                                                                data-bs-parent="#accordionExample"
                                                            >
                                                                <div className="accordion-body pt-0">
                                                                    Comfort reached gay perhaps chamber his six detract
                                                                    besides add. Moonlight newspaper up its enjoyment
                                                                    agreeable depending. Timed voice share led him to
                                                                    widen noisy young. At weddings believed laughing
                                                                    although the material does the exercise of. Up attempt
                                                                    offered ye civilly so sitting to. She new course gets
                                                                    living within Elinor joy. She rapturous suffering
                                                                    concealed.
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    {/* Accordion END */}
                                                </div>
                                                {/* Content END */}
                                                {/* Content START */}
                                                <div
                                                    className="tab-pane fade"
                                                    id="course-pills-6"
                                                    role="tabpanel"
                                                    aria-labelledby="course-pills-tab-6"
                                                >
                                                    {/* Review START */}
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h5 className="mb-4">Group Chat & Q/A Forum</h5>

                                                            {/* Comment item START */}
                                                            <div className="border p-2 p-sm-4 rounded-3 mb-4">
                                                                <ul className="list-unstyled mb-0">
                                                                    <li className="comment-item">
                                                                        <div className="d-flex mb-3">
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded">
                                                                                    <div className="d-flex justify-content-center">
                                                                                        <div className="me-2">
                                                                                            <h6 className="mb-1 lead fw-bold">

                                                                                                <a href="#!" className='text-decoration-none text-dark'><span className='text-secondary'>By:</span>  Frances Guerrero </a>
                                                                                            </h6>
                                                                                            <p className="mb-0">
                                                                                                Removed demands expense account in outward tedious do. Particular waythoroughly unaffected projection ar waythoroughly unaffected projection?...
                                                                                            </p>
                                                                                            <p className='mt-4 fw-bold'>16 Replies</p>
                                                                                        </div>
                                                                                        <small>5hr</small>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Comment react */}
                                                                                <ul className="nav nav-divider py-2 small">
                                                                                    <li className="nav-item">
                                                                                        <a className="btn btn-primary btn-sm" href="#">
                                                                                            Join Conversation <i className='fas fa-arrow-right'></i>
                                                                                        </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li className="comment-item">
                                                                        <div className="d-flex mb-3">
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded">
                                                                                    <div className="d-flex justify-content-center">
                                                                                        <div className="me-2">
                                                                                            <h6 className="mb-1 lead fw-bold">

                                                                                                <a href="#!" className='text-decoration-none text-dark'><span className='text-secondary'>By:</span>  Frances Guerrero </a>
                                                                                            </h6>
                                                                                            <p className="mb-0">
                                                                                                Removed demands expense account in outward tedious do. Particular waythoroughly unaffected projection ar waythoroughly unaffected projection?...
                                                                                            </p>
                                                                                            <p className='mt-4 fw-bold'>16 Replies</p>
                                                                                        </div>
                                                                                        <small>5hr</small>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Comment react */}
                                                                                <ul className="nav nav-divider py-2 small">
                                                                                    <li className="nav-item">
                                                                                        <a className="btn btn-primary btn-sm" href="#">
                                                                                            Join Conversation <i className='fas fa-arrow-right'></i>
                                                                                        </a>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            {/* Chat Detail Page */}
                                                            <div className="border p-2 p-sm-4 rounded-3">
                                                                <ul className="list-unstyled mb-0" style={{ overflowY: "scroll", height: "500px" }}>
                                                                    <li className="comment-item mb-3">
                                                                        <div className="d-flex">
                                                                            <div className="avatar avatar-sm flex-shrink-0">
                                                                                <a href="#">
                                                                                    <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded w-100">
                                                                                    <div className="d-flex w-100 justify-content-center">
                                                                                        <div className="me-2 ">
                                                                                            <h6 className="mb-1 lead fw-bold">
                                                                                                <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                                                                                                <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                                                                                            </h6>
                                                                                            <p className="mb-0 mt-3  ">Removed demands expense account
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li className="comment-item mb-3">
                                                                        <div className="d-flex">
                                                                            <div className="avatar avatar-sm flex-shrink-0">
                                                                                <a href="#">
                                                                                    <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded w-100">
                                                                                    <div className="d-flex w-100 justify-content-center">
                                                                                        <div className="me-2 ">
                                                                                            <h6 className="mb-1 lead fw-bold">
                                                                                                <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                                                                                                <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                                                                                            </h6>
                                                                                            <p className="mb-0 mt-3  ">Removed demands expense account from the debby building in a hall  town tak with
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li className="comment-item mb-3">
                                                                        <div className="d-flex">
                                                                            <div className="avatar avatar-sm flex-shrink-0">
                                                                                <a href="#">
                                                                                    <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded w-100">
                                                                                    <div className="d-flex w-100 justify-content-center">
                                                                                        <div className="me-2 ">
                                                                                            <h6 className="mb-1 lead fw-bold">
                                                                                                <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                                                                                                <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                                                                                            </h6>
                                                                                            <p className="mb-0 mt-3  ">Removed demands expense account
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li className="comment-item mb-3">
                                                                        <div className="d-flex">
                                                                            <div className="avatar avatar-sm flex-shrink-0">
                                                                                <a href="#">
                                                                                    <img className="avatar-img rounded-circle" src="https://geeksui.codescandy.com/geeks/assets/images/avatar/avatar-3.jpg" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt="womans image" />
                                                                                </a>
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                {/* Comment by */}
                                                                                <div className="bg-light p-3 rounded w-100">
                                                                                    <div className="d-flex w-100 justify-content-center">
                                                                                        <div className="me-2 ">
                                                                                            <h6 className="mb-1 lead fw-bold">
                                                                                                <a href="#!" className='text-decoration-none text-dark'> Louis Ferguson </a><br />
                                                                                                <span style={{ fontSize: "12px", color: "gray" }}>5hrs Ago</span>
                                                                                            </h6>
                                                                                            <p className="mb-0 mt-3  ">Removed demands expense account
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>

                                                                <form className="w-100 d-flex">
                                                                    <textarea className="one form-control pe-4 bg-light w-75" id="autoheighttextarea" rows="1" placeholder="Write a message..."></textarea>
                                                                    <button className="btn btn-primary ms-2 mb-0 w-25" type="button">Post <i className='fas fa-paper-plane'></i></button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Main content END */}

                                {/* Right sidebar START */}
                                <div className="col-lg-4 pt-5 pt-lg-0">
                                    <div className="row mb-5 mb-lg-0">
                                        <div className="col-md-6 col-lg-12">
                                            {/* Video START */}
                                            <div className="card shadow p-2 mb-4 z-index-9">
                                                <div className="overflow-hidden rounded-3">
                                                    <img src={course.image} className="card-img" alt={course.title} />
                                                    <div className="m-auto rounded-2 mt-2 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ededed" }}>
                                                        <a data-bs-toggle="modal" data-bs-target="#exampleModal" href={course.file} className="btn btn-lg text-danger btn-round btn-white-shadow mb-0" data-glightbox="" data-gallery="course-video">
                                                            <i className="fas fa-play" />
                                                        </a>
                                                        <span data-bs-toggle="modal" data-bs-target="#exampleModal" className='fw-bold'>Course Introduction Video</span>

                                                        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                            <div className="modal-dialog modal-lg">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                                                                            Introduction Videos
                                                                        </h1>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                                                        />
                                                                    </div>
                                                                    <div className="modal-body">
                                                                       <iframe
                                                                            width="750"
                                                                            height="500"
                                                                            src={course.file}  // Ensure this is a valid embed URL
                                                                            title={course.title}
                                                                            frameBorder="0"
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                            referrerPolicy="strict-origin-when-cross-origin"
                                                                            allowFullScreen>
                                                                        </iframe>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                                            Close
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Card body */}
                                                <div className="card-body px-3">
                                                    {/* Info */}
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        {/* Price and time */}
                                                        <div>
                                                            <div className="d-flex align-items-center">
                                                                <h3 className="fw-bold mb-0 me-2"> ৳{course.price || 0}</h3>
                                                            </div>
                                                        </div>
                                                        {/* Share button with dropdown */}
                                                        <div className="dropdown">
                                                            {/* Share button */}
                                                            <a
                                                                href="#"
                                                                className="btn btn-sm btn-light rounded small"
                                                                role="button"
                                                                id="dropdownShare"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="fas fa-fw fa-share-alt" />
                                                            </a>
                                                            {/* dropdown button */}
                                                            <ul
                                                                className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded"
                                                                aria-labelledby="dropdownShare"
                                                            >
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-twitter-square me-2" />
                                                                        Twitter
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-facebook-square me-2" />
                                                                        Facebook
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fab fa-linkedin me-2" />
                                                                        LinkedIn
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="dropdown-item" href="#">
                                                                        <i className="fas fa-copy me-2" />
                                                                        Copy link
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* add to cart */}
                                                    <div className="mt-3 d-sm-flex justify-content-sm-between ">
                                                        <button
                                                            type='button'
                                                            className="btn btn-primary mb-0 w-100 me-2"
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
                                                            {
                                                                addToCartBtn == "Add To Cart" ?
                                                                <i className='fas fa-shopping-cart'></i>  : addToCartBtn == "Added To Cart" ?  <i className='fas fa-check-circle'></i> :  <i className='fas fa-spinner fa-spine'></i>
                                                            }
                                                            { addToCartBtn }
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
                                                            type='button' className="btn btn-success mb-0 w-100">
                                                            Enroll Now <i className='fas fa-arrow-right'></i>
                                                        </button>

                                                    </div>

                                                </div>
                                            </div>
                                            {/* Video END */}

                                            {/* Course info START */}
                                            <div className="card card-body shadow p-4 mb-4">
                                                {/* Title */}
                                                <h4 className="mb-3">This course includes</h4>
                                                <ul className="list-group list-group-borderless">
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-book-open text-primary me-2" />
                                                            Lectures
                                                        </span>
                                                        <span>{course.lectures?.length}</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center d-none">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-clock text-primary me-2" />
                                                            Duration
                                                        </span>
                                                        <span>4h 50m</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-signal text-primary me-2" />
                                                            Skills
                                                        </span>
                                                        <span>{course.level}</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-globe text-primary me-2" />
                                                            Language
                                                        </span>
                                                        <span>{course.language}</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-user-clock text-primary me-2" />
                                                            Published
                                                        </span>
                                                        <span>{moment(course.date).format("DD MMM, YYYY")}</span>
                                                    </li>
                                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                                        <span className="h6 fw-light mb-0">
                                                            <i className="fas fa-fw fa-medal text-primary me-2" />
                                                            Certificate
                                                        </span>
                                                        <span>Yes</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* Course info END */}
                                        </div>

                                    </div>
                                    {/* Row End */}
                                </div>
                                {/* Right sidebar END */}
                            </div>
                            {/* Row END */}
                        </div>
                    </section>


                    {/** Related Courses  */}
                    <section className='mb-5'>
                        <div className="container mb-lg-8 ">
                            <div className="row mb-5 mt-3">
                                {/* col */}
                                <div className="col-12">
                                    <div className="mb-6">
                                        <h2 className="mb-1 h1">Related Courses</h2>
                                        <p>
                                            These are the most popular courses among Geeks Courses learners
                                            worldwide in year 2022
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">

                                        {course?.related_courses.map((course, course_index) => (
                                             <div className="col" key={course_index}>
                                                 <div className="card card-hover">
                                                     <Link to={`/course-detail/${course.slug}/`}>
                                                         <img
                                                             src={BASE_URL + course.image}
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


                                    </div>

                                </div>
                            </div>
                        </div>
                    </section>
                </>
            }

            <BaseFooter />
        </>
    )
}

export default CourseDetail