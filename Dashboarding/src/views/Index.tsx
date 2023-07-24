import NavBarTailwind from "../components/NavBarTailwind";
import LoginController from "../components/LoginController";
import LogoutController from "../components/LogoutController";

export default function Index() {
    return(
        <div>
            <NavBarTailwind/>
            <br />
            <LoginController />   
            <LogoutController/>
        </div>
        
    )
    
}