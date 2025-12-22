import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Appointments = () => {
    const { authAxios } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({
        patient: "",
        doctor: "",
        date: ""
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const res = await authAxios.get("/api/appointments");
        setAppointments(res.data);
    };

    const bookAppointment = async () => {
        await authAxios.post("/api/appointments", form);
        alert("Appointment booked");
        fetchAppointments();
    };

    const cancelAppointment = async (id) => {
        await authAxios.delete(`/api/appointments/${id}`);
        fetchAppointments();
    };

    return (
        <div>
            <h2>Appointments</h2>

            <input
                placeholder="Patient ID"
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
            />
            <input
                placeholder="Doctor ID"
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
            />
            <input
                type="datetime-local"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <button onClick={bookAppointment}>Book</button>

            <ul>
                {appointments.map((a) => (
                    <li key={a._id}>
                        {a.date} - {a.status}
                        <button onClick={() => cancelAppointment(a._id)}>Cancel</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Appointments;