import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Write from "./pages/Write";
import MyBottles from "./pages/MyBottles";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/write" element={<Write />} />
        <Route path="/bottles" element={<MyBottles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;