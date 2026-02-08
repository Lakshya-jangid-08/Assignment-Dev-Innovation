import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

const BookmarkCard = ({ bookmark, onEdit, onDelete, onFavorite }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg truncate">
          {bookmark.title || getDomain(bookmark.url)}
        </h3>
        <button
          onClick={() => onFavorite(!bookmark.favorite)}
          className="text-red-500 hover:text-red-600"
        >
          {bookmark.favorite ? <MdFavorite/> : <MdFavoriteBorder/>}
        </button>
      </div>
      
      {bookmark.description && (
        <div className="text-gray-600 mb-4 max-h-32 overflow-y-auto pr-1">
          <p className="whitespace-pre-wrap">
            {bookmark.description}
          </p>
        </div>
      )}
      
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 text-sm mb-4 block truncate"
      >
        {getDomain(bookmark.url)}
      </a>
      
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {bookmark.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatDate(bookmark.createdAt)}</span>
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;