<div align="center">

# 📝 Notes & Reminders

**A beautiful, zero-dependency productivity dashboard that runs entirely in your browser.**

Glassmorphism UI · interactive particle background · 3D tilt cards · confetti celebrations

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/dependencies-none-10b981)
![Storage](https://img.shields.io/badge/storage-localStorage-a855f7)

</div>

---

## ✨ Overview

**Notes & Reminders** is a personal productivity app built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no backend. Create an account, jot down notes, schedule reminders, and watch your completion progress fill up in real time, all wrapped in a polished dark UI packed with micro-interactions.

<img width="1851" height="972" alt="notess1" src="https://github.com/user-attachments/assets/34e438f0-93a6-4482-bb53-0efaff13744c" />
<img width="1847" height="825" alt="notess2" src="https://github.com/user-attachments/assets/cee36860-fbec-4db7-ad8f-dcb6da19379a" />
<img width="1836" height="925" alt="notess3" src="https://github.com/user-attachments/assets/9c35e5f7-b1ca-4a26-bf13-76810235c6d5" />


## 🚀 Features

### Productivity
- **Account system**: register and log in; the dashboard is protected and redirects to login when you're signed out
- **Notes**: create, edit and delete notes, each stamped with its creation date
- **Live search**: filter notes by title or content as you type, with smooth FLIP re-ordering animation
- **Reminders**: set a title, description, date and time; reminders are auto-sorted chronologically
- **Smart status badges**: every reminder is labelled **Upcoming**, **Overdue** or **Completed**, and statuses refresh automatically every minute
- **Dashboard stats**: animated counters for total notes, total reminders and completed tasks
- **Progress ring**: an SVG circular meter shows your reminder completion percentage
- **Persistent data**: everything is saved in `localStorage`, so it survives refreshes and restarts

### Design & interaction
- Glassmorphism cards with a deep indigo-to-purple gradient theme
- Interactive canvas particle network that reacts to your cursor
- 3D card tilt with a dynamic glare effect that follows the mouse
- Magnetic buttons that pull toward your pointer
- Glowing custom cursor follower
- Letter-by-letter animated titles
- Confetti bursts when you create or complete something
- Toast notifications and animated modals
- Touch-device friendly: the custom cursor is disabled on coarse-pointer devices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, `backdrop-filter`, keyframe animations) |
| Logic | Vanilla JavaScript (ES6+), Canvas API, SVG |
| Storage | Browser `localStorage` |
| Font | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via Google Fonts |

## 📁 Project Structure

```
.
├── index.html       # Dashboard (notes, reminders, stats)
├── login.html       # Login page
├── register.html    # Account creation page
├── style.css        # All styling, theme variables and animations
└── script.js        # Auth, notes, reminders, and the animation engines
```

## ⚡ Getting Started

No installation required.

```bash
# 1. Clone the repository
git clone https://github.com/ashmita070607-star/Note-and-remainder-app/tree/main

# 2. Move into the project folder
cd Notes-and-remainder-app
```

Then open **`register.html`** in any modern browser (double-click it, or serve the folder):

```bash
# Optional: serve locally
python -m http.server 8000
# → visit http://localhost:8000/register.html
```

### Using the app
1. **Register** an account, and you'll be signed in and taken to the dashboard.
2. Click **+ Add Note** to write a note, or **+ Add Reminder** to schedule a task.
3. Use the **search bar** to filter notes instantly.
4. Hit **✓ Complete** on a reminder and watch the progress ring update.
5. **Logout** from the header when you're done.

## 🧠 How It Works

- **Auth flow:** `registerUser()` saves the account to `localStorage` and starts a session (`loggedInUser`). `checkLogin()` runs on every page load and guards the dashboard.
- **Data layer:** notes and reminders live in `localStorage` under the `notes` and `reminders` keys as JSON arrays, keyed by `Date.now()` IDs.
- **Rendering:** all user-supplied text is passed through an `escapeHTML()` helper before being injected into the DOM to prevent XSS.
- **Animation engines:** the particle background, confetti, 3D tilt, magnetic buttons and cursor follower are each self-contained functions initialised on `DOMContentLoaded`.

## ⚠️ Limitations

This is a front-end showcase and learning project, not a production auth system:

- Data is stored **per browser** in `localStorage`. Clearing site data erases it, and it doesn't sync across devices.
- Credentials are stored **unencrypted** in `localStorage`. Do not use a real password.
- Only **one account** is stored at a time; registering again overwrites the previous one.

## 🗺️ Roadmap

- [ ] Multi-user support with per-user data
- [ ] Secure authentication with a real backend
- [ ] Browser notifications when a reminder is due
- [ ] Note categories, tags and colours
- [ ] Light theme toggle
- [ ] Export / import data as JSON
- [ ] PWA support for offline installs

## 🤝 Contributing

Contributions, issues and feature ideas are welcome!

1. Fork the project
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. 
---

<div align="center">

Made with 💜 and a lot of CSS · If you like this project, give it a ⭐

</div>
