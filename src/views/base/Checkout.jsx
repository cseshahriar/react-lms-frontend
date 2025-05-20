import React, {useEffect, useState, useContext} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'

import CartId from '../plugin/CartId';
import apiInstance from '../../utils/axios';
import Toast from '../plugin/Toast';
import UserData from '../plugin/UserData'
import { CartContext } from '../plugin/Context';
import useAxios from '../../utils/useAxios'
import { PAYPAL_CLIENT_ID } from '../../utils/constants';

// Renders errors or successful transactions on the screen.
function Message({ content }) {
    return <p>{content}</p>;
}


function Checkout() {
    const params = useParams();
    const navigate = useNavigate();

    const [coupon, setCoupon] = useState("");

    const [order, setOrder] = useState([]);
    const [user, setUser] = useState(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [mobile, setMobile] = useState("");

    const fetchOrder = async() => {
        try {
            await useAxios().get(`order/checkout/${params.order_oid}`)
                .then((response) => {
                    setOrder(response.data);
                });
        } catch (error) {
            console.log('fetchOrder', error);
            Toast().fire({
                    title: 'Something went wrong for order fetching',
                    icon: "error",
            });
        }
    }

    const applyCoupon = async() => {
        const forData = new FormData();
        forData.append('order_oid', order.oid);
        forData.append('coupon_code', coupon);

        if(coupon && order.oid) {
            try {
                 await useAxios().post(`order/coupon/`, forData)
                .then((response) => {
                    fetchOrder();
                    Toast().fire({
                        title: response.data?.message,
                        icon: response.data?.icon
                    })
                });
            } catch (error) {
                console.log('coupon error', error);
                Toast().fire({
                        title: "Invalid coupon!. Please remove whitespace if given.",
                        icon: "error"
                })
            }
        }
    }

    useEffect(() => {
        fetchOrder();
        if(!user) {
            const current_user = UserData();
            if(current_user) {
            setUser(current_user);
            setFullName(current_user.full_name);
            setEmail(current_user.email);
            setCountry(current_user.country);
            }
        }
    }, [])

    // https://developer.paypal.com/studio/checkout/standard/integrate
    // paypal
    const initialOptions = {
        clientId: PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };
    const styles = {
        shape: "rect",
        layout: "vertical",  // horizontal
    };
    const [message, setMessage] = useState("");

    return (
        <>
            <BaseHeader />

            <section className="py-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">Checkout</h1>
                                {/* Breadcrumb */}
                                <div className="d-flex justify-content-center">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb breadcrumb-dots mb-0">
                                            <li className="breadcrumb-item">
                                                <Link to="/" className='text-decoration-none text-dark'>Home</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link to="/" className='text-decoration-none text-dark'>Courses</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link to="/cart" className='text-decoration-none text-dark'>Cart</Link>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                Checkout
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
                    <div className="row g-4 g-sm-5">
                        <div className="col-xl-8 mb-4 mb-sm-0">
                            <div className="alert alert-warning alert-dismissible d-flex justify-content-between align-items-center fade show py-2 pe-2" role="alert">
                                <div>
                                    <i className="bi bi-exclamation-octagon-fill me-2" />
                                    Review your courses before payment
                                </div>

                                <button type="button" className="btn btn-warning mb-0 text-primary-hover text-end" data-bs-dismiss="alert" aria-label="Close" >
                                    <i className="bi bi-x-lg text-white" />
                                </button>
                            </div>

                            <div className="p-4 shadow rounded-3 mt-4">
                                <h5 className="mb-0 mb-3">Courses</h5>

                                <div className="table-responsive border-0 rounded-3">
                                    <table className="table align-middle p-4 mb-0">
                                        <tbody className="border-top-2">
                                            {order?.order_items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-lg-flex align-items-center">
                                                            <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                <img src={item.course?.image} style={{ width: "100px", height: "70px", objectFit: "cover" }} className="rounded" alt={item.course.title} />
                                                            </div>
                                                            <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                <a href="#" className='text-decoration-none text-dark'>{item.course.title}</a>
                                                            </h6>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <h5 className="text-success mb-0">৳{item.price}</h5>
                                                    </td>
                                                </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                <Link to={`/cart/`} className='btn btn-outline-secondary mt-3'>Edit Cart <i className='fas fa-edit'></i></Link>
                            </div>

                            <div className="shadow p-4 rounded-3 mt-5">
                                <h5 className="mb-0">Personal Details</h5>
                                <form className="row g-3 mt-0">
                                    <div className="row g-3 mt-0">

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

                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="mobileNumber" className="form-label">
                                                Mobile number *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="mobileNumber"
                                                name='mobile'
                                                placeholder="Mobile number"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                required
                                            />
                                        </div>


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
                                </form>
                                {/* Form END */}
                            </div>

                        </div>
                        <div className="col-xl-4">
                            <div className="row mb-0">
                                <div className="col-md-6 col-xl-12">
                                    <div className="shadow p-4 mb-4 rounded-3">
                                        <h4 className="mb-4">Order Summary</h4>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>Transaction ID</span>
                                                <p className="mb-0 h6 fw-light">DES23853</p>
                                            </div>

                                        </div>

                                        {/** coupon */}
                                        <div className="input-group mt-5">
                                            <input
                                                name='coupon_code'
                                                className="form-control form-control"
                                                placeholder="COUPON CODE"
                                                onChange={(e) => setCoupon(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={applyCoupon}
                                            >Apply</button>
                                        </div>


                                        <div className="p-3 shadow rounded-3 mt-3">
                                            <h4 className="mb-3">Cart Total</h4>
                                            <ul className="list-group mb-3">
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    Sub Total
                                                    <span>৳ {order?.sub_total}</span>
                                                </li>
                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    Discount
                                                    <span>৳ {order.saved}</span>
                                                </li>

                                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                                    Tax
                                                    <span>৳ {order?.tax_fee}</span>
                                                </li>
                                                <li className="list-group-item d-flex fw-bold justify-content-between align-items-center">
                                                    Total
                                                    <span className='fw-bold'>৳ {order?.total}</span>
                                                </li>
                                            </ul>
                                            <div className="d-grid">
                                                <PayPalScriptProvider options={initialOptions}>
                                                    <PayPalButtons className='mt-3'
                                                        style={styles}
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            currency_code: "USD",
                                                                            value: order.total.toString(),
                                                                        }
                                                                    }
                                                                ]
                                                            })
                                                        }}

                                                        onApprove={(data, actions) => {
                                                            return actions.order.capture().then((details) => {
                                                                const name = details.payer.name.given_name;
                                                                const status = details.status;
                                                                const paypal_order_id = data.orderID;

                                                                console.log(status);
                                                                if (status === "COMPLETED") {
                                                                    navigate(`/payment-success/${order.oid}/?paypal_order_id=${paypal_order_id}`)
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </PayPalScriptProvider>
                                                <Message content={message} />

                                                <Link to={`/success/txn_id/`} className="btn btn-lg btn-success mt-2"> Pay With Stripe</Link>
                                            </div>
                                            <p className="small mb-0 mt-2 text-center">
                                                By proceeding to payment, you agree to these{" "}<a href="#"> <strong>Terms of Service</strong></a>
                                            </p>
                                        </div>
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

export default Checkout