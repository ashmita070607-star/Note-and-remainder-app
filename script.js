/* =========================================
   LUXURY ANIMATION ENGINE & SCRIPT
========================================= */

/* =========================================
   1. USER LOGIN & AUTHENTICATION
========================================= */

function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const savedUser = JSON.parse(localStorage.getItem("userAccount"));

    if (savedUser && username === savedUser.username && password === savedUser.password) {
        const userData = {
            name: savedUser.name || savedUser.username,
            username: savedUser.username,
            email: savedUser.email || "",
            phone: savedUser.phone || "",
            authType: "password"
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        showToast("Welcome back, " + userData.name + "! 👋", "success");
        triggerConfetti();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } else {
        const message = document.getElementById("loginMessage");
        if (message) {
            message.textContent = "❌ Incorrect username or password.";
        }
        showToast("Incorrect username or password", "danger");
    }
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");

    if (name === "" || username === "" || password === "" || confirmPassword === "") {
        if (message) message.textContent = "❌ Please fill in all fields.";
        showToast("Please fill in all fields", "danger");
        return;
    }

    if (password.length < 6) {
        if (message) message.textContent = "❌ Password must be at least 6 characters.";
        showToast("Password must be at least 6 characters", "danger");
        return;
    }

    if (password !== confirmPassword) {
        if (message) message.textContent = "❌ Passwords do not match.";
        showToast("Passwords do not match", "danger");
        return;
    }

    const userAccount = {
        name: name,
        username: username,
        password: password,
        email: "",
        phone: "",
        authType: "password"
    };

    localStorage.setItem("userAccount", JSON.stringify(userAccount));
    if (message) {
        message.style.color = "#10b981";
        message.textContent = "✅ Account created successfully!";
    }

    showToast("Account created successfully! 🎉", "success");
    triggerConfetti();

    localStorage.setItem("loggedInUser", JSON.stringify(userAccount));
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

function checkLogin() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (window.location.pathname.endsWith("index.html") && !loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    if (loggedInUser) {
        let user;
        try {
            user = JSON.parse(loggedInUser);
        } catch (error) {
            user = { name: loggedInUser, username: loggedInUser };
        }

        const greeting = document.getElementById("userGreeting");
        const username = document.getElementById("dashboardUsername");
        const displayName = user.name || user.username || user.phone || "User";

        if (greeting) greeting.textContent = "👤 " + displayName;
        if (username) username.textContent = displayName;
    }
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    showToast("Logged out successfully", "info");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 400);
}

checkLogin();

/* =========================================
   2. LETTER ANIMATIONS SYSTEM
========================================= */

function initLetterAnimations() {
    const titleElements = document.querySelectorAll(".animated-title");
    titleElements.forEach(el => {
        const text = el.textContent.trim();
        if (!text || el.querySelector(".letter")) return;
        el.innerHTML = "";
        [...text].forEach((char, index) => {
            const span = document.createElement("span");
            span.className = "letter";
            span.style.animationDelay = `${index * 0.045}s`;
            span.innerHTML = char === " " ? "&nbsp;" : escapeHTML(char);
            el.appendChild(span);
        });
    });
}

/* =========================================
   3. INTERACTIVE CANVAS PARTICLE BACKGROUND ENGINE
========================================= */

function initBgCanvas() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 20), 60);
    const mouse = { x: null, y: null, radius: 160 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2.5;
                    this.y -= (dy / dist) * force * 2.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(168, 85, 247, 0.4)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = (1 - dist / 130) * 0.22;
                    ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   4. PARTICLES CONFETTI CELEBRATION ENGINE
========================================= */

let confettiParticles = [];
function triggerConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6366f1", "#a855f7", "#ec4899", "#fbbf24", "#10b981", "#3b82f6"];

    for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        confettiParticles.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            opacity: 1,
            life: Math.random() * 60 + 60
        });
    }

    if (!window.confettiRunning) {
        window.confettiRunning = true;
        animateConfetti(ctx, canvas);
    }
}

function animateConfetti(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        const p = confettiParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.vx *= 0.98;
        p.rotation += p.spin;
        p.life--;
        p.opacity = Math.max(p.life / 120, 0);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.life <= 0 || p.y > canvas.height) {
            confettiParticles.splice(i, 1);
        }
    }

    if (confettiParticles.length > 0) {
        requestAnimationFrame(() => animateConfetti(ctx, canvas));
    } else {
        window.confettiRunning = false;
    }
}

/* =========================================
   5. 3D CARD TILT & GLARE MATH ENGINE
========================================= */

function init3DTiltEngine() {
    document.addEventListener("mousemove", (e) => {
        const card = e.target.closest(".3d-card, .card, .stat-card, .login-box");
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        let glare = card.querySelector(".glare");
        if (!glare) {
            glare = document.createElement("div");
            glare.className = "glare";
            card.appendChild(glare);
        }

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.opacity = "1";
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.25) 0%, transparent 70%)`;
    });

    document.addEventListener("mouseout", (e) => {
        const card = e.target.closest(".3d-card, .card, .stat-card, .login-box");
        if (!card) return;

        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        const glare = card.querySelector(".glare");
        if (glare) glare.style.opacity = "0";
    });
}

/* =========================================
   6. MAGNETIC BUTTONS ENGINE
========================================= */

function initMagneticButtons() {
    document.addEventListener("mousemove", (e) => {
        const btn = e.target.closest(".magnetic-btn");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distX = e.clientX - btnCenterX;
        const distY = e.clientY - btnCenterY;

        btn.style.transform = `translate(${distX * 0.3}px, ${distY * 0.3}px) scale(1.03)`;
    });

    document.addEventListener("mouseout", (e) => {
        const btn = e.target.closest(".magnetic-btn");
        if (btn) {
            btn.style.transform = `translate(0px, 0px) scale(1)`;
        }
    });
}

/* =========================================
   7. GLOWING CURSOR FOLLOWER
========================================= */

function initCursorFollower() {
    const follower = document.getElementById("cursorFollower");
    if (!follower) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    document.addEventListener("mouseover", (e) => {
        if (e.target.closest("button, a, input, textarea, .card, .stat-card")) {
            follower.classList.add("hovering");
        } else {
            follower.classList.remove("hovering");
        }
    });

    function loop() {
        currentX += (targetX - currentX) * 0.25;
        currentY += (targetY - currentY) * 0.25;
        follower.style.left = `${currentX}px`;
        follower.style.top = `${currentY}px`;
        requestAnimationFrame(loop);
    }
    loop();
}

/* =========================================
   8. TOAST SYSTEM & DATA MANAGEMENT
========================================= */

function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "✨";
    if (type === "success") icon = "✅";
    if (type === "danger") icon = "🗑️";
    if (type === "info") icon = "ℹ️";

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px) scale(0.9)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

function animateValue(id, start, end, duration = 600) {
    const obj = document.getElementById(id);
    if (!obj) return;

    if (start === end) {
        obj.textContent = end;
        return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(easeProgress * (end - start) + start);
        obj.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
let editingNoteId = null;

document.addEventListener("DOMContentLoaded", function () {
    initLetterAnimations();
    initBgCanvas();
    init3DTiltEngine();
    initMagneticButtons();
    initCursorFollower();

    displayCurrentDate();
    displayNotes();
    displayReminders();
    updateStatistics();
});

function displayCurrentDate() {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString("en-IN", options);
    }
}

/* =========================================
   9. NOTE FUNCTIONS & FLIP GRID
========================================= */

function openNoteForm() {
    const modal = document.getElementById("noteModal");
    if (!modal) return;
    modal.classList.remove("hiding");
    modal.classList.add("show");

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";
    document.getElementById("noteFormTitle").textContent = "Add Note";
    editingNoteId = null;
}

function closeNoteForm() {
    const modal = document.getElementById("noteModal");
    if (!modal || !modal.classList.contains("show")) return;
    modal.classList.add("hiding");
    setTimeout(() => {
        modal.classList.remove("show", "hiding");
    }, 250);
}

function saveNote() {
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (title === "" || content === "") {
        showToast("Please enter both title and note content", "danger");
        return;
    }

    if (editingNoteId !== null) {
        const note = notes.find(n => n.id === editingNoteId);
        if (note) {
            note.title = title;
            note.content = content;
        }
        showToast("Note updated successfully! ✨", "success");
    } else {
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            createdAt: new Date().toLocaleDateString("en-IN")
        };
        notes.push(newNote);
        showToast("New note created! 📝", "success");
        triggerConfetti();
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    closeNoteForm();
    displayNotes();
    updateStatistics();
}

function displayNotesFLIP() {
    const container = document.getElementById("notesContainer");
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".card"));
    const firstPositions = new Map();
    cards.forEach(card => {
        firstPositions.set(card.dataset.id || card.innerHTML, card.getBoundingClientRect());
    });

    displayNotes();

    const newCards = Array.from(container.querySelectorAll(".card"));
    newCards.forEach(card => {
        const key = card.dataset.id || card.innerHTML;
        const first = firstPositions.get(key);
        if (first) {
            const last = card.getBoundingClientRect();
            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;
            if (deltaX || deltaY) {
                card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                card.style.transition = "none";
                requestAnimationFrame(() => {
                    card.style.transform = "";
                    card.style.transition = "transform 0.4s ease";
                });
            }
        }
    });
}

function displayNotes() {
    const container = document.getElementById("notesContainer");
    if (!container) return;

    const searchInput = document.getElementById("searchNotes");
    const search = searchInput ? searchInput.value.toLowerCase() : "";

    container.innerHTML = "";

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search) ||
        note.content.toLowerCase().includes(search)
    );

    if (filteredNotes.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; font-style: italic;">No notes found.</p>`;
        return;
    }

    filteredNotes.forEach((note, index) => {
        const card = document.createElement("div");
        card.className = "card 3d-card";
        card.dataset.id = note.id;
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="glare"></div>
            <div>
                <h3>${escapeHTML(note.title)}</h3>
                <p>${escapeHTML(note.content)}</p>
            </div>
            <div>
                <div class="card-date">📅 ${note.createdAt}</div>
                <div class="card-buttons">
                    <button class="edit-btn magnetic-btn" onclick="editNote(${note.id})">✏️ Edit</button>
                    <button class="delete-btn magnetic-btn" onclick="deleteNote(${note.id}, this.closest('.card'))">🗑️ Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    editingNoteId = id;
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").value = note.content;
    document.getElementById("noteFormTitle").textContent = "Edit Note";

    const modal = document.getElementById("noteModal");
    modal.classList.remove("hiding");
    modal.classList.add("show");
}

function deleteNote(id, cardElement) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    if (cardElement) {
        cardElement.classList.add("card-deleting");
        setTimeout(() => {
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem("notes", JSON.stringify(notes));
            displayNotes();
            updateStatistics();
            showToast("Note deleted", "danger");
        }, 320);
    } else {
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem("notes", JSON.stringify(notes));
        displayNotes();
        updateStatistics();
        showToast("Note deleted", "danger");
    }
}

/* =========================================
   10. REMINDER FUNCTIONS & SVG PROGRESS
========================================= */

function openReminderForm() {
    const modal = document.getElementById("reminderModal");
    if (!modal) return;
    modal.classList.remove("hiding");
    modal.classList.add("show");

    document.getElementById("reminderTitle").value = "";
    document.getElementById("reminderDescription").value = "";
    document.getElementById("reminderDate").value = "";
    document.getElementById("reminderTime").value = "";
}

function closeReminderForm() {
    const modal = document.getElementById("reminderModal");
    if (!modal || !modal.classList.contains("show")) return;
    modal.classList.add("hiding");
    setTimeout(() => {
        modal.classList.remove("show", "hiding");
    }, 250);
}

function saveReminder() {
    const title = document.getElementById("reminderTitle").value.trim();
    const description = document.getElementById("reminderDescription").value.trim();
    const date = document.getElementById("reminderDate").value;
    const time = document.getElementById("reminderTime").value;

    if (title === "" || date === "" || time === "") {
        showToast("Please fill in title, date, and time", "danger");
        return;
    }

    const reminder = {
        id: Date.now(),
        title: title,
        description: description,
        date: date,
        time: time,
        completed: false
    };

    reminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(reminders));

    closeReminderForm();
    displayReminders();
    updateStatistics();
    showToast("Reminder created! ⏰", "success");
    triggerConfetti();
}

function displayReminders() {
    const container = document.getElementById("remindersContainer");
    if (!container) return;

    container.innerHTML = "";

    if (reminders.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; font-style: italic;">No reminders available.</p>`;
        return;
    }

    reminders.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    reminders.forEach((reminder, index) => {
        const card = document.createElement("div");
        card.className = "card 3d-card";
        card.style.animationDelay = `${index * 0.05}s`;

        const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
        const now = new Date();

        let status = "Upcoming";
        let statusClass = "upcoming";

        if (reminder.completed) {
            status = "Completed";
            statusClass = "completed";
        } else if (reminderDate < now) {
            status = "Overdue";
            statusClass = "overdue";
        }

        card.innerHTML = `
            <div class="glare"></div>
            <div>
                <span class="status ${statusClass}">${status}</span>
                <h3>${escapeHTML(reminder.title)}</h3>
                <p>${escapeHTML(reminder.description)}</p>
            </div>
            <div>
                <div class="card-date">
                    📅 ${formatDate(reminder.date)} <br>
                    ⏰ ${reminder.time}
                </div>
                <div class="card-buttons">
                    ${!reminder.completed ? `
                        <button class="complete-btn magnetic-btn" onclick="completeReminder(${reminder.id}, event)">✓ Complete</button>
                    ` : ""}
                    <button class="delete-btn magnetic-btn" onclick="deleteReminder(${reminder.id}, this.closest('.card'))">🗑️ Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function completeReminder(id, event) {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    reminder.completed = true;
    localStorage.setItem("reminders", JSON.stringify(reminders));
    displayReminders();
    updateStatistics();

    if (event) {
        triggerConfetti(event.clientX, event.clientY);
    } else {
        triggerConfetti();
    }
    showToast("Reminder marked complete! 🎉", "success");
}

function deleteReminder(id, cardElement) {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    if (cardElement) {
        cardElement.classList.add("card-deleting");
        setTimeout(() => {
            reminders = reminders.filter(reminder => reminder.id !== id);
            localStorage.setItem("reminders", JSON.stringify(reminders));
            displayReminders();
            updateStatistics();
            showToast("Reminder deleted", "danger");
        }, 320);
    } else {
        reminders = reminders.filter(reminder => reminder.id !== id);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        displayReminders();
        updateStatistics();
        showToast("Reminder deleted", "danger");
    }
}

/* =========================================
   11. STATISTICS & SVG PROGRESS MATH
========================================= */

function updateStatistics() {
    const totalNotesEl = document.getElementById("totalNotes");
    const totalRemindersEl = document.getElementById("totalReminders");
    const completedRemindersEl = document.getElementById("completedReminders");

    if (totalNotesEl) {
        const current = parseInt(totalNotesEl.textContent) || 0;
        animateValue("totalNotes", current, notes.length);
    }

    if (totalRemindersEl) {
        const current = parseInt(totalRemindersEl.textContent) || 0;
        animateValue("totalReminders", current, reminders.length);
    }

    const completedCount = reminders.filter(r => r.completed).length;
    if (completedRemindersEl) {
        const current = parseInt(completedRemindersEl.textContent) || 0;
        animateValue("completedReminders", current, completedCount);
    }

    const progressCircle = document.getElementById("progressCircle");
    const progressPercent = document.getElementById("progressPercent");

    if (progressCircle && progressPercent) {
        const circumference = 2 * Math.PI * 24;
        const total = reminders.length;
        const ratio = total > 0 ? completedCount / total : 0;
        const offset = circumference - ratio * circumference;

        progressCircle.style.strokeDashoffset = offset;
        const percentValue = Math.round(ratio * 100);
        progressPercent.textContent = `${percentValue}%`;
    }
}

function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

window.onclick = function (event) {
    const noteModal = document.getElementById("noteModal");
    const reminderModal = document.getElementById("reminderModal");

    if (event.target === noteModal) closeNoteForm();
    if (event.target === reminderModal) closeReminderForm();
};

setInterval(function () {
    displayReminders();
}, 60000);