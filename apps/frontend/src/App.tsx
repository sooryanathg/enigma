import { useState, useEffect } from "react";
import AppRouter from "./router";
import { LoadingScreen } from "./components/home/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? <LoadingScreen /> : <AppRouter />}
    </>
  );
}

export default App;
