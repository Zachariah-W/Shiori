import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Layout from "./Layout";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
