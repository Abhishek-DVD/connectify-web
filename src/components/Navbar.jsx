import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  //part of store we are subscribing to 
  const user = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timerId = setTimeout(async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/search", {
          withCredentials: true,
          params: {
            query,
            limit: 8,
          },
        });
        setSearchResults(res?.data?.users || []);
      } catch (err) {
        console.log(err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
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

  const handleSearchResultClick = (targetUserId) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    navigate("/chat/" + targetUserId);
  }

  const handleSendRequest = async (event, targetUserId) => {
    event.stopPropagation();

    try {
      await axios.post(BASE_URL + "/request/send/interested/" + targetUserId, {}, {
        withCredentials: true,
      });

      setSearchResults((users) =>
        users.map((searchedUser) =>
          searchedUser._id === targetUserId
            ? {...searchedUser, relationshipStatus:"sent"}
            : searchedUser
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  const renderRelationshipAction = (searchedUser) => {
    const status = searchedUser.relationshipStatus;

    if (status === "none") {
      return (
        <button
          type="button"
          onClick={(event) => handleSendRequest(event, searchedUser._id)}
          className="btn btn-primary btn-xs shrink-0">
          Send
        </button>
      );
    }

    if (status === "connected") {
      return <span className="badge badge-success shrink-0">Connected</span>;
    }

    if (status === "sent") {
      return <span className="badge badge-warning shrink-0">Pending</span>;
    }

    if (status === "received") {
      return <span className="badge badge-info shrink-0">Received</span>;
    }

    return <span className="badge badge-ghost shrink-0">Viewed</span>;
  }

  const renderSearchBox = (mobile = false) => (
    <div className={mobile ? "relative w-full px-3 pb-3" : "relative w-full max-w-md"}>
      <label className="input input-bordered flex items-center gap-2 h-10 bg-base-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
        </svg>
        <input
          type="text"
          className="grow text-sm"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
        />
        {isSearching && <span className="loading loading-spinner loading-xs"></span>}
      </label>

      {showSearchResults && searchQuery.trim().length >= 2 && (
        <div className="absolute left-3 right-3 md:left-0 md:right-0 top-12 z-50 overflow-hidden rounded-lg bg-base-100 shadow-xl border border-base-300">
          {searchResults.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {searchResults.map((searchedUser) => (
                <li key={searchedUser._id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSearchResultClick(searchedUser._id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSearchResultClick(searchedUser._id);
                      }
                    }}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-base-200 transition-colors">
                    <span className="flex min-w-0 items-center gap-3">
                      <img
                        src={searchedUser.photoUrl}
                        alt={searchedUser.firstName + " " + (searchedUser.lastName || "")}
                        className="h-10 w-10 rounded-full object-cover border border-base-300"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {searchedUser.firstName + " " + (searchedUser.lastName || "")}
                        </span>
                        {searchedUser.about && (
                          <span className="block truncate text-xs opacity-70">{searchedUser.about}</span>
                        )}
                      </span>
                    </span>
                    {renderRelationshipAction(searchedUser)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm opacity-70">
              {isSearching ? "Searching..." : "No matching users found"}
            </div>
          )}
        </div>
      )}
    </div>
  );

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
    <div ref={searchContainerRef}>
    <div className="navbar bg-base-300 gap-6 hidden md:flex">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">💻 Connectify</Link>
    </div>
    {renderSearchBox()}
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
  <div className="bg-base-100 md:hidden">
    {renderSearchBox(true)}
  </div>
  
  </div>
  )
}

export default Navbar
