import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MedicalRecords = () => {
    const { authAxios } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [file, setFile] = useState(null);
    const [patientId, setPatientId] = useState("");

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        const res = await authAxios.get("/api/medical-records");
        setRecords(res.data);
    };

    const uploadRecord = async () => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("patient", patientId);

        await authAxios.post("/api/medical-records", formData);
        alert("Record uploaded");
        fetchRecords();
    };

    return (
        <div>
            <h2>Medical Records</h2>

            <input
                placeholder="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
            />

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={uploadRecord}>Upload</button>

            <ul>
                {records.map((r) => (
                    <li key={r._id}>
                        {r.patient?.user?.name} -{" "}
                        <a href={r.documentUrl} target="_blank">View</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalRecords;