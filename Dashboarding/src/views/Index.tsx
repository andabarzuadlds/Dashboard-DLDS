import NavBarTailwind from "../components/NavBarTailwind";
import Login from "../components/Login";
import Logout from "../components/Logout";

export default function Index() {
    return(
        <div>
            <NavBarTailwind/>
            <br />
            <Login />   
            <Logout/>
        </div>
        
    )
    
}