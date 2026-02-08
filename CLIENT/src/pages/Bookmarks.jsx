import { useState, useEffect } from 'react';
import { bookmarksAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkCard from '../components/BookmarkCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, [search, tags]);

  const fetchBookmarks = async () => {
    try {
      const params = {};
      if (search) params.q = search;
      if (tags) params.tags = tags;
      
      const response = await bookmarksAPI.getAll(params);
      setBookmarks(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (bookmarkData) => {
    try {
      const response = await bookmarksAPI.create(bookmarkData);
      setBookmarks([response.data.data, ...bookmarks]);
      toast.success('Bookmark saved successfully');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to save bookmark');
    }
  };

  const handleUpdate = async (id, bookmarkData) => {
    try {
      const response = await bookmarksAPI.update(id, bookmarkData);
      setBookmarks(bookmarks.map(b => 
        b._id === id ? response.data.data : b
      ));
      toast.success('Bookmark updated successfully');
      setEditingBookmark(null);
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      await bookmarksAPI.delete(id);
      setBookmarks(bookmarks.filter(b => b._id !== id));
      toast.success('Bookmark deleted successfully');
    } catch (error) {
      toast.error('Failed to delete bookmark');
    }
  };

  const handleFavorite = async (id, favorite) => {
    try {
      await bookmarksAPI.update(id, { favorite });
      setBookmarks(bookmarks.map(b => 
        b._id === id ? { ...b, favorite } : b
      ));
      toast.success(favorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading bookmarks...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + New Bookmark
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="webdev,tutorial,resources"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Bookmark Form Modal */}
      {(showForm || editingBookmark) && (
        <BookmarkForm
          bookmark={editingBookmark}
          onSubmit={editingBookmark ? 
            (data) => handleUpdate(editingBookmark._id, data) : 
            handleCreate
          }
          onClose={() => {
            setShowForm(false);
            setEditingBookmark(null);
          }}
        />
      )}

      {/* Bookmarks Grid */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookmarks found. Save your first bookmark!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              onEdit={() => setEditingBookmark(bookmark)}
              onDelete={() => handleDelete(bookmark._id)}
              onFavorite={(favorite) => handleFavorite(bookmark._id, favorite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;