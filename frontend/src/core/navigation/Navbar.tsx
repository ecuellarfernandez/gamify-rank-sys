import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="w-full flex items-center justify-between bg-gray-800 px-6 py-3 text-white shadow">
            <div className="font-bold text-lg">Gamify Rank System</div>
            <div className="flex items-center gap-6">
                <Link to="/" className="hover:underline">
                    Ranking
                </Link>
                <Link to="/actividades" className="hover:underline">
                    Actividades
                </Link>
                {user && (
                    <>
                        <div className="flex flex-col items-end">
                            <span className="font-semibold">{user.name}</span>
                            <span className="text-xs text-gray-300">{user.email}</span>
                            {user.total_points !== undefined && (
                                <span className="text-xs text-yellow-300 font-bold">
                                    {user.total_points} puntos
                                </span>
                            )}
                        </div>
                        <button
                            onClick={logout}
                            className="ml-4 px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}