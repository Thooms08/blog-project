// components/Editor.tsx
"use client";

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditorProps {
  onChange: (data: string) => void;
  value?: string;
}

const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <div className="prose-orange cyberpunk-editor">
      <CKEditor
        // SOLUSI: Cast ke 'any' untuk melewati pengecekan tipe data build yang ketat
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor={ClassicEditor as any}
        data={value || ""}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReady={(editor: any) => {
          // Atur tinggi editor
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          editor.editing.view.change((writer: any) => {
            writer.setStyle('min-height', '300px', editor.editing.view.document.getRoot()!);
          });
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder: 'Tuliskan konten blog futuristikmu di sini...',
          toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'
          ],
        }}
      />

      {/* CSS internal Cyberpunk Orange Theme */}
      <style jsx global>{`
        .ck-editor__editable {
          background-color: #0f172a !important; /* slate-950 */
          color: #f97316 !important; /* orange-500 */
          border: 2px solid #1e293b !important;
          font-family: 'Courier New', monospace;
        }
        .ck-toolbar {
          background-color: #1e293b !important;
          border: 1px solid #334155 !important;
        }
        .ck-toolbar__items button {
          color: #94a3b8 !important;
        }
        .ck-toolbar__items button:hover {
          background-color: #f97316 !important;
          color: white !important;
        }
        .ck-focused {
          border: 2px solid #f97316 !important;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.3) !important;
          outline: none !important;
        }
        /* Mengubah warna teks placeholder */
        .ck.ck-editor__editable_inline[role='textbox'] .ck-placeholder::before {
          color: #475569 !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;