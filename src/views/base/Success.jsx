import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'

import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import apiInstance from '../../utils/axios';
import useAxios from '../../utils/useAxios'

function Success() {
    const [order, setOrder] = useState([]);
    const [orderMessage, setOrderMessage] = useState("");

    const params = useParams();
    const urlParams = new URLSearchParams(window.location.search);

    const sessionId = urlParams.get('session_id');
    const paypalOrderId = urlParams.get('paypal_order_id');

    useEffect(() => {
        async function fetchData() {
            const formData = new FormData();
            formData.append('order_oid', params.order_oid)
            formData.append('session_id', sessionId)
            formData.append('paypal_order_id', paypalOrderId)
            setOrderMessage("Processing Payment");
            try {
                await useAxios.post(`payment/payment-success/`, formData).then((response) => {
                    console.log(response.data);
                    setOrderMessage(response.data.message);
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <BaseHeader />

            <section className="pt-0  position-relative overflow-hidden my-auto">
                <div className="container position-relative">
                    <div className="row g-5 align-items-center justify-content-center py-5">
                        { orderMessage === 'Payment Successful' && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-success">Enrollment Successful!</h1>
                                    <p> Hey there, you enrollment in the 2 courses where successful, visit your <Link to="/dashboard/my-courses">My Courses</Link> page, to view the courses now.</p>
                                    <button type="button" className="btn btn-primary mb-0 rounded-2">View Enrolled Courses <i className='fas fa-arrow-right'></i></button>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img src="https://assets.materialup.com/uploads/bc4c9683-f623-42ef-9014-464ba0411c79/preview.png" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        )}

                        { orderMessage === 'Already Paid' && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-success">Already Paid</h1>
                                    <p> Hey there, you enrollment in the 2 courses where successful, visit your <Link to="/dashboard/my-courses">My Courses</Link> page, to view the courses now.</p>
                                    <button type="button" className="btn btn-primary mb-0 rounded-2">View Enrolled Courses <i className='fas fa-arrow-right'></i></button>
                                </div>
                                <div className="col-lg-7 text-center">
                                    <img src="https://assets.materialup.com/uploads/bc4c9683-f623-42ef-9014-464ba0411c79/preview.png" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        )}

                        { orderMessage === 'Payment Processing' && (
                            <>
                            <div className="col-lg-5">
                                <h1 className="text-warning">Processing Payment <i className='fas fa-spinner fa-spin'></i></h1>
                                <p> Hey there, hold on while we process your payment, please do not leave the page.</p>
                            </div>
                            <div className="col-lg-7 text-center">
                                <img sty src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1259.gif" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                            </div>
                            </>
                        )}

                        { orderMessage === 'Payment Failed' && (
                            <>
                                <div className="col-lg-5">
                                    <h1 className="text-danger">Payment Failed 😔</h1>
                                    <p>Unfortunately, phew! Your payment did not go through. <br /> Please try again.</p>
                                    <button type="button" className="btn btn-danger mb-0 rounded-2">Try again <i className='fas fa-repeat'></i></button>

                                </div>
                                <div className="col-lg-7 text-center">
                                    <img sty src="https://media3.giphy.com/media/h4OGa0npayrJX2NRPT/giphy.gif?cid=790b76117pc6298jypyph0liy6xlp3lzb7b2y405ixesujeu&ep=v1_stickers_search&rid=giphy.gif&ct=e" className="h-300px h-sm-400px h-md-500px h-xl-700px" alt="" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>


            <BaseFooter />
        </>
    )
}

export default Success