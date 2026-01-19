import "./LoadingButton.css";

function LoadingButton({
  isLoading,
  onClick,
  type = "button",
  children,
  disabled = false,
  className = "", // Accept className as a prop
}) {
  return (
    <button
      type={type}
      // Combine the base class with any passed-in class
      className={`loading-btn ${className}`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? <span className="spinner"></span> : children}
    </button>
  );
}

export default LoadingButton;
