const AppIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby="title"
      className={className}
    >
      <title>Todo List Logo</title>
      <rect x="6" y="6" width="52" height="52" rx="12" fill="currentColor" />
      <path
        d="M20.5 33.5 L28.5 41.5 L44.5 25.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { AppIcon };
