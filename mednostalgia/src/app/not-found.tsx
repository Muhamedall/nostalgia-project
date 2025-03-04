import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        {/* 404 Title */}
        <h1 className="text-9xl font-bold text-gray-800 animate-bounce">404</h1>

        {/* Message */}
        <p className="mt-4 text-2xl font-medium text-gray-600">
  Oops! The page you&apos;re looking for doesn&apos;t exist.
</p>


        {/* Back to Home Link */}
        <Link
          href="/"
          className="mt-8 inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;