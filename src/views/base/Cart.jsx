import React, {useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'

import CartId from '../plugin/CartId';
import apiInstance from '../../utils/axios';
import Toast from '../plugin/Toast';
import UserData from '../plugin/UserData'
import { CartContext } from '../plugin/Context';
import useAxios from '../../utils/useAxios'

function Cart() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useContext(CartContext);
    const [carts, setCarts] = useState([]);
    const [cartStats, setCartStats] = useState([]);

    const cartID = CartId();
    const [user, setUser] = useState(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");


    const fetchCartItems = async() => {
        try {
            console.log('cartID ', cartID);
            await apiInstance.get(`course/cart-list/${cartID}`)
                .then((response) => {
                    setCarts(response.data);
                    setCartCount(response.data?.length);
                });

            await apiInstance.get(`cart/stats/${cartID}`)
                .then((response) => {
                    setCartStats(response.data);
                })
        } catch (error) {
            console.log('fetchCartItems', error);
            Toast().fire({
                    title: 'Something went wrong!',
                    icon: "error",
            });
        }
    }

    const cartItemDelete = async(itemId) => {
        try {
            await apiInstance.delete(`course/cart-item-delete/${cartID}/${itemId}/`)
            .then((response) => {
                fetchCartItems(response.data);
                setCartCount(response.data?.length);
                Toast().fire({
                    title: "Cart item removed successfully",
                    icon: "success",
                });
            });
        } catch (error) {
            console.log('cartItemDelete error: ', error);
            Toast().fire({
                title: "Something went wrong!",
                icon: "error",
            });
        }
    }

    const createOrder = async(e) => {
        e.preventDefault();
        if(!user) {
            Toast().fire({
                title: "Please login first!",
                icon: "error",
            });
            return;
        }

        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("email", email);
        formData.append("country", country);
        formData.append("user_id", user?.user_id);
        formData.append("cart_id", cartID);
        console.log('form data: ', formData);

        try {
            await useAxios.post(`order/create-order/`, formData)
                .then((response) => {
                    console.log('create order', response.data);
                    navigate(`/checkout/${response.data.order_oid}`);
                });
        } catch (error) {
            console.log('createOrder error: ', error);
            Toast().fire({
                title: "Something went wrong!",
                icon: "error",
            });
        }
    }

    useEffect(() => {
        fetchCartItems();
        if(!user) {
           const current_user = UserData();
           if(current_user) {
            setUser(current_user);
            setFullName(current_user.full_name);
            setEmail(current_user.email);
            setCountry(current_user.country);
           }
        }
    }, [user, ])

    return (
        <>
            <BaseHeader />

            <section className="py-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">My Cart</h1>
                                {/* Breadcrumb */}
                                <div className="d-flex justify-content-center">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb breadcrumb-dots mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="#" className='text-decoration-none text-dark'>Home</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="#" className='text-decoration-none text-dark'>Courses</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Cart
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-5">
                <div className="container">
                    <form  onSubmit={createOrder}>
                        <div className="row g-4 g-sm-5">
                            {/* Main content START */}
                            <div className="col-lg-8 mb-4 mb-sm-0">
                                <div className="p-4 shadow rounded-3">
                                    <h5 className="mb-0 mb-3">Cart Items ({carts?.length||0})</h5>

                                    <div className="table-responsive border-0 rounded-3">
                                        <table className="table align-middle p-4 mb-0">
                                            <tbody className="border-top-2">
                                                {
                                                    carts?.map((cart, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="d-lg-flex align-items-center">
                                                                    <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                        <img src={cart.course?.image} style={{ width: "100px", height: "70px", objectFit: "cover" }} className="rounded" alt={cart.course.title} />
                                                                    </div>
                                                                    <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                        <a href="#" className='text-decoration-none text-dark'>{cart.course.title}</a>
                                                                    </h6>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                <h5 className="text-success mb-0">৳{cart.price}</h5>
                                                            </td>
                                                            <td>
                                                                <button onClick={() => cartItemDelete(cart.id)} type='button' className="btn btn-sm btn-danger px-2 mb-0">
                                                                    <i className="fas fa-fw fa-times" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>
                                        { carts?.length < 1 && <p className='mt-4 p-3 text-danger'>No Course in Cart! <Link to="/" className='btn btn-link'>Course Page</Link></p>}
                                    </div>
                                </div>

                                {/* Personal info START */}
                                <div className="shadow p-4 rounded-3 mt-5">
                                    {/* Title */}
                                    <h5 className="mb-0">Personal Details</h5>
                                    {/* Form START */}
                                    <div className="row g-3 mt-0">
                                        {/* Name */}
                                        <div className="col-md-12 bg-light-input">
                                            <label htmlFor="yourName" className="form-label">
                                                Your name *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="yourName"
                                                placeholder="Name"
                                                name='name'
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {/* Email */}
                                        <div className="col-md-12 bg-light-input">
                                            <label htmlFor="emailInput" className="form-label">
                                                Email address *
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="emailInput"
                                                placeholder="Email"
                                                name='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Country option */}
                                        <div className="col-md-12 bg-light-input">
                                            <label htmlFor="mobileNumber" className="form-label">
                                                Select country *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="country"
                                                name='country'
                                                placeholder="Country"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                required
                                            />
                                        </div>

                                    </div>
                                    {/* Form END */}
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="p-4 shadow rounded-3">
                                    <h4 className="mb-3">Cart Total</h4>
                                    <ul className="list-group mb-3">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Sub Total
                                            <span>৳ {cartStats?.price?.toFixed(2)}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Tax
                                            <span>৳ {cartStats?.total?.toFixed(2)}</span>
                                        </li>
                                        <li className="list-group-item d-flex fw-bold justify-content-between align-items-center">
                                            Total
                                            <span className='fw-bold'>৳ {cartStats?.total?.toFixed(2)}</span>
                                        </li>
                                    </ul>

                                    <div className="d-grid">
                                        <button type='submit' className="btn btn-lg btn-success">
                                            Proceed to Checkout
                                        </button>
                                    </div>

                                    <p className="small mb-0 mt-2 text-center">
                                        By proceeding to checkout, you agree to these{" "}<a href="#"> <strong>Terms of Service</strong></a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            <BaseFooter />
        </>
    )
}

export default Cart