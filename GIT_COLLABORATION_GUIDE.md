# ROOTLY HOMEGROWN PRODUCE EXCHANGE — GIT COLLABORATION GUIDE

This document establishes the Git branching strategy, collaboration rules, and conflict resolution workflows for our three-developer team.

---

## 1. Branch Strategy

```
master (or main)  <-- Production-ready, stable shared foundation
   ├── feature/foundation-core       (My branch: MVC, Auth, Shared Components, Leaflet)
   ├── feature/user-website-person1  (Person 1 branch: Explore, Products, User Workflows)
   └── feature/admin-dash-person2    (Person 2 branch: Admin Moderation, Reports, Analytics)
```

- **`master`**: Protected root branch containing validated, compilable shared code.
- **`feature/user-website-person1`**: Person 1 develops user-facing pages and components here.
- **`feature/admin-dash-person2`**: Person 2 develops admin dashboard pages and components here.

---

## 2. Team Collaboration Rules

1. **Strict File Isolation**:
   - Person 1 writes in `frontend/src/pages/user/` and `backend/routes/userRoutes.js`.
   - Person 2 writes in `frontend/src/pages/admin/` and `backend/routes/adminRoutes.js`.
   - Never directly modify another teammate's domain files without prior discussion.
2. **Never Force-Push (`--force`)**:
   - Force-pushing can overwrite a teammate's commits. Always use standard `git push`.
3. **Never Commit Secrets**:
   - `.env` files are ignored in `.gitignore`.
   - Only commit `.env.example` templates with redacted placeholders.
4. **Pull Before Starting Work**:
   ```powershell
   git fetch origin
   git pull origin master
   ```

---

## 3. Resolving Merge Conflicts

If Git flags a conflict in a shared integration file (e.g. `backend/routes/index.js` or `frontend/src/App.jsx`):

1. Check conflicting files:
   ```powershell
   git status
   ```
2. Open the file in your code editor and look for conflict markers:
   ```
   <<<<<<< HEAD
   // Your incoming routes
   =======
   // Teammate's routes
   >>>>>>> branch-name
   ```
3. Keep both route definitions and remove the Git markers.
4. Run tests before committing the merge:
   ```powershell
   cd backend; npm run test:models; npm run test:auth
   cd ..\frontend; npm run build
   ```
5. Stage and finalize the merge:
   ```powershell
   git add .
   git commit -m "Merge: resolve integration routes without overwriting teammates"
   ```
