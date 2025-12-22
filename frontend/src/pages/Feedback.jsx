import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Feedback = () => {
    const { authAxios, user } = useContext(AuthContext);
    const [feedbacks, setFeedbacks] = useState([]);
    const [form, setForm] = useState({
        patient: "",
        doctor: "",
        rating: 5,
        comments: ""
    });

    useEffect(() => {
        if (user.role === "doctor") {
            fetchDoctorFeedback();
        }
    }, []);

    const fetchDoctorFeedback = async () => {
        const res = await authAxios.get(`/api/feedback/${user._id}`);
        setFeedbacks(res.data);
    };

    const submitFeedback = async () => {
        await authAxios.post("/api/feedback", form);
        alert("Feedback submitted");
    };

    return (
        <div>
            <h2>Feedback</h2>

            {user.role === "patient" && (
                <>
                    <input
                        placeholder="Patient ID"
                        onChange={(e) => setForm({ ...form, patient: e.target.value })}
                    />
                    <input
                        placeholder="Doctor ID"
                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    />
                    <input
                        type="number"
                        min="1"
                        max="5"
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    />
                    <textarea
                        placeholder="Comments"
                        onChange={(e) => setForm({ ...form, comments: e.target.value })}
                    />
                    <button onClick={submitFeedback}>Submit</button>
                </>
            )}

            {user.role !== "patient" && (
                <ul>
                    {feedbacks.map((f) => (
                        <li key={f._id}>
                            ⭐ {f.rating} - {f.comments}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Feedback;