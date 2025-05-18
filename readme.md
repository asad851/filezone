# File Management System

A fullstack file management web application that allows users to upload, organize, and manage files and folders securely. Built using React.js for the frontend, Firebase Storage for file handling, NeonDB for metadata storage, and custom authentication for secure user access.

## Features

- **User Authentication**

  - Custom login/signup with session handling
  - User-specific file and folder access

- **File & Folder Management**

  - Upload, rename, delete files and folders
  - Nested folder structure with metadata
  - File previews and structured storage

- **Drag & Drop UI**

  - Smooth drag-and-drop reordering using [`@dnd-kit`](https://github.com/clauderic/dnd-kit)
  - Supports both files and folders

- **Cloud Storage Integration**
  - Files stored on **Firebase Storage**
  - Metadata (names, structure, timestamps) stored in **NeonDB**

## Tech Stack

| Layer          | Tech Used                                             |
| -------------- | ----------------------------------------------------- |
| Frontend       | React.js, @dnd-kit, HTML5 Drag & Drop                 |
| Authentication | Custom Auth System (Node.js/Express) |
| Storage        | Firebase Storage                                      |
| Database       | NeonDB (PostgreSQL)                                   |
| State Mgmt     | React Context / Redux Toolkit (optional)              |
| Styling        | Tailwind CSS / SCSS / CSS Modules                     |
| Deployment     | Vercel / Render                                       |

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/asad851/filezone
   cd file-manager-app

   ```

2. **Install dependencies**

   ```bash
   npm install

   ```

3. **Environment Variables**
   **_Create a .env file and add your Firebase and DB credentials:_**
   ```.env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_NEON_DB_URL=your_postgres_url
   ```
