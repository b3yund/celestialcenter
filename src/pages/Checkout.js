// src/pages/Checkout.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import fetchData from '../utils/fetchData';
import { AuthContext } from '../AuthContext';
import '../styles/Checkout.css';

// **Configuration Constants**
const BACKEND_URL = 'https://celestialcentral-835108787508.us-central1.run.app'; // Hard-coded backend URL

const STRIPE_MODE = 'test'; // Set to 'test' or 'live' based on your backend configuration

// **Stripe Publishable Keys**
const STRIPE_PUBLISHABLE_KEY_TEST = 'pk_test_51N9va6BN4zP2cNNUC13AU2YRhukbIX01xUKoggNBsdxpbyR1KJKGL5AbcUwgBaAN2iofOpxn8S1gUO8uyZm2hBNH00Heo0LJxF';
const STRIPE_PUBLISHABLE_KEY_LIVE = 'pk_live_XXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with your Live Key

// **Select the appropriate Stripe Publishable Key based on the mode**
const stripePublishableKey = STRIPE_MODE === 'live' ? STRIPE_PUBLISHABLE_KEY_LIVE : STRIPE_PUBLISHABLE_KEY_TEST;

// **Initialize Stripe.js with the selected Publishable Key**
const stripePromise = loadStripe(stripePublishableKey);

const CheckoutForm = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const data = await fetchData(`${BACKEND_URL}/api/cart/${user.id}`);
                setCartItems(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError('Failed to load cart. Please try again.');
                setCartItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [isAuthenticated, user, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe.js has not loaded yet.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setIsLoading(true);

        try {
            // Create PaymentIntent on the backend
            const response = await fetch(`${BACKEND_URL}/api/checkout/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, items: cartItems, mode: STRIPE_MODE }),
            });

            const data = await response.json();

            if (!data.clientSecret) {
                throw new Error('Failed to create payment intent');
            }

            // Confirm payment with Stripe.js
            const cardElement = elements.getElement(CardElement);
            const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });

            if (paymentResult.error) {
                console.error('Stripe payment failed:', paymentResult.error.message);
                setError(paymentResult.error.message);
            } else if (paymentResult.paymentIntent.status === 'succeeded') {
                console.log('Payment successful');
                navigate('/checkedout');
            }
        } catch (err) {
            console.error('Payment failed:', err);
            setError('Failed to process payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <form onSubmit={handlePayment}>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.productId}>
                                <h2>{item.name}</h2>
                                <p>Quantity: {item.quantity}</p>
                                <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <CardElement /> {/* Securely collect card details */}
                    <button type="submit" disabled={!stripe || isLoading}>
                        {isLoading ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

const Checkout = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default Checkout;
