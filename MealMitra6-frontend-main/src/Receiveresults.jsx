import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import FoodMap from "./components/FoodMap";

export default function ReceiveResults() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifiedNgos, setVerifiedNgos] = useState(null);

  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const userType = location.state?.userType || 'individual';

  const MOCK_NGO_LIST = [
    "Hope & Hunger Foundation",
    "Community Kitchen Services",
    "Sahara Relief Organization",
  ];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/listings");
        if (response.data && Array.isArray(response.data.listings)) {
          setListings(response.data.listings);
        } else {
          setError("Could not find any listings.");
        }
      } catch (err) {
        setError("Failed to fetch available donations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleVerifyClick = (listing) => {
    setVerifiedNgos({
      listingTitle: listing.title,
      ngos: MOCK_NGO_LIST,
    });
  };

  const handleAddToCart = (listing) => {
    const claimAmount = parseInt(document.getElementById(`claim-quantity-${listing._id}`).value);

    if (!user) {
      alert("Please log in to add items to your cart.");
      return navigate("/login");
    }
    if (isNaN(claimAmount) || claimAmount <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (claimAmount > listing.quantity) {
      alert(`You cannot claim more than the available quantity of ${listing.quantity}.`);
      return;
    }

    const price = userType === 'ngo' ? 0 : (listing.price || 0);
    addToCart(listing, claimAmount, price);
  };

  if (loading) return <div className="text-center py-20">Loading donations...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-green-50 py-12 px-6">
      <h2 className="text-4xl font-extrabold text-green-800 text-center mb-10">
        Live Donations Map & Listings
      </h2>

      <div className="max-w-6xl mx-auto mb-16">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ paddingTop: '40%' }}>
          <div className="absolute top-0 left-0 w-full h-full">
            <FoodMap />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {listings.map((listing) => {
          const price = userType === 'ngo' ? 0 : (listing.price || 0);

          return (
            <div key={listing._id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col">
              {listing.verified && (
                <div
                  className="absolute top-4 right-4 bg-lime-600 text-white text-xs px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => handleVerifyClick(listing)}
                  title="Click to see verification history"
                >
                  ✅ MealMitra Assured
                </div>
              )}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-green-800 mb-2 pr-24">{listing.title}</h3>
                <p className="text-gray-600 mb-3">📍 {listing.location}</p>
                <div className="text-sm text-gray-600 mb-4 space-y-2 pt-2 border-t">
                  <p><strong>Description:</strong> {listing.description}</p>
                  <p><strong>Available:</strong> <span className="text-lg font-semibold text-lime-600">{listing.quantity}</span> servings</p>
                  <p><strong>Donor:</strong> {listing.donor?.name || "Anonymous"}</p>
                  <p className="text-lg font-semibold text-green-700 mt-2">
                    Price: ₹{price} / serving
                  </p>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t">
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor={`claim-quantity-${listing._id}`} className="text-sm font-medium">Claim for (people):</label>
                  <input
                    type="number"
                    id={`claim-quantity-${listing._id}`}
                    min="1"
                    max={listing.quantity}
                    defaultValue="1"
                    className="border-2 rounded-lg p-2 w-full"
                  />
                </div>
                <button
                  onClick={() => handleAddToCart(listing)}
                  disabled={listing.quantity <= 0}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {listing.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {verifiedNgos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Verification History: {verifiedNgos.listingTitle}
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              This donor is trusted because the following NGOs have successfully claimed from them:
            </p>
            <ul className="space-y-2 mb-6">
              {verifiedNgos.ngos.map((ngo, index) => (
                <li key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                  <span className="text-lime-500 text-lg">★</span> {ngo}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setVerifiedNgos(null)}
              className="w-full bg-lime-500 text-white font-semibold py-2 rounded-xl hover:bg-lime-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}