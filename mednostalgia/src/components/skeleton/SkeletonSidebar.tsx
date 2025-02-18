import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonSidebar = () => {
  return (
    <div className="sidebar-skeleton">
      <Skeleton height={50} width={150} count={5} />
    </div>
  );
};

export default SkeletonSidebar;