const Note = require('../models/notes.model.js');
const { validateNote, validateObjectId } = require('../utils/validation.js');

const getNotes = async (req, res) => {
  try {
    const { q, tags, favorite } = req.query;
    let query = {};
    
    if (q) {
      query.$text = { $search: q };
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $all: tagArray };
    }
    
    if (favorite !== undefined) {
      query.favorite = favorite === 'true';
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      message: error.message
    });
  }
}

const getNodeById = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID format'
      });
    }
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note',
      message: error.message
    });
  }
}

const createNote = async (req, res) => {
  try {
    const validation = validateNote(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    const tags = req.body.tags 
      ? [...new Set(req.body.tags.map(tag => tag.trim().toLowerCase()))]
      : [];
    
    const noteData = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      tags,
      favorite: req.body.favorite || false
    };
    
    const note = await Note.create(noteData);
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create note',
      message: error.message
    });
  }
}

const updateNotes = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID format'
      });
    }

    const existingNote = await Note.findById(req.params.id);
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (req.body.title || req.body.content) {
      const validation = validateNote(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }
    }

    const noteData = {
      title: req.body.title
        ? req.body.title.trim()
        : existingNote.title,

      content: req.body.content
        ? req.body.content.trim()
        : existingNote.content,

      tags: req.body.tags
        ? [...new Set(req.body.tags.map(tag => tag.trim().toLowerCase()))]
        : existingNote.tags,

      favorite:
        req.body.favorite !== undefined
          ? req.body.favorite
          : existingNote.favorite
    };

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      noteData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
      message: error.message
    });
  }
};


const deleteNotes = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID format'
      });
    }
    
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
      message: error.message
    });
  }
}

module.exports = {
    getNotes,
    getNodeById,
    createNote,
    updateNotes,
    deleteNotes
}