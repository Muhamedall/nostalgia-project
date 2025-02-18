import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonHomepage = () => {
  return (
    <div className="homepage-skeleton">
      <Skeleton height={200} width={300} />
      <Skeleton height={20} width={250} count={3} />
    </div>
  );
};

export default SkeletonHomepage;