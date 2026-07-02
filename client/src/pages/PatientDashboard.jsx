import { useEffect, useState } from "react";
import API from "../services/api";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment Cancelled");

      fetchAppointments();

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        My Appointments
      </h1>

      {appointments.length === 0 ? (
        <h2 className="text-xl text-gray-500">
          No appointments found.
        </h2>
      ) : (
        <div className="space-y-6">

          {appointments.map((appointment) => (

            <div
              key={appointment.id}
              className="border rounded-xl p-6 shadow"
            >
              <h2 className="text-2xl font-bold">
                Dr. {appointment.doctor.user.name}
              </h2>

              <p>
                <strong>Specialization:</strong>{" "}
                {appointment.doctor.specialization}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.date).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.startTime} - {appointment.endTime}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>

              <p>
                <strong>Symptoms:</strong>{" "}
                {appointment.symptoms || "N/A"}
              </p>

              {appointment.status === "BOOKED" && (
                <button
                  onClick={() => cancelAppointment(appointment.id)}
                  className="bg-red-600 text-white px-6 py-2 rounded mt-4"
                >
                  Cancel Appointment
                </button>
              )}
            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default PatientDashboard;