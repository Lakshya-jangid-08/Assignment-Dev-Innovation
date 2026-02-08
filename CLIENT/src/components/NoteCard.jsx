import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";


const NoteCard = ({ note, onEdit, onDelete, onFavorite }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-base md:text-lg truncate">{note.title}</h3>
        <button
          onClick={() => onFavorite(!note.favorite)}
          className="text-red-500 hover:text-red-600 flex-shrink-0"
        >
          {note.favorite ? <MdFavorite/> : <MdFavoriteBorder/>}
        </button>
      </div>
      
      <div className="text-gray-600 mb-4 max-h-32 overflow-y-auto pr-1 text-sm">
        <p className="whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs md:text-sm text-gray-500">
        <span>{formatDate(note.createdAt)}</span>
        <div className="space-x-2 w-full sm:w-auto">
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

export default NoteCard;