import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [search, tags]);

  const fetchNotes = async () => {
    try {
      const params = {};
      if (search) params.q = search;
      if (tags) params.tags = tags;
      
      const response = await notesAPI.getAll(params);
      console.log('NOTES RESPONSE 👉', response.data);
      setNotes(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData);
      setNotes([response.data.data, ...notes]);
      toast.success('Note created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleUpdate = async (id, noteData) => {
    try {
      const response = await notesAPI.update(id, noteData);
      setNotes(notes.map(note => 
        note._id === id ? response.data.data : note
      ));
      toast.success('Note updated successfully');
      setEditingNote(null);
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      await notesAPI.delete(id);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleFavorite = async (id, favorite) => {
    try {
      await notesAPI.update(id, { favorite });
      setNotes(notes.map(note => 
        note._id === id ? { ...note, favorite } : note
      ));
      toast.success(favorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading notes...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + New Note
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
              placeholder="Search notes..."
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
              placeholder="work,personal,ideas"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Note Form Modal */}
      {(showForm || editingNote) && (
        <NoteForm
          note={editingNote}
          onSubmit={editingNote ? 
            (data) => handleUpdate(editingNote._id, data) : 
            handleCreate
          }
          onClose={() => {
            setShowForm(false);
            setEditingNote(null);
          }}
        />
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDelete={() => handleDelete(note._id)}
              onFavorite={(favorite) => handleFavorite(note._id, favorite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;