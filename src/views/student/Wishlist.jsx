import React, { useState, useEffect, useContext } from "react";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import { Link, useNavigate } from "react-router-dom";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";
import Sidebar from "./Partials/Sidebar";
import Header from "./Partials/Header";

import useAxios from "../../utils/useAxios";

import UserData from "../plugin/UserData";
import Toast from "../plugin/Toast";
import CartId from "../plugin/CartId";
import GetCurrentAddress from "../plugin/UserCountry";
import { CartContext } from "../plugin/Context";

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [cartCount, setCartCount] = useContext(CartContext);

    const fetchWishlist = () => {
        useAxios.get(`student/wishlist/${UserData()?.user_id}/`).then((res) => {
            console.log('wishlist ', res.data);
            setWishlist(res.data);
        });
    };
    const country = GetCurrentAddress()?.country;

    useEffect(() => {
        fetchWishlist();
    }, []);

    const addToCart = async (courseId, userId, price, country, cartId) => {
        const formdata = new FormData();

        formdata.append("course_id", courseId);
        formdata.append("user_id", userId);
        formdata.append("price", price);
        formdata.append("country_name", country);
        formdata.append("cart_id", cartId);

        try {
            await useAxios.post(`course/cart/`, formdata).then((res) => {
                Toast().fire({
                    title: "Added To Cart",
                    icon: "success",
                });

                // Set cart count after adding to cart
                useAxios
                    .get(`course/cart-list/${CartId()}/`)
                    .then((res) => {
                        setCartCount(res.data?.length);
                    });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const enrolment = (courseId, price, userId, country_name, cartId) => {
        addToCart(courseId, price, userId, country_name, cartId);
        navigate('/cart');
    }


    const addToWishlist = (courseId) => {
        const formdata = new FormData();
        formdata.append("user_id", UserData()?.user_id);
        formdata.append("course_id", courseId);

        useAxios.post(`student/wishlist/${UserData()?.user_id}/`, formdata).then((res) => {
            fetchWishlist();
            Toast().fire({
                icon: "success",
                title: res.data.message,
            });
        });
    };

    return (
        <>
            <BaseHeader />

            <section className="pt-5 pb-5">
                <div className="container">
                    {/* Header Here */}
                    <Header />
                    <div className="row mt-0 mt-md-4">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 col-md-8 col-12">
                            <h4 className="mb-0 mb-4">
                                {" "}
                                <i className="fas fa-heart text-danger"></i> Wishlist{" "}
                            </h4>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                        {wishlist?.map((wish, index) => (
                                            <div className="col-lg-4" key={index}>
                                                {/* Card */}
                                                <div className="card card-hover">
                                                    <Link to={`/course-detail/${wish.course.slug}/`}>
                                                        <img
                                                            src={wish.course.image}
                                                            alt="course"
                                                            className="card-img-top"
                                                            style={{
                                                                width: "100%",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </Link>
                                                    {/* Card Body */}
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <div>
                                                                <span className="badge bg-info">{wish.course.level}</span>
                                                                <span className="badge bg-success ms-2">{wish.course.language}</span>
                                                            </div>

                                                            {/** remove */}
                                                            <a onClick={() => addToWishlist(wish.course?.id)} className="fs-5">
                                                                <i className="fas fa-heart text-danger align-middle" />
                                                            </a>

                                                        </div>
                                                        <h4 className="mb-2 text-truncate-line-2 ">
                                                            <Link to={`/course-detail/slug/`} className="text-inherit text-decoration-none text-dark fs-5">
                                                                {wish.course.title}
                                                            </Link>
                                                        </h4>
                                                        <small>By: {wish.course?.teacher?.full_name}</small> <br />
                                                        <small>
                                                            {wish.enrollment_count || 0} Student
                                                            {wish.enrollment_count > 1 && "s"}
                                                        </small>{" "}
                                                        <br />
                                                        <div className="lh-1 mt-3 d-flex">
                                                            <span className="align-text-top">
                                                                <span className="fs-6">
                                                                    <Rater total={5} rating={wish.course.average_rating || 0} />
                                                                </span>
                                                            </span>
                                                            <span className="text-warning">4.5</span>
                                                            <span className="fs-6 ms-2">({wish.course.reviews?.length} Reviews)</span>
                                                        </div>
                                                    </div>
                                                    {/* Card Footer */}
                                                    <div className="card-footer">
                                                        <div className="row align-items-center g-0">
                                                            <div className="col">
                                                                <h5 className="mb-0">${wish.course.price}</h5>
                                                            </div>
                                                            <div className="col-auto">
                                                                <button type="button" onClick={() => addToCart(wish.course.id, UserData()?.user_id, wish.course.price, country, CartId())} className="text-inherit text-decoration-none btn btn-primary me-2">
                                                                    <i className="fas fa-shopping-cart text-primary text-white" />
                                                                </button>
                                                                <button
                                                                    onClick={
                                                                        () => enrolment(
                                                                            wish.course.id,
                                                                            wish.course.price,
                                                                            wish.user?.user_id || null,
                                                                            wish.user?.country || null,
                                                                            CartId()
                                                                        )
                                                                    }
                                                                    className="text-inherit text-decoration-none btn btn-primary">
                                                                    Enroll Now <i className="fas fa-arrow-right text-primary align-middle me-2 text-white" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {wishlist.length < 1 && <p className="mt-4 p-3">No item in wishlist</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BaseFooter />
        </>
    );
}

export default Wishlist;
