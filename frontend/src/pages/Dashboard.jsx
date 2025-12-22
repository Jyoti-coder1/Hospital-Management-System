import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Charts from "../components/Charts";

const Dashboard = () => {
    const { authAxios } = useContext(AuthContext);
    const [stats, setStats] = useState({ patients: 0, appointments: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const patientsRes = await authAxios.get("/api/patients");
            const appointmentsRes = await authAxios.get("/api/appointments");
            setStats({
                patients: patientsRes.data.length,
                appointments: appointmentsRes.data.length
            });
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Total Patients: {stats.patients}</p>
            <p>Total Appointments: {stats.appointments}</p>
            <Charts stats={stats} />
        </div>
    );
};

export default Dashboard;