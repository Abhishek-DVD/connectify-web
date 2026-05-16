import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  //part of store we are subscribing to 
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async() => {
    try{
       await axios.post(BASE_URL+'/logout',{},{
        withCredentials:true,
      });
      dispatch(removeUser());
      return navigate("/login");
    }catch(err){
      //redirect to error page
      console.log(err);
    }
  }

  if (!user) {
    return (
      <div className="navbar bg-base-300 gap-6">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">💻 Connectify</Link>
        </div>
        <div className="flex-none flex flex-col sm:flex-row gap-2">
          <Link to="/login" className="btn btn-primary">Login / Signup</Link>
          <Link to="/admin/login" className="btn btn-ghost">Admin Login</Link>
        </div>
      </div>
    )
  }

  return (
    <><div className="navbar bg-base-300 gap-6 hidden md:flex">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">💻 Connectify</Link>
    </div>
    {user && (<div className="flex-none sm:gap-2">
      <div className="form-control">Welcome,{user.firstName}</div>
      {/* only we can see the photo and profile section when the user is logged in  */}
      <div className="dropdown dropdown-end mx-5 flex">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="user photo"
              src={user.photoUrl}/>
          </div>
        </div>
        {user.isAdmin ? (<ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <Link to="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>) : 
        (<ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <Link to="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>
          <li><Link to="/">Feed</Link></li>
          <li><Link to="/connections">Connections</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/premium">Premium</Link></li>
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>)}
        
      </div>
    </div>)}
  </div>
  
  <div className="navbar bg-base-100 md:hidden">
    <div className="navbar-start">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <Link to="/profile" className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>
          <li><Link to="/">Feed</Link></li>
          <li><Link to="/connections">Connections</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/premium">Premium</Link></li>
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>
    </div>
    <div className="navbar-end">
      <a className="btn btn-ghost text-xl">💻 Connectify</a>
    </div>
  </div>
  
  </>
  )
}

export default Navbar