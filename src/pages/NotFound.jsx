import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const HomeIcon = getIcon('Home');
  const AlertCircleIcon = getIcon('AlertCircle');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="mb-8 flex justify-center">
          <div className="p-6 rounded-full bg-surface-200 dark:bg-surface-800 shadow-neu-light dark:shadow-neu-dark">
            <AlertCircleIcon className="w-16 h-16 text-secondary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Page Not Found
        </h1>
        <p className="text-lg mb-8 text-surface-600 dark:text-surface-300">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all shadow-soft"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}