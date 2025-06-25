interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export default function GradientText({ 
  children, 
  className = "", 
  gradient = "from-gray-900 to-gray-700" 
}: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}