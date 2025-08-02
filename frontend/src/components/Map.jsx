import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ issues, center }) => {
  // Use a default center if none is provided
  const mapCenter = center || [22.3072, 73.1812]; // Default to Vadodara

  return (
    <MapContainer
      center={mapCenter}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {issues.map((issue) => (
        <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
          <Popup>
            <b>{issue.title}</b>
            <br />
            Category: {issue.category}
            <br />
            Status: {issue.status}
          </Popup>
        </Marker>
      ))}
      {/* Marker for the user's current location */}
      {center && <Marker position={center}><Popup>Your Location</Popup></Marker>}
    </MapContainer>
  );
};

export default Map;
