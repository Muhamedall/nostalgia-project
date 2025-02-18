import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonNavbar = () => {
  return (
    <div className="navbar-skeleton">
      <Skeleton height={50} width={200} />
      <Skeleton height={50} width={100} count={3} />
    </div>
  );
};

export default SkeletonNavbar;