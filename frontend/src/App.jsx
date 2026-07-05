import { RouterProvider } from "react-router-dom";
import router from "./shared/routes";

export default function App() {
    return <RouterProvider router={router} />;
}
