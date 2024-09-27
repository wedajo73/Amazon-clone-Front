import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Order from "./Pages/Orders/Order";
import Cart from "./Pages/Cart/Cart";
import Result from "./Pages/Result/Result";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Product from "./Componenets/Product/product";
import Loader from "./Componenets/Loader/Loader";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./Componenets/protectedRoute/ProtetctedRoute";

const stripePromise = loadStripe(
  "pk_test_51Q3CtARti6K7FPQmrII4HoCrQStT3iwAn4fSIK9j4PcqE0aSIO1hTmrXJTcJobPVIAGBowooaKfcRYFIoGGIMLmp00dAhduJiK"
);

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              msg={"You must log in to proceed to payment"}
              redirect={"/payment"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute
              msg={"You must log in to access your order"}
              redirect={"/order"}
            >
              <Order />
            </ProtectedRoute>
          }
        />
        <Route path="/Product" element={<Product />} />
        <Route path="/category/:categoryName" element={<Result />} />
        <Route path="/Loader" element={<Loader />} />
        <Route path="/products/:productID" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default Routing;

// / → Landing page
// /auth → SignUp page
// /payment → Payment page
// /order → Order page
// /cart → Cart page
