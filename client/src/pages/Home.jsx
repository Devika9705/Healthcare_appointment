import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(res.data.doctors);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold">
            Book Your Doctor Appointment
          </h1>

          <p className="mt-5 text-xl">
            Find experienced doctors and book appointments online.
          </p>
        </div>
      </section>

      {/* Doctors */}
      <section className="max-w-6xl mx-auto py-14 px-6">
        <h2 className="text-3xl font-bold mb-8">
          Available Doctors
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="shadow-lg rounded-xl p-6 border hover:shadow-xl transition"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                alt="Doctor"
                className="w-24 mx-auto"
              />

              <h3 className="text-xl font-bold mt-4 text-center">
                {doctor.user.name}
              </h3>

              <p className="text-gray-500 text-center">
                {doctor.specialization}
              </p>

              <p className="text-center mt-2">
                {doctor.workingStart} - {doctor.workingEnd}
              </p>

              <Link to={`/book/${doctor.id}`}>
                <button className="bg-blue-600 text-white w-full mt-5 py-2 rounded-lg hover:bg-blue-700">
                  Book Appointment
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;