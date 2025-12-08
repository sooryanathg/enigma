import { useState } from "react";
import AppRouter from "./router";
import { LoadingScreen } from "./components/home/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen
          loadingDelay={3000}
          onComplete={() => setIsLoading(false)}
        />
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default App;
