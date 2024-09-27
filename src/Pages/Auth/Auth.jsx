import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import { useState, useContext } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { GridLoader } from "react-spinners";
import { DataContext } from "../../Componenets/DataProvider/DataProvider";

// Define Type if it's missing
const Type = {
  SET_USER: "SET_USER",
};

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [{ user }, dispatch] = useContext(DataContext);
  const [loading, setLoading] = useState({
    signIn: false,
    signUp: false,
  });

  const navigate = useNavigate();
  const navStateData = useLocation();
console.log(navStateData)


  const authHandler = async (e) => {
    e.preventDefault();

    // Prevent submission if already loading
    if (loading.signIn || loading.signUp) return;

    if (email === "" || password === "") {
      setError("Email and Password must not be empty");
      return;
    }

    if (e.target.name === "signIn") {
      setLoading({ ...loading, signIn: true });

      signInWithEmailAndPassword(auth, email, password)
        .then((userinfo) => {
          dispatch({
            type: Type.SET_USER,
            user: userinfo.user,
          });
          setLoading({ ...loading, signIn: false });
          navigate(navStateData?.state?.redirect || "/"); 
          // Navigate after successful sign in
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signIn: false });
        });
    } else {
      setLoading({ ...loading, signUp: true });

      createUserWithEmailAndPassword(auth, email, password)
        .then((userinfo) => {
          dispatch({
            type: Type.SET_USER,
            user: userinfo.user,
          });
          setLoading({ ...loading, signUp: false });
            navigate(navStateData?.state?.redirect || "/");
          // Navigate after successful sign up
        })
        .catch((err) => {
          setError(err.message);
          setLoading({ ...loading, signUp: false });
        });
    }
  };

  return (
    <section className={classes.login}>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Amazon_2024.svg/1920px-Amazon_2024.svg.png"
          alt="Amazon Logo"
        />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {navStateData.state?.msg && (
          <small
            style={{
              textAlign: "center",
              padding: "5px",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {navStateData.state.msg}
          </small>
        )}
        <form action="">
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
          </div>
          <button
            type="submit"
            onClick={authHandler}
            name="signIn"
            className={classes.login_signinButton}
            disabled={loading.signIn} // Disable while loading
          >
            {loading.signIn ? (
              <GridLoader color="black" size={15} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p>
          Welcome to Amazon-clone. By signing in, you agree to Amazon's terms
          and conditions.
        </p>

        <button
          type="submit"
          onClick={authHandler}
          name="signUp"
          className={classes.login_registerbutton}
          disabled={loading.signUp} // Disable while loading
        >
          {loading.signUp ? (
            <GridLoader color="black" size={15} />
          ) : (
            "Create Your Amazon Account"
          )}
        </button>

        {error && <p style={{ padding: "5px", color: "red" }}>{error}</p>}
      </div>
    </section>
  );
}

export default Auth;
