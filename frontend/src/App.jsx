import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from "./Login";
import Recorder from "./Recorder";
import Admin from "./Admin";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

export default function App(){

    const token = localStorage.getItem("token");

    return(

        <BrowserRouter>
            {token && <Navbar />}

            <Routes>

                <Route path="/" element={<Login/>}/>

                <Route path="/record" element={<Recorder/>}/>

                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                }
                />

                <Route path="*" element={<Login />}/>

            </Routes>

        </BrowserRouter>

    )

}