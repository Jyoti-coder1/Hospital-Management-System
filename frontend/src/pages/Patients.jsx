import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Patients = () => {
    const { authAxios } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const res = await authAxios.get("/api/patients");
        setPatients(res.data);
    };

    const filteredPatients = patients.filter((p) =>
        p.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const exportPDF = (id) => {
        window.open(`/api/patients/${id}/export`, "_blank");
    };

    return (
        <div>
            <h2>Patients</h2>

            <input
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((p) => (
                        <tr key={p._id}>
                            <td>{p.user?.name}</td>
                            <td>{p.age}</td>
                            <td>{p.gender}</td>
                            <td>
                                <button onClick={() => exportPDF(p._id)}>Export PDF</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Patients;