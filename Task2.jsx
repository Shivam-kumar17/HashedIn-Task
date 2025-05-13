import React, { useState, useMemo } from 'react'; import { Button } from "@/components/ui/button";

const WORK_START = 9; // 9:00 AM const WORK_END = 17; // 5:00 PM const SLOT_DURATION = 30; // in minutes

const generateTimeSlots = (startHour, endHour) => { const slots = []; let current = new Date(); current.setHours(startHour, 0, 0, 0); const end = new Date(); end.setHours(endHour, 0, 0, 0);

while (current < end) { const slotTime = current.toTimeString().slice(0, 5); // "HH:MM" slots.push(slotTime); current = new Date(current.getTime() + SLOT_DURATION * 60000); } return slots; };

export default function AppointmentBooker() { const [bookedSlots, setBookedSlots] = useState([]); const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); const [confirmationMessage, setConfirmationMessage] = useState(''); const [adminInput, setAdminInput] = useState('');

const allSlots = useMemo(() => generateTimeSlots(WORK_START, WORK_END), [selectedDate]);

const handleBooking = (slot) => { if (!bookedSlots.includes(slot)) { setBookedSlots([...bookedSlots, slot]); setConfirmationMessage(Appointment booked for ${slot}!); } };

const handleDateChange = (e) => { setSelectedDate(e.target.value); setBookedSlots([]); setConfirmationMessage(''); };

const handleAdminAddSlot = () => { if (adminInput && !bookedSlots.includes(adminInput)) { setBookedSlots([...bookedSlots, adminInput]); setAdminInput(''); } };

return ( <div className="p-6 max-w-xl mx-auto"> <h1 className="text-2xl font-bold mb-4">Appointment Slot Booker</h1>

<div className="mb-4">
    <label className="mr-2 font-medium">Select Date:</label>
    <input
      type="date"
      value={selectedDate}
      onChange={handleDateChange}
      className="border p-2 rounded"
    />
  </div>

  <p className="mb-6">Available from <strong>9:00 AM</strong> to <strong>5:00 PM</strong></p>

  <div className="grid grid-cols-3 gap-4 mb-4">
    {allSlots.map((slot) => (
      <Button
        key={slot}
        disabled={bookedSlots.includes(slot)}
        onClick={() => handleBooking(slot)}
        className={py-2 ${bookedSlots.includes(slot) ? 'bg-gray-300 text-gray-600' : 'bg-green-500 text-white'}}
      >
        {slot}
      </Button>
    ))}
  </div>

  {confirmationMessage && (
    <p className="mb-4 text-green-700 font-medium">{confirmationMessage}</p>
  )}

  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Admin: Add Pre-booked Slot</h2>
    <input
      type="text"
      placeholder="Enter time (e.g., 14:00)"
      value={adminInput}
      onChange={(e) => setAdminInput(e.target.value)}
      className="border p-2 rounded mr-2"
    />
    <Button onClick={handleAdminAddSlot} className="bg-blue-500 text-white">Add</Button>
  </div>
</div>

); }
