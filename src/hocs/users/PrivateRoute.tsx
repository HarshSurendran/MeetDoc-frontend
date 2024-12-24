import React from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/appStore";
import { Navigate } from "react-router-dom";


interface PrivateRoute {
    component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRoute> = ({ component: Component }) => {
    const isAuthenticated = useSelector((state: RootState) =>  state.user.isAuthenticated);    
    return isAuthenticated? <Component /> : <Navigate to={"/login"} />
}

export default PrivateRoute;
