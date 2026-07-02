import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-5">
        <h2 className="text-2xl font-bold text-blue-600">
          Healthcare
        </h2>

        <div className="space-x-6 flex items-center">
          <Link to="/">Home</Link>

          <Link to="/doctors">Doctors</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              {/* Patient Dashboard */}
              {user.role === "PATIENT" && (
                <Link to="/dashboard">Dashboard</Link>
              )}

              {/* Doctor Dashboard (We'll build this next) */}
              {user.role === "DOCTOR" && (
                <Link to="/doctor-dashboard">Doctor Dashboard</Link>
              )}

              <span className="font-semibold text-blue-600">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;