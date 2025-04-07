import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="foodfolio-app">
      <Navbar />
      <main className="container pt-5">
        <Outlet />
      </main>
      <footer className="mt-5 py-3 text-center text-muted">
        <p>&copy; 2025 Foodfolio - Find and save your favorite recipes</p>
      </footer>
    </div>
  );
}

export default App;
