import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./core/routing/ProtectedRoute";
import RankingPage from "./ranking/pages/RankingPage";
import LoginPage from "./login/pages/LoginPage";
import ActivityPage from "./activity/pages/ActivityPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <RankingPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/actividades"
                        element={
                            <ProtectedRoute>
                                <ActivityPage />
                            </ProtectedRoute>
                        }
                        />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;