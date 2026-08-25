import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function NavbarSkeleton() {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-4 bg-white shadow-md">
      <div className="flex flex-col items-center md:flex-row md:space-x-6">
        <Skeleton width={90} height={60} />
      </div>
      <div className="flex flex-col w-full md:hidden items-center mt-4">
        <div className="relative w-full max-w-xs">
          <Skeleton height={40} />
        </div>
        <div className="flex space-x-4 mt-4">
          <Skeleton circle width={28} height={28} />
          <Skeleton circle width={28} height={28} />
          <Skeleton circle width={28} height={28} />
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-6 w-full">
        <div className="relative flex-1 ml-4">
          <Skeleton height={40} />
        </div>
        <Skeleton circle width={30} height={30} />
        <Skeleton circle width={30} height={30} />
        <Skeleton circle width={30} height={30} />
      </div>
    </nav>
  );
}