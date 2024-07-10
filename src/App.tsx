import { useState } from "react"
import Notes from "./components/Notes"
interface Note {
  id: number,
  text: string,
  position?: { x: number, y: number},
};

function App() {
  const [notes, setNotes] = useState<Array<Note>>([]);
  const [note, setNote] = useState<string>("");
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          marginTop: "30px",
        }}
      >
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "300px",
            height: "30px",
            borderRadius: "5px",
            border: "1px solid black",
          }}
          placeholder="  Pinit here"
        />
        <button
          style={{
            padding: "4px",
            width: "100px",
            fontSize: "15px",
            borderRadius: "5px",
            border: "1px solid black",
          }}
          onClick={() => {
            setNotes([...notes, { id: notes.length + 1, text: note }]);
          }}
        >
          📌
        </button>
      </div>
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;
