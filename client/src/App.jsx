import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route
          path="/book/:doctorId"
          element={<BookAppointment />}
        />
        <Route
  path="/dashboard"
  element={<PatientDashboard />}
/>
<Route
  path="/doctor-dashboard"
  element={<DoctorDashboard />}
/>
      </Routes>
    </>
  );
}

export default App;