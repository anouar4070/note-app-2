import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

export default function App() {
  // Lazy state initialization (just add arrow function)
  //     const [notes, setNotes] = React.useState(
  //        () => JSON.parse(localStorage.getItem("notes")) || []
  // )

  const [notes, setNotes] = React.useState([]);

  // const [currentNoteId, setCurrentNoteId] = React.useState(
  //     (notes[0] && notes[0].id) || ""
  //        (notes[0]?.id) || ""
  // )
  const [currentNoteId, setCurrentNoteId] = React.useState("");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  // React.useEffect(() => {
  //     localStorage.setItem("notes", JSON.stringify(notes))
  // }, [notes])

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  async function createNewNote() {
    const newNote = {
      // id: nanoid(),
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    // setNotes(prevNotes => [newNote, ...prevNotes])
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  // function updateNote(text) {
  //    // Put the most recently-modified note at the top
  //     setNotes(oldNotes => {
  //         const newArray = []
  //         for(let i = 0; i < oldNotes.length; i++) {
  //             const oldNote = oldNotes[i]
  //             if(oldNote.id === currentNoteId) {
  //                 newArray.unshift({ ...oldNote, body: text })
  //             } else {
  //                 newArray.push(oldNote)
  //             }
  //         }
  //         return newArray
  //     })

  //     // This does not rearrange the notes
  //     // setNotes(oldNotes => oldNotes.map(oldNote => {
  //     //     return oldNote.id === currentNoteId
  //             // ? { ...oldNote, body: text }
  //     //         : oldNote
  //     // }))
  // }

  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(docRef,
        { body: text, updatedAt: Date.now() }, 
          { merge: true }
        )
  }

  async function deleteNote(noteId) {
    // event.stopPropagation()
    // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    const docRef = doc(db, "notes", noteId); //doc is similar to collection but it allow us to access a single doc
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />

          <Editor currentNote={currentNote} updateNote={updateNote} />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
