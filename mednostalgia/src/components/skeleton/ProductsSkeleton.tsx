import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductsSkeleton() {
  return (
    <div className="w-full lg:w-3/4 pl-6">
      <h1 className="text-2xl font-bold mb-6">
        <Skeleton width={150} height={30} />
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm text-center">
              <Skeleton height={200} className="w-full" />
              <h3 className="text-lg font-semibold mt-2">
                <Skeleton width={120} height={20} />
              </h3>
              <p className="text-gray-600">
                <Skeleton width={80} height={16} />
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}