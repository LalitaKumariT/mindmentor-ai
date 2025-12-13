import { useState } from 'react';

const Notes = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Math Formulas', content: 'Important formulas for calculus', tags: ['math', 'formulas'] },
    { id: 2, title: 'React Hooks', content: 'useState, useEffect, useRef examples', tags: ['react', 'frontend'] },
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [editingNote, setEditingNote] = useState(null);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...newNote, id: editingNote.id, tags: newNote.tags.split(',').map(tag => tag.trim()) }
          : note
      ));
      setEditingNote(null);
    } else {
      const note = {
        id: Date.now(),
        ...newNote,
        tags: newNote.tags.split(',').map(tag => tag.trim())
      };
      setNotes([...notes, note]);
    }
    setNewNote({ title: '', content: '', tags: '' });
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', ')
    });
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="dash-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Notes & Resources</h3>
        <button 
          onClick={() => document.getElementById('note-modal').showModal()} 
          className="small-button primary"
        >
          + Add Note
        </button>
      </div>

      <div className="space-y-3">
        {notes.map(note => (
          <div key={note.id} className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{note.title}</h4>
                <p className="text-sm text-gray-300 mt-1">{note.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-900 text-blue-100 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditNote(note)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Modal */}
      <dialog id="note-modal" className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg mb-4">
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h3>
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags <span className="text-gray-400 text-xs">(comma separated)</span>
              </label>
              <input
                type="text"
                value={newNote.tags}
                onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                placeholder="e.g., math, formulas, important"
              />
            </div>
            <div className="modal-action">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => {
                  document.getElementById('note-modal').close();
                  setNewNote({ title: '', content: '', tags: '' });
                  setEditingNote(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingNote ? 'Update' : 'Save'} Note
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Notes;
