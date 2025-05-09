interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  return (
    <div className="cookie-consent fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 text-center z-50">
      <p>Este site usa cookies para melhorar a sua experiência. Ao continuar, você aceita nossa política de cookies.</p>
      <button onClick={onAccept} className="bg-blue-500 text-white px-4 py-2 rounded">
        Aceitar
      </button>
    </div>
  );
};

export default CookieConsent;
