import Router from "./router";
import { AuthProvider } from "./providers/auth";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
