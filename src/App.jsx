import { useContext, useEffect } from "react";
import "./App.css";
import Routing from "./Router";
import { DataContext } from "./Componenets/DataProvider/DataProvider";
import { Type } from "./Utility/action.types";
import { auth } from "./Utility/firebase";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // If user is authenticated
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      } else {
        // If user is not authenticated
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return <Routing />;
}

export default App;
