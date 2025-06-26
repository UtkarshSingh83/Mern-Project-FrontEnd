import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Logout({updateUserDetails}){
    
const navigate = useNavigate();
const handleLogout = async ()=>{
 try {
     await axios.post('http://localhost:5000/auth/logout', {}, {
         withCredentials: true // this is important to send cookies with the request
     });
     updateUserDetails(null); // Clear user state

 }catch (error) {
     console.error('Logout faicled:', error);
     navigate('/error')
 }
};
    useEffect(() => {
        handleLogout();
    }, []);

}
export default Logout;