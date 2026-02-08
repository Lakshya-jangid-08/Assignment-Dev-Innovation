import { useState, useEffect } from 'react';

const BookmarkForm = ({ bookmark, onSubmit, onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setUrl(bookmark.url || '');
      setTitle(bookmark.title || '');
      setDescription(bookmark.description || '');
      setTags(bookmark.tags?.join(', ') || '');
      setFavorite(bookmark.favorite || false);
    }
  }, [bookmark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookmarkData = {
      url,
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      favorite
    };

    await onSubmit(bookmarkData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {bookmark ? 'Edit Bookmark' : 'New Bookmark'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="(Will auto-fetch if empty)"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="webdev, tutorial, resources"
              />
            </div>
            
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="h-4 w-4 text-blue-600"
                id="bookmark-favorite"
              />
              <label htmlFor="bookmark-favorite" className="ml-2 text-sm text-gray-700">
                Mark as favorite
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : bookmark ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookmarkForm;