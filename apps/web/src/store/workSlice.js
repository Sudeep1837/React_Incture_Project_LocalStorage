import { createSlice } from "@reduxjs/toolkit";
import { readStorage, writeStorage } from "../lib/storage";

const persisted = readStorage();

const workSlice = createSlice({
  name: "work",
  initialState: persisted,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      writeStorage(state);
    },
    upsertProject: (state, action) => {
      const payload = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      const index = state.projects.findIndex((project) => project.id === payload.id);
      if (index === -1) {
        state.projects.unshift({ ...payload, createdAt: payload.createdAt || new Date().toISOString() });
        state.activity.unshift({ id: crypto.randomUUID(), message: `Project "${payload.name}" created` });
      } else {
        state.projects[index] = { ...state.projects[index], ...payload };
        state.activity.unshift({ id: crypto.randomUUID(), message: `Project "${payload.name}" updated` });
      }
      writeStorage(state);
    },
    deleteProject: (state, action) => {
      const project = state.projects.find((item) => item.id === action.payload);
      state.projects = state.projects.filter((item) => item.id !== action.payload);
      state.tasks = state.tasks.filter((task) => task.projectId !== action.payload);
      if (project) state.activity.unshift({ id: crypto.randomUUID(), message: `Project "${project.name}" deleted` });
      writeStorage(state);
    },
    upsertTask: (state, action) => {
      const payload = {
        comments: [],
        attachments: [],
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      const index = state.tasks.findIndex((task) => task.id === payload.id);
      if (index === -1) {
        state.tasks.unshift({ ...payload, createdAt: payload.createdAt || new Date().toISOString() });
        state.activity.unshift({ id: crypto.randomUUID(), message: `Task "${payload.title}" created` });
      } else {
        state.tasks[index] = { ...state.tasks[index], ...payload };
        state.activity.unshift({ id: crypto.randomUUID(), message: `Task "${payload.title}" updated` });
      }
      writeStorage(state);
    },
    deleteTask: (state, action) => {
      const task = state.tasks.find((item) => item.id === action.payload);
      state.tasks = state.tasks.filter((item) => item.id !== action.payload);
      if (task) state.activity.unshift({ id: crypto.randomUUID(), message: `Task "${task.title}" deleted` });
      writeStorage(state);
    },
    moveTask: (state, action) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();
        state.activity.unshift({ id: crypto.randomUUID(), message: `Task "${task.title}" moved to ${task.status}` });
      }
      writeStorage(state);
    },
    addTaskComment: (state, action) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      if (!task) return;
      task.comments = task.comments || [];
      task.comments.unshift(action.payload.comment);
      writeStorage(state);
    },
    addTaskAttachment: (state, action) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      if (!task) return;
      task.attachments = task.attachments || [];
      task.attachments.unshift(action.payload.attachment);
      writeStorage(state);
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      writeStorage(state);
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((item) => item.id === action.payload);
      if (notification) notification.read = true;
      writeStorage(state);
    },
    clearNotifications: (state) => {
      state.notifications = [];
      writeStorage(state);
    },
    setUsers: (state, action) => {
      if (!state.users?.length) state.users = action.payload;
      writeStorage(state);
    },
    upsertUserDirectoryEntry: (state, action) => {
      const index = state.users.findIndex((item) => item.id === action.payload.id);
      if (index === -1) state.users.unshift(action.payload);
      else state.users[index] = { ...state.users[index], ...action.payload };
      writeStorage(state);
    },
    updateProfile: (state, action) => {
      state.profile = { ...(state.profile || {}), ...action.payload };
      writeStorage(state);
    },
    setUiFilter: (state, action) => {
      state.ui = { ...(state.ui || {}), [action.payload.key]: action.payload.value };
      writeStorage(state);
    },
  },
});

export const {
  setTheme,
  upsertProject,
  upsertTask,
  deleteTask,
  deleteProject,
  moveTask,
  addTaskComment,
  addTaskAttachment,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setUsers,
  upsertUserDirectoryEntry,
  updateProfile,
  setUiFilter,
} = workSlice.actions;
export default workSlice.reducer;
