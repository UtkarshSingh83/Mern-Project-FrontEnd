import { Link } from "react-router-dom";

function Header() {
    return (
        <>
            <div className="container-fluid text-center">
                <Link to="/">Home</Link>
                <br></br>
                <Link to="/login">Login</Link>
                <br></br>
                <Link to="/register">Register</Link>
            </div>
        </>
    );
}

export default Header;
