import { useDispatch, useSelector } from "react-redux";
import { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../config/payments";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { SET_USER } from "../../redux/user/actions";
import './PurchaseCredit.css';
import { Modal } from "react-bootstrap";
import { FaCoins, FaCalendarAlt, FaCrown } from 'react-icons/fa';

function PurchaseCredit() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBuyCredits = async (credits) => {
        setShowModal(false);
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-order`, {
                credits
            }, { withCredentials: true });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Affiliate++',
                description: `${credits} Credits Pack`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post(`${serverEndpoint}/payments/verify-order`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            credits
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: data
                        });
                        setMessage(`${credits} credits added!`);
                    } catch (error) {
                        console.error(error);
                        setErrors({ message: 'Unable to purchase credits, please try again' });
                    }
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Unable to purchase credits, please try again' });
        }
    };

    const handleSubscribe = async (planKey) => {
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-subscription`, {
                plan_name: planKey
            }, { withCredentials: true });

            const plan = PLAN_IDS[planKey];
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                name: plan.planName,
                description: plan.description,
                subscription_id: data.subscription.id,
                handler: async function (response) {
                    try {
                        const user = await axios.post(`${serverEndpoint}/payments/verify-subscription`, {
                            subscription_id: response.razorpay_subscription_id
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: user.data
                        });
                        setMessage('Subscription activated');
                    } catch (error) {
                        setErrors({ message: 'Unable to activate subscription, please try again' });
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Failed to create subscription' });
        }
    };

    return (
        <section className="ezy__pricing10 light py-5" id="ezy__pricing10">
            <div className="container">
                {errors.message && <div className="alert alert-danger">{errors.message}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <div className="d-flex flex-wrap justify-content-between align-items-start w-100 mb-4 gap-3">
                    <div className="text-left">
                        <h3 className="ezy__pricing10-heading" style={{ color: 'var(--color-primary)' }}>Choose Plan</h3>
                        <p className="ezy__pricing10-sub-heading mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                            Flexible options: one-time credits or recurring subscriptions.
                        </p>
                    </div>
                    <div className="text-right ms-auto">
                        <h4 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>Current Balance</h4>
                        <div className="fs-5" style={{ color: 'var(--color-secondary)' }}>{userDetails.credits} Credits</div>
                    </div>
                </div>

                <div className="row justify-content-center g-4">
                    {/* Credit Pack Card */}
                    <div className="col-md-6 col-xl-4 text-center">
                        <div className="card ezy__pricing10-card p-4 border-0 rounded-4 shadow-sm h-100" style={{ border: '2px solid #E2E8F0', transition: 'box-shadow 0.3s', boxShadow: '0 8px 40px 0 rgba(44, 62, 80, 0.22), 0 2px 8px 0 rgba(44, 62, 80, 0.12)' }}>
                            <div className="card-body pt-4">
                                <FaCoins size={48} style={{ color: 'var(--color-secondary)', marginBottom: 12 }} />
                                <p className="ezy__pricing10-meta-price mb-2">
                                    <span className="ezy__pricing10-rate" style={{ color: 'var(--color-primary)' }}>Credit Packs</span>
                                </p>
                            </div>
                            <div className="card-body pb-4 p-0">
                                <ul className="nav ezy__pricing10-nav flex-column mb-3">
                                    {CREDIT_PACKS.map(c => (
                                        <li className="pb-2" key={c} style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                            {c} CREDITS FOR ₹{c}
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary w-100 py-2 fw-semibold shadow-sm" onClick={() => setShowModal(true)}>
                                    Buy Credits
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Plan */}
                    <div className="col-md-6 col-xl-4 text-center">
                        <div className="card ezy__pricing10-card p-4 border-0 rounded-4 shadow-sm h-100" style={{ border: '2px solid #E2E8F0', transition: 'box-shadow 0.3s', boxShadow: '0 8px 40px 0 rgba(44, 62, 80, 0.22), 0 2px 8px 0 rgba(44, 62, 80, 0.12)' }}>
                            <div className="card-body pt-4">
                                <FaCalendarAlt size={48} style={{ color: 'var(--color-secondary)', marginBottom: 12 }} />
                                <p className="ezy__pricing10-meta-price mb-2">
                                    <span className="ezy__pricing10-rate" style={{ color: 'var(--color-primary)' }}>₹199/month</span>
                                </p>
                            </div>
                            <div className="card-body pb-4 p-0">
                                <ul className="nav ezy__pricing10-nav flex-column mb-3">
                                    {pricingList[1].list.map((item, i) => (
                                        <li className="pb-2" key={i} style={{ color: 'var(--color-text-primary)' }}>{item.detail}</li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary w-100 py-2 fw-semibold shadow-sm" onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}>
                                    Subscribe Monthly
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Yearly Plan */}
                    <div className="col-md-6 col-xl-4 text-center">
                        <div className="card ezy__pricing10-card p-4 border-0 rounded-4 shadow-sm h-100" style={{ border: '2px solid #E2E8F0', transition: 'box-shadow 0.3s', boxShadow: '0 8px 40px 0 rgba(44, 62, 80, 0.22), 0 2px 8px 0 rgba(44, 62, 80, 0.12)' }}>
                            <div className="card-body pt-4">
                                <FaCrown size={48} style={{ color: 'var(--color-secondary)', marginBottom: 12 }} />
                                <p className="ezy__pricing10-meta-price mb-2">
                                    <span className="ezy__pricing10-rate" style={{ color: 'var(--color-primary)' }}>₹1990/year</span>
                                </p>
                            </div>
                            <div className="card-body pb-4 p-0">
                                <ul className="nav ezy__pricing10-nav flex-column mb-3">
                                    {pricingList[2].list.map((item, i) => (
                                        <li className="pb-2" key={i} style={{ color: 'var(--color-text-primary)' }}>{item.detail}</li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary w-100 py-2 fw-semibold shadow-sm" onClick={() => handleSubscribe('UNLIMITED_YEARLY')}>
                                    Subscribe Yearly
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* React-Bootstrap Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Buy Credits</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {CREDIT_PACKS.map((c) => (
                            <button
                                key={c}
                                className="m-2 btn btn-outline-primary"
                                onClick={() => handleBuyCredits(c)}
                            >
                                Buy {c} Credits
                            </button>
                        ))}
                    </Modal.Body>
                </Modal>
            </div>
        </section>
    );
}

export default PurchaseCredit;