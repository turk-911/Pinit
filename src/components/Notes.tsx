import React, { createRef, useEffect, useRef } from "react";
import Note from "./Note";

interface Note {
  id: number;
  text: string;
  position?: {
    x: number;
    y: number;
  };
}

interface NotesProps {
  notes: Array<Note>;
  setNotes: (notes: Array<Note>) => void;
}

const Notes: React.FC<NotesProps> = ({ notes = [], setNotes = () => {} }) => {
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]" ) as Note[];
    if(savedNotes.length > 0) {
      setNotes(savedNotes)
      return;
    }
    const updatedNotes = notes.map((note) => {
      const savedNote = savedNotes.find((n: Note) => n.id === note.id);
      if (savedNote) {
        return { ...note, position: savedNote.position };
      } else {
        const position = determineNewPosition();
        return { ...note, position };
      }
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, []);

  const noteRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const determineNewPosition = () => {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
    };
  };

  const handleDragStart = (
    note: Note,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const { id } = note;
    const noteRef = noteRefs.current[id]?.current;
    if (!noteRef) return;

    const rect = noteRef.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const startPos = note.position!;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      noteRef.style.left = `${newX}px`;
      noteRef.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = {
        x: finalRect.left,
        y: finalRect.top,
      };
      if (checkForOverlap(id)) {
        noteRef.style.left = `${startPos.x}px`;
        noteRef.style.top = `${startPos.y}px`;
      } else {
        updateNotePosition(id, newPosition);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const checkForOverlap = (id: number) => {
    const currentNoteRef = noteRefs.current[id]?.current;
    if (!currentNoteRef) return false;

    const currentRect = currentNoteRef.getBoundingClientRect();
    return notes.some((note) => {
      if (note.id === id) return false;

      const otherNoteRef = noteRefs.current[note.id]?.current;
      if (!otherNoteRef) return false;

      const otherRect = otherNoteRef.getBoundingClientRect();
      const overlap = !(
        currentRect.right < otherRect.left ||
        currentRect.left > otherRect.right ||
        currentRect.top > otherRect.bottom ||
        currentRect.bottom < otherRect.top
      );
      return overlap;
    });
  };

  const updateNotePosition = (
    id: number,
    newPosition: { x: number; y: number }
  ) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, position: newPosition } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div>
      {notes.map((note) => (
        <Note
          key={note.id}
          ref={
            noteRefs.current[note.id]
              ? noteRefs.current[note.id]
              : (noteRefs.current[note.id] = createRef())
          }
          initialPos={note.position!}
          content={note.text}
          onDelete={() => deleteNote(note.id)}
          onMouseDown={(e) => handleDragStart(note, e)}
        />
      ))}
    </div>
  );
};

export default Notes;
