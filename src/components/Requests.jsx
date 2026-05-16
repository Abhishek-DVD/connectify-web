import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";


const Requests = () => {

    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.requests);
    const [showButtons,setShowButtons] = useState(true);

  const fetchRequests = async ()=>{
    try{
       const res = await axios.get(BASE_URL+"/user/requests/received",{
         withCredentials:true,
       })
       console.log(res);
       dispatch(addRequests(res?.data?.userRequests));
    }catch(err){
        console.log(err);
    }
  }

  const reviewRequests = async (status,_id) => {
    try{
      const res = await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{
        withCredentials:true,
      });
      console.log(res);
      dispatch(removeRequests(_id));
    }catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    fetchRequests();
  },[])

  if(!requests) return;

  if(requests.length===0) return <h1 className="flex justify-center">No requests found.</h1>

  return (
    <div className="my-20 text-center">
      <h1 className="font-bold text-white text-3xl">Requests</h1>
      {requests.map((request)=>{
        const{firstName,lastName,photoUrl,age,gender,about} = request.fromUserId;
        const id = request._id;
        return (
            <div className="flex m-4 p-4 rounded-lg bg-base-300 w-auto md:w-1/3 mx-auto" key={id}>
            <div>
                <img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl}/>
            </div>
            <div className="text-left mx-4">
                <h1>{firstName+""+lastName}</h1>
                  {age && gender && <p>{age+", "+gender}</p>}
                <p>{about}</p>
            </div>
            <div className="flex flex-row">
                <button className="btn btn-primary mx-2" onClick={()=>reviewRequests("rejected",id)}>Reject</button>
                <button className="btn btn-secondary mx-2"  onClick={()=>reviewRequests("accepted",id)}>Accept</button>
            </div>
            </div>
        )
      })}
    </div>
  )
}

export default Requests