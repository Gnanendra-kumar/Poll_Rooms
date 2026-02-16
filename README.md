🗳️ Real-Time Poll Rooms

A full-stack web application that allows users to create polls, share them via a link, and collect votes with real-time result updates.
The project focuses on correctness, fairness, persistence, and clean user experience.

🔗 Live Demo:  https://poll-rooms-two.vercel.app/

📦 Tech Stack
Frontend

React (Create React App)

Socket.IO Client

Google OAuth (Google Identity Services)

CSS (custom, no UI framework)

Backend

Node.js

Express.js

Socket.IO

MongoDB Atlas

Mongoose

JWT (JSON Web Tokens)

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

✨ Features
1️⃣ Poll Creation

Create a poll with a question and 2 or more options

Unlimited number of options

Duplicate options (case-insensitive) are blocked

Optional poll expiry time

Generates a shareable poll link

2️⃣ Join by Link

Anyone with the link can view the poll

Voting requires Google Sign-In

Single-choice voting only

3️⃣ Real-Time Results

Votes update instantly for all users viewing the poll

No page refresh required

Implemented using Socket.IO

4️⃣ Persistence

Polls and votes are stored in MongoDB

Refreshing the page does not lose data

Share links remain valid over time

5️⃣ User Experience

Clean, minimal, and responsive UI

Skeleton loading state while data loads

Toast notifications instead of alerts

Animated vote feedback

Percentage bars with labels

Copy-link button with confirmation feedback

🔐 Fairness & Anti-Abuse Mechanisms

The app uses a two-phase verification model to reduce abusive or duplicate voting.

✅ Phase 1 (Hard Enforcement): Google OAuth

Users must sign in with Google before voting

Each vote is tied to a unique Google account (googleId)

The backend strictly enforces:

One vote per Google account per poll

Prevents:

Repeated voting by the same user

Page refresh or multi-device abuse

🛡️ Phase 2 (Soft Verification): Network & Context Signals

The backend records metadata such as:

IP address

Vote timestamp

These signals are logged, not hard-blocked

Purpose:

Monitoring

Auditing

Abuse analysis

Reason for soft enforcement:

Cloud platforms use shared proxy IPs

Hard IP blocking causes false positives in production

Design choice: Identity-based enforcement (Google OAuth) is reliable in cloud environments, while IP-based signals are used only for monitoring.

⚠️ Edge Cases Handled

Duplicate poll options (case-insensitive)

Empty or whitespace-only options

Concurrent votes (handled via atomic MongoDB updates)

Real-time race conditions

Poll expiry (voting disabled after expiry)

Page refresh during voting

Multiple users voting simultaneously

Dark-mode contrast issues

🚫 Known Limitations

Users can vote multiple times using different Google accounts

IP-based blocking is not enforced due to cloud proxy limitations

🚀 Possible Improvements

Admin / creator dashboard

Vote audit & analytics panel

Rate-limiting based on time windows

CAPTCHA or bot-detection layer

Poll option images

Poll editing & manual closing

Email-based authentication alternative

🛠️ Local Development
Backend
cd Backend
npm install
npm start
Frontend
cd frontend
npm install
npm start
📁 Project Structure
Poll-Assignment/
├── Backend/
│   ├── routes/
│   ├── models/
│   ├── index.js
│   └── db.js
└── frontend/
    ├── src/
    ├── public/
    └── package.json
🧠 Design Philosophy

Keep the system simple and robust

Prefer correctness over complexity

Avoid fragile client-side enforcement

Design fairness mechanisms that work in real deployments

Clean UX without over-engineering
