import React from "react";

interface LoginButtonProps {
    onLogin: () => void; 
}

const LoginButton: React.FC<LoginButtonProps> = ({ onLogin }) => {
    return <button onClick={onLogin} className="btn btn-primary">Login</button>;
}   
export default LoginButton;
