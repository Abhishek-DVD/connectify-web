/* eslint-disable react/prop-types */
const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = user;
  const displayPhotoUrl = photoUrl || "https://image.pngaaa.com/853/3873853-middle.png";

  return (
    <div className="flex justify-center w-full mt-6 mb-16">
      <div className="relative w-full max-w-xs md:max-w-sm rounded-lg shadow-xl overflow-hidden">
        {/* Background Image */}
        <img
          src={displayPhotoUrl}
          alt="User"
          className="w-full h-80 object-cover"
        />

        {/* Overlay Text Content */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-lg font-bold">{firstName + " " + (lastName ? lastName : "")}</h2>
          {age && gender && <p className="text-sm opacity-80">{age + ", " + gender}</p>}
          <p className="text-xs opacity-90">{about}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
