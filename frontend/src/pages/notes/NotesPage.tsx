import React, { useState, useEffect } from 'react';
import { FiSearch, FiTag, FiPlus, FiTrash2, FiSave, FiList, FiFileText } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  userId: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get('/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    if (!selectedNote) return;
    setIsSaving(true);
    try {
      if (selectedNote.id) {
        await api.put(`/api/notes/${selectedNote.id}`, selectedNote);
      } else {
        const response = await api.post('/api/notes', {
          ...selectedNote,
          userId: user?.id
        });
        setSelectedNote(response.data);
      }
      // Refresh notes list
      const response = await api.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: '',
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      userId: user?.id || ''
    };
    setSelectedNote(newNote);
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/api/notes/${id}`);
        setNotes(notes.filter(note => note.id !== id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleAIAction = async (action: 'summarize' | 'checklist') => {
    if (!selectedNote?.id) return;
    try {
      const response = await api.post(`/api/notes/${selectedNote.id}/${action}`);
      setSelectedNote(prev => prev ? { ...prev, content: response.data } : null);
    } catch (error) {
      console.error(`Error with ${action}:`, error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && selectedNote) {
      const updatedNote = {
        ...selectedNote,
        tags: [...new Set([...selectedNote.tags, newTag.trim()])]
      };
      setSelectedNote(updatedNote);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        tags: selectedNote.tags.filter(tag => tag !== tagToRemove)
      };
      setSelectedNote(updatedNote);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!selectedNote) return;
    
    const timer = setTimeout(() => {
      if (selectedNote.content || selectedNote.title !== 'Untitled Note') {
        handleSaveNote();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedNote]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative mb-3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Add tag..."
              className="flex-1 px-3 py-1.5 text-sm rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-2 py-1 text-xs rounded-full ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notes found
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedNote?.id === note.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                  {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-400 ml-1">+{note.tags.length - 3} more</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCreateNewNote}
            className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
          >
            <FiPlus className="mr-2" />
            New Note
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <input
                type="text"
                className="text-xl font-semibold bg-transparent border-none focus:ring-0 w-full dark:text-white"
                value={selectedNote.title}
                onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                placeholder="Note Title"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAIAction('summarize')}
                  className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                >
                  Summarize
                </button>
                <button
                  onClick={() => handleAIAction('checklist')}
                  className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors flex items-center"
                >
                  <FiList className="mr-1" /> Checklist
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  <FiSave className="mr-1" /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            {/* Tags */}
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-2">
              {selectedNote.tags.map(tag => (
                <div key={tag} className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-sm">
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-400 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              <textarea
                className="p-4 border-r border-gray-200 dark:border-gray-700 resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-full"
                value={selectedNote.content}
                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                placeholder="Start writing your note here... (Markdown supported)"
              />
              <div className="p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 h-full">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preview</h3>
                <div className="prose dark:prose-invert max-w-none">
                  {selectedNote.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedNote.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">Your markdown preview will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8">
            <FiFileText className="h-16 w-16 mb-4 opacity-20" />
            <h2 className="text-xl font-medium mb-2">No note selected</h2>
            <p className="mb-6">Select a note from the sidebar or create a new one</p>
            <button
              onClick={handleCreateNewNote}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <FiPlus className="mr-2" />
              Create New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
