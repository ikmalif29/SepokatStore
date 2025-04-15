import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent: React.FC = () => {
  return (
    <MapContainer center={[-6.894651, 107.570424]} zoom={17} style={{ height: "400px", width: "100%" ,zIndex: 0}}>
      {/* Gunakan OpenStreetMap sebagai TileLayer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker di Universitas Nasional PASIM Bandung */}
      <Marker position={[-6.894651, 107.570424]}>
        <Popup>
          Universitas Nasional PASIM Bandung
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;