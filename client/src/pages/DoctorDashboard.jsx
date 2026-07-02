import { useEffect, useState } from "react";
import API from "../services/api";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctorNotes, setDoctorNotes] = useState({});
  const [prescriptions, setPrescriptions] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/doctors/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const completeAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/appointments/${id}/complete`,
        {
          doctorNotes: doctorNotes[id] || "",
          prescription: prescriptions[id] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment Completed Successfully ✅");

      fetchAppointments();

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Doctor Dashboard
      </h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">
          No appointments found.
        </p>
      ) : (
        <div className="space-y-6">

          {appointments.map((appointment) => (

            <div
              key={appointment.id}
              className="border rounded-xl shadow p-6"
            >
              <h2 className="text-2xl font-bold">
                {appointment.patient.user.name}
              </h2>

              <p className="mt-2">
                📅 {new Date(appointment.date).toLocaleDateString()}
              </p>

              <p>
                🕒 {appointment.startTime} - {appointment.endTime}
              </p>

              <p className="mt-2">
                <strong>Symptoms:</strong>{" "}
                {appointment.symptoms || "N/A"}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="text-blue-600 font-bold">
                  {appointment.status}
                </span>
              </p>

              {appointment.status === "BOOKED" && (
                <>
                  <textarea
                    placeholder="Doctor Notes"
                    className="border w-full p-3 rounded mt-4"
                    value={doctorNotes[appointment.id] || ""}
                    onChange={(e) =>
                      setDoctorNotes({
                        ...doctorNotes,
                        [appointment.id]: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Prescription"
                    className="border w-full p-3 rounded mt-4"
                    value={prescriptions[appointment.id] || ""}
                    onChange={(e) =>
                      setPrescriptions({
                        ...prescriptions,
                        [appointment.id]: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() =>
                      completeAppointment(appointment.id)
                    }
                    className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
                  >
                    Complete Appointment
                  </button>
                </>
              )}

              {appointment.status === "COMPLETED" && (
                <div className="mt-4 bg-green-50 p-4 rounded">
                  <p>
                    <strong>Doctor Notes:</strong>
                  </p>
                  <p>{appointment.doctorNotes || "N/A"}</p>

                  <p className="mt-3">
                    <strong>Prescription:</strong>
                  </p>
                  <p>{appointment.prescription || "N/A"}</p>
                </div>
              )}
            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default DoctorDashboard;