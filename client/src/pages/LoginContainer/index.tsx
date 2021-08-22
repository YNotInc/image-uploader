// Import Components
import LoginForm from "../../forms/login/index";

/**
 * Props login container - Update user authorization and authentication when login credentials are provided.
 * @param props.getRole, props.history 
 * @returns  
 */
let LoginContainer = ({getRole}: {getRole: ()=>string }) => {
    return (
        <>
            <LoginForm
                getRole={getRole} 
            />
        </>
    )
} // function

export default LoginContainer;