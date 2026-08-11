import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "admin") {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: "100px"
                }}
            >
                <h1>🚫 Unauthorized Access</h1>

                <p>
                    You do not have permission to access this page.
                </p>

                <button
                    onClick={() => window.location.href = "/record"}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return children;
}