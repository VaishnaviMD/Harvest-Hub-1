import { useNavigate } from "react-router-dom";

export default function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  };
  return (
    <button className="btn-outline" onClick={goBack} aria-label="Go back" style={{ marginBottom: "1rem" }}>
      ← Back
    </button>
  );
}


