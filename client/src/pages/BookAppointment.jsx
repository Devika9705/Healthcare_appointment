import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function BookAppointment() {
  const { doctorId } = useParams();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState("");

  useEffect(() => {
    if (date) {
      fetchSlots();
    }
  }, [date]);

  const fetchSlots = async () => {
    try {
      const res = await API.get(
        `/doctors/${doctorId}/slots?date=${date}`
      );

      setSlots(res.data.slots);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/appointments",
        {
          doctorId,
          date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          symptoms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment Booked Successfully 🎉");

      fetchSlots();

    } catch (err) {
      alert(err.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8">
        Book Appointment
      </h1>

      <label className="font-semibold">
        Select Date
      </label>

      <input
        type="date"
        className="border w-full p-3 rounded mt-2 mb-6"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <h2 className="text-2xl font-bold mb-4">
        Available Slots
      </h2>

      <div className="grid grid-cols-4 gap-4">

        {slots.map((slot) => (

          <button
            key={slot.startTime}
            disabled={!slot.available}
            onClick={() => setSelectedSlot(slot)}
            className={`p-3 rounded font-semibold
            ${
              slot.available
                ? selectedSlot?.startTime === slot.startTime
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {slot.startTime}
          </button>

        ))}

      </div>

      <textarea
        placeholder="Symptoms"
        className="border w-full p-4 rounded mt-8"
        rows="4"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleBooking}
        className="bg-green-600 text-white px-8 py-3 rounded mt-6"
      >
        Confirm Appointment
      </button>

    </div>
  );
}

export default BookAppointment;