import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email) {
            setError("Email is required");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, { email });
            navigate("/reset-password", { state: { email } });
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to send reset code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword; 