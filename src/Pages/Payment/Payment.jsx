import { useContext, useState } from "react";
import LayOut from "../../Componenets/Layout/LayOut";
import classes from "./Payment.module.css";
import { DataContext } from "../../Componenets/DataProvider/DataProvider";
import ProductCard from "../../Componenets/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Componenets/Product/CurrencyFormat";
import { axiosInstance } from "../../api/axios";
import { GridLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.types";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);

  // Calculate the total price of items in the basket
  const total = basket.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const handleChange = (e) => {
    if (e.error) {
      setError(e.error.message);
    } else {
      setError(null);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // If Stripe.js hasn't loaded yet
    }

    try {
      setProcessing(true); // Disable button during processing

      // Create payment intent on the backend
      const response = await axiosInstance({
        method: "post",
        url: `/payment/create?total=${total * 100}`, // Send total in cents
      });

      const clientSecret = response.data.clientSecret;
      if (!clientSecret) {
        throw new Error("Failed to get clientSecret");
      }

      // Confirm card payment using Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (stripeError) {
        console.error("Payment error:", stripeError);
        setError(`Payment failed: ${stripeError.message}`);
      } else {
        console.log("Payment successful", paymentIntent);
        setError(null);

        // Save order in Firestore
        await db
          .collection("users")
          .doc(user.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        // empty basket

        dispatch({ type: Type.EMPTY_BASKET });

        // Redirect to orders page after successful payment
        navigate("/order", { state: { msg: "You have placed a new order" } });
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Something went wrong with the payment. Please try again.");
    } finally {
      setProcessing(false); // Re-enable button after processing
    }
  };

  return (
    <LayOut>
      {/* Header */}
      <div className={classes.payment_header}>Checkout ({totalItem}) items</div>

      {/* Payment method */}
      <section className={classes.Payment}>
        {/* Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Las vegas Nevada</div>
          </div>
        </div>
        <hr />

        {/* Product */}
        <div className={classes.flex}>
          <h3>Review Items and Delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard product={item} flex={true} key={item.id} />
            ))}
          </div>
        </div>

        <hr />

        {/* Payment form */}
        <div className={classes.flex}>
          <h3>Payment Method</h3>

          <div className={classes.Payment_card_container}>
            <div className={classes.Payment__details}>
              <form onSubmit={handlePayment}>
                {/* Error display */}
                {error && <small style={{ color: "red" }}>{error}</small>}

                {/* Card Element */}
                <CardElement onChange={handleChange} />

                {/* Price */}
                <div className={classes.Payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order | </p> <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit">
                    {processing ? (
                      <div className={classes.loader}>
                        <GridLoader color="grey" size={12} />
                        <p>Processing...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
