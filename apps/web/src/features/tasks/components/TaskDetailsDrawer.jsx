import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { addTaskAttachment, addTaskComment } from "../../../store/workSlice";

export default function TaskDetailsDrawer({ task, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [comment, setComment] = useState("");

  const uploadAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    dispatch(addTaskAttachment({
      taskId: task.id,
      attachment: { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type, createdAt: new Date().toISOString() },
    }));
  };

  return (
    <AnimatePresence>
      {task && (
        <motion.div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-white p-4 shadow-2xl dark:bg-slate-900" initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <button onClick={onClose}>Close</button>
          </div>
          <p className="text-sm text-slate-500">{task.description || "No description provided."}</p>
          <div className="mt-4 grid gap-3">
            <section>
              <h4 className="font-medium">Attachments</h4>
              <input type="file" className="mt-2 text-sm" onChange={uploadAttachment} />
              <ul className="mt-2 space-y-1 text-sm">
                {(task.attachments || []).map((item) => (
                  <li key={item.id} className="rounded bg-slate-100 p-2 dark:bg-slate-800">{item.name} ({Math.ceil(item.size / 1024)} KB)</li>
                ))}
              </ul>
            </section>
            <section>
              <h4 className="font-medium">Comments</h4>
              <div className="mt-2 flex gap-2">
                <input className="flex-1 rounded border px-3 py-2 dark:bg-slate-800" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button
                  className="rounded bg-blue-600 px-3 py-2 text-white"
                  onClick={() => {
                    if (!comment.trim()) return;
                    dispatch(addTaskComment({
                      taskId: task.id,
                      comment: { id: crypto.randomUUID(), text: comment, createdAt: new Date().toISOString(), author: user?.name || "User" },
                    }));
                    setComment("");
                  }}
                >
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {(task.comments || []).map((item) => (
                  <li key={item.id} className="rounded bg-slate-100 p-2 text-sm dark:bg-slate-800">
                    <p>{item.text}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.author} - {new Date(item.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
