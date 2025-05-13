import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const AppointmentSystem = () => {
  const [workingStart, setWorkingStart] = useState("09:00");
  const [workingEnd, setWorkingEnd] = useState("17:00");
  const [appointments, setAppointments] = useState([]); // [{start: dayjs, end: dayjs}]
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confirmation, setConfirmation] = useState("");
  const [adminInput, setAdminInput] = useState("");

  const duration = 30;

  const parseTime = (timeStr) => dayjs(`2025-05-13 ${timeStr}`);

  const isOverlapping = (newStart, newEnd) => {
    return appointments.some(({ start, end }) => {
      return !(newEnd.isSameOrBefore(start) || newStart.isSameOrAfter(end));
    });
  };

  const generateAvailableSlots = () => {
    const slots = [];
    let slotStart = parseTime(workingStart);
    const slotEndTime = parseTime(workingEnd);

    while (slotStart.add(duration, "minute").isSameOrBefore(slotEndTime)) {
      const slotEnd = slotStart.add(duration, "minute");
      if (!isOverlapping(slotStart, slotEnd)) {
        slots.push(slotStart.format("HH:mm"));
      }
      slotStart = slotStart.add(15, "minute");
    }
    setAvailableSlots(slots);
  };

  const bookAppointment = (timeStr) => {
    const start = parseTime(timeStr);
    const end = start.add(duration, "minute");
    if (isOverlapping(start, end)) {
      setConfirmation("Slot unavailable.");
    } else {
      setAppointments([...appointments, { start, end }]);
      setConfirmation(`Booked: ${start.format("HH:mm")} - ${end.format("HH:mm")}`);
    }
  };

  const adminBookSlot = () => {
    if (!adminInput) return;
    const start = parseTime(adminInput);
    const end = start.add(duration, "minute");
    setAppointments([...appointments, { start, end }]);
    setAdminInput("");
  };

  useEffect(() => {
    generateAvailableSlots();
    setConfirmation("");
  }, [appointments, workingStart, workingEnd]);

  const handleDateChange = () => {
    // Reset state for new day
    setAppointments([]);
    setConfirmation("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Appointment Slot Booker</h1>
      <div className="mb-2">Working Hours: {workingStart} - {workingEnd}</div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {availableSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => bookAppointment(slot)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {slot}
          </button>
        ))}
      </div>

      {confirmation && (
        <div className="text-blue-700 font-semibold mb-4">{confirmation}</div>
      )}

      <div className="mb-4">
        <label className="block font-semibold">Change Date (simulates new day):</label>
        <button
          onClick={handleDateChange}
          className="mt-1 bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
        >
          Reset Bookings
        </button>
      </div>

      <div>
        <label className="block font-semibold">Admin: Pre-book Slot (e.g., "10:30")</label>
        <input
          type="text"
          value={adminInput}
          onChange={(e) => setAdminInput(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={adminBookSlot}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Mark Booked
        </button>
      </div>
    </div>
  );
};

export default AppointmentSystem;
