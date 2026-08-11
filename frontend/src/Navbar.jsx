import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div
                className="navbar-logo"
                onClick={() => navigate("/record")}
            >
                🎙️ Voice Feedback
            </div>

            <div className="navbar-right">

                <span className="username">
                    👤 {username}
                </span>

                {role === "admin" && (
                    <button
                        className="admin-btn"
                        onClick={() => navigate("/admin")}
                    >
                        Admin
                    </button>
                )}

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}