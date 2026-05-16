import {Outlet, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from "react"

const Body = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error);
      // Redirect unauthenticated or failed auth checks to a login page.
      if (window.location.pathname.startsWith("/admin")) {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
    }
  };
  
  //adding user to our store as soon as our component is loaded.
  useEffect(()=>{
    if(!userData){
      fetchUser();
    }
  },[])

  return (
    <div className="scrollbar">
    {/* providing outlet in body,as we created child elements of body in app.jsx */}
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body