import { BrowserRouter } from "react-router";
import Router from "./router";
import { AuthProvider } from "./providers/auth";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
