

const ScrollingText = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="marquee">
      {children}
    </div>
  );
};

export default ScrollingText;