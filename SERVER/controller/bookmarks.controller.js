const Bookmark = require('../models/bookmarks.model.js');
const { validateBookmark, validateObjectId } = require('../utils/validation.js');
const { fetchUrlMetadata } = require('../utils/fetchMetadata.js');

const getBookmarks = async (req, res) => {
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
    
    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmarks',
      message: error.message
    });
  }
}

const getBookmarkById = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bookmark ID format'
      });
    }
    
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    
    res.json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmark',
      message: error.message
    });
  }
}

const createBookmark = async (req, res) => {
  try {
    const validation = validateBookmark(req.body);
    
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
    
    let bookmarkData = {
      url: req.body.url.trim(),
      title: req.body.title ? req.body.title.trim() : '',
      description: req.body.description ? req.body.description.trim() : '',
      tags,
      favorite: req.body.favorite || false
    };
    
    if (!bookmarkData.title) {
      const metadata = await fetchUrlMetadata(bookmarkData.url);
      if (metadata.success && metadata.title) {
        bookmarkData.title = metadata.title;
        bookmarkData.description = metadata.description || bookmarkData.description;
        bookmarkData.metadataFetched = true;
      }
    }
    
    const bookmark = await Bookmark.create(bookmarkData);
    
    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create bookmark',
      message: error.message
    });
  }
}

const updateBookmark = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bookmark ID format'
      });
    }

    const existingBookmark = await Bookmark.findById(req.params.id);
    if (!existingBookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }

    if (req.body.url || req.body.title || req.body.description) {
      const validation = validateBookmark(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }
    }

    const bookmarkData = {
      url: req.body.url
        ? req.body.url.trim()
        : existingBookmark.url,

      title: req.body.title !== undefined
        ? req.body.title.trim()
        : existingBookmark.title,

      description: req.body.description !== undefined
        ? req.body.description.trim()
        : existingBookmark.description,

      tags: req.body.tags
        ? [...new Set(req.body.tags.map(tag => tag.trim().toLowerCase()))]
        : existingBookmark.tags,

      favorite:
        req.body.favorite !== undefined
          ? req.body.favorite
          : existingBookmark.favorite
    };

    const updatedBookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      bookmarkData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Bookmark updated successfully',
      data: updatedBookmark
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update bookmark',
      message: error.message
    });
  }
};


const deleteBookmark = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bookmark ID format'
      });
    }
    
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete bookmark',
      message: error.message
    });
  }
}


module.exports = {
    getBookmarks,
    getBookmarkById,
    createBookmark,
    updateBookmark,
    deleteBookmark
}