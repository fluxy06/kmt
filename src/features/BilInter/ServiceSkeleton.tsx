const ServiceSkeleton = () => {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden flex flex-col"
      style={{ height: "clamp(320px, calc(70vw * 1.3), 480px)" }}
    >
      <div className="skeleton-shimmer flex-1 rounded-b-3xl" />

      <div className="h-[123px] flex flex-col justify-center items-center gap-3 px-6">
        <div className="skeleton-shimmer h-6 w-3/5 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-2/5 rounded-lg" />
      </div>
    </div>
  );
};

export default ServiceSkeleton;
