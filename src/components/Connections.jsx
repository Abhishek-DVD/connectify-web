import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load connections.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return <h1 className="text-center text-white text-2xl my-20">Loading connections...</h1>;
  if (error) return <h1 className="text-center text-red-400 text-2xl my-20">{error}</h1>;
  if (!connections || connections.length === 0)
    return <h1 className="text-center text-white text-2xl my-20">No Connections Found</h1>;

  return (
    <div className="my-20 text-center min-h-screen pb-20">
      <h1 className="font-bold text-white text-3xl mb-6">Connections</h1>
      
      <div className="flex flex-col items-center gap-4 ">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
          return (
            <div
              className="flex flex-col md:flex-row items-center bg-base-300 w-full max-w-2xl rounded-lg shadow-lg p-4 md:p-6"
              key={_id}
            >
              {/* User Image */}
              <div className="flex-shrink-0">
                <img
                  alt="User"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-2 border-primary"
                  src={photoUrl}
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left md:ml-6 flex-1">
                <h2 className="text-xl font-semibold">
                  {firstName} {lastName?lastName:""}
                </h2>
                {age && gender && <p className="text-gray-300">{age}, {gender}</p>}
                <p className="text-gray-400 mt-2">{about}</p>

                {/* Chat Button */}
                <div className="mt-4">
                  <Link to={"/chat/" + _id}>
                    <button className="btn btn-primary w-full md:w-auto">Chat</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
