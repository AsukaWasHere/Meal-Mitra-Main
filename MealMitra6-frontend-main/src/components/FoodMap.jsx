import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import API from '../api'; // Your configured axios instance

const socket = io("http://localhost:5001");

const donorIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/emoji/48/000000/green-circle-emoji.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const receiverIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/emoji/48/000000/red-circle-emoji.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const geocodeAddress = async (address) => {
  const query = encodeURIComponent(address);
  const apiKey = 'e809430e7727472da5e0607b1a3ee3ec';
  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return [Number(lat), Number(lng)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// A new component for the popup content
const ListingPopup = ({ listing, onClaim }) => {
    const [claimQuantity, setClaimQuantity] = useState(1);

    const handleClaimClick = () => {
        if (claimQuantity > 0 && claimQuantity <= listing.quantity) {
            onClaim(listing._id, claimQuantity);
        } else {
            alert("Please enter a valid quantity.");
        }
    };

    return (
        <div>
            <h4>{listing.title}</h4>
            <p>By: {listing.donor.name}</p>
            <p>Description: {listing.description}</p>
            <p><b>Available Qty: {listing.quantity}</b></p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <input
                    type="number"
                    min="1"
                    max={listing.quantity}
                    value={claimQuantity}
                    onChange={(e) => setClaimQuantity(Number(e.target.value))}
                    style={{ width: '60px', marginRight: '10px', padding: '5px' }}
                />
                <button onClick={handleClaimClick}>Claim</button>
            </div>
        </div>
    );
};


export default function FoodMap() {
  const [listings, setListings] = useState([]);
  const [receivers] = useState([
    { id: 'rec1', name: 'Charity Home Delhi', position: [28.6167, 77.2083] }
  ]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/api/listings');
      if (data.success) {
        const geocodedListings = await Promise.all(
          data.listings.map(async (listing) => {
            const position = await geocodeAddress(listing.location);
            return { ...listing, position };
          })
        );
        setListings(geocodedListings.filter(l => l.position));
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    socket.on("update-listings", fetchListings);
    return () => {
      socket.off("update-listings");
    };
  }, []);

  const handleClaim = async (listingId, claimQuantity) => {
    try {
      await API.post(`/api/listings/claim/${listingId}`, { claimQuantity });
      alert('✅ Claim submitted successfully!');
    } catch (error) {
      console.error("Error claiming listing:", error);
      alert(error.response?.data?.message || "Failed to claim food. You must be logged in as a receiver.");
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {loading && (
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <p>Loading Donations...</p>
            </div>
        )}
      <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {listings.map(listing => (
          <Marker key={listing._id} position={listing.position} icon={donorIcon}>
            <Popup>
                <ListingPopup listing={listing} onClaim={handleClaim} />
            </Popup>
          </Marker>
        ))}
        {receivers.map(receiver => (
            <Marker key={receiver.id} position={receiver.position} icon={receiverIcon}>
                <Popup><h4>{receiver.name}</h4><p>Verified Receiver</p></Popup>
            </Marker>
        ))}
      </MapContainer>
    </div>
  );
}