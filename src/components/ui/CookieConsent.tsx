'use client'

import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const acceptedCookies = localStorage.getItem('acceptedCookies');
    if (!acceptedCookies) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('acceptedCookies', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 shadow-md rounded-lg p-4 w-[300px] text-sm">
      <p className="mb-2 text-gray-700">
        Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa política de privacidade.
      </p>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={handleAccept}
      >
        Aceitar
      </button>
    </div>
  );
}
