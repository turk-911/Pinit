import React, { forwardRef } from "react";
const colorArr = ["#4effef", "#b388eb", "#2bc016", "deepskyblue", "#f9dad0", "#84aef6", "yellow"];
interface NoteProps extends React.HTMLAttributes<HTMLDivElement> {
    content: string;
    initialPos: {
        x: number,
        y: number,
    };
    onDelete: () => void,
};
const Note = forwardRef<HTMLDivElement, NoteProps>(({ content, initialPos, onDelete, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: `${initialPos?.x}px`,
          top: `${initialPos?.y}px`,
          border: "1px solid black",
          userSelect: "none",
          padding: "10px",
          width: "300px",
          height: "100px",
          cursor: "move",
          borderRadius: "10px",
          backgroundColor: `${colorArr[Math.floor(Math.random() * 7)]}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: "18px"
        }}
        {...props}
      >
        📌 {content}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ marginLeft: "10px", borderRadius: "10px", width: "100px", fontFamily: "monospace", padding: "4px" }}
        >
          Delete
        </button>
      </div>
    );
});

export default Note;
