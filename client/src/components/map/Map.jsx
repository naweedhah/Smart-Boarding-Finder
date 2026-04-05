import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

const HEATMAP_COLORS = {
  high: "#E63946",
  medium: "#F4A261",
  low: "#2A9D8F",
};

function Map({ items, demandAreas = [] }) {
  return (
    <MapContainer
      center={
        items.length === 1
          ? [items[0].latitude, items[0].longitude]
          : [7.8731, 80.7718]
      }
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
      {demandAreas
        .filter((area) => area.latitude != null && area.longitude != null)
        .map((area) => (
          <CircleMarker
            key={area.key}
            center={[area.latitude, area.longitude]}
            radius={Math.max(10, Math.min(28, 8 + area.demandScore))}
            pathOptions={{
              color: HEATMAP_COLORS[area.demandLevel] || HEATMAP_COLORS.low,
              fillColor: HEATMAP_COLORS[area.demandLevel] || HEATMAP_COLORS.low,
              fillOpacity: 0.22,
              weight: 2,
            }}
          >
            <Popup>
              <div className="demandPopup">
                <strong>{area.area}</strong>
                <span>{area.city}</span>
                <span>Demand: {area.demandLevel}</span>
                <span>Searches: {area.searches}</span>
                <span>Inquiries: {area.inquiries}</span>
                <span>Bookings: {area.bookings}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}

export default Map;
