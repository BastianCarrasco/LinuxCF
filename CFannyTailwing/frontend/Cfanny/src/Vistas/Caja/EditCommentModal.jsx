import React, { useState } from "react";

export default function EditCommentModal({
  isOpen,
  onClose,
  comentarioActual,
  onSave,
}) {
  const [nuevoComentario, setNuevoComentario] = useState(comentarioActual);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Editar Comentario</h2>
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="w-full h-24 p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(nuevoComentario);
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
