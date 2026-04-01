import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt="" />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.remainingSlots ?? item.capacity} slots</span>
            <b>LKR {item.rent}/month</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
