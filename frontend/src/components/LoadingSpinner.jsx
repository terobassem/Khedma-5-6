const LoadingSpinner = ({ fullScreen = false, text = 'جاري التحميل...' }) => (
  <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
    <div className="w-16 h-16 border-4 border-church-purple border-t-transparent rounded-full animate-spin" />
    <p className="text-church-purple font-bold text-lg">{text}</p>
  </div>
);

export default LoadingSpinner;
