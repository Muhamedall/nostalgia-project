import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function FilterSidebarSkeleton() {
  return (
    <div className="w-full lg:w-1/4 h-auto p-4 bg-[#F4EBD0] rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        <Skeleton width={100} height={30} />
      </h2>

      {/* Price Filter Skeleton */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">
          <Skeleton width={80} height={20} />
        </h3>
        <Skeleton height={10} />
      </div>

      {/* Size Filter Skeleton */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            <Skeleton width={60} height={20} />
          </h3>
          <Skeleton circle width={20} height={20} />
        </div>
        <div className="space-y-2 mt-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} height={20} />
            ))}
        </div>
      </div>

      {/* Brand Filter Skeleton */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            <Skeleton width={60} height={20} />
          </h3>
          <Skeleton circle width={20} height={20} />
        </div>
        <div className="space-y-2 mt-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} height={20} />
            ))}
        </div>
      </div>

      {/* Genre Filter Skeleton */}
      <div className="mb-6 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">
            <Skeleton width={60} height={20} />
          </h3>
          <Skeleton circle width={20} height={20} />
        </div>
        <div className="space-y-2 mt-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} height={20} />
            ))}
        </div>
      </div>
    </div>
  );
}