 Real-Time Poll Rooms =>

A full-stack web application that allows users to create polls, share them via a link, and collect votes with real-time result updates.
The project focuses on correctness, fairness, persistence, and clean user experience.

🔗 Live Demo:  https://poll-rooms-two.vercel.app/

📦 Tech Stack
Frontend:

React (Create React App)
Socket.IO Client
Google OAuth (Google Identity Services)
CSS (custom, no UI framework)

Backend:

Node.js
Express.js
Socket.IO
MongoDB Atlas
Mongoose
JWT (JSON Web Tokens)

Deployment =>

Frontend: Vercel
Backend: Render
Database: MongoDB Atlas

✨ Features
1️⃣ Poll Creation:

1.Create a poll with a question and 2 or more options
2.Unlimited number of options
3.Duplicate options (case-insensitive) are blocked
4.Optional poll expiry time
5.Generates a shareable poll link

2️⃣ Join by Link:

1.Anyone with the link can view the poll
2.Voting requires Google Sign-In
3.Single-choice voting only

3️⃣ Real-Time Results:

1.Votes update instantly for all users viewing the poll
2.No page refresh required
3.Implemented using Socket.IO

4️⃣ Persistence:

1.Polls and votes are stored in MongoDB
2.Refreshing the page does not lose data
3.Share links remain valid over time

5️⃣ User Experience:

1.Clean, minimal, and responsive UI
2.Skeleton loading state while data loads
3.Toast notifications instead of alerts
4.Animated vote feedback
5.Percentage bars with labels
6.Copy-link button with confirmation feedback

🔐 Fairness & Anti-Abuse Mechanisms:

The app uses a two-phase verification model to reduce abusive or duplicate voting.

✅ Phase 1 (Hard Enforcement): Google OAuth

1.Users must sign in with Google before voting
2.Each vote is tied to a unique Google account (googleId)
3.The backend strictly enforces:
4.One vote per Google account per poll

Prevents:

1.Repeated voting by the same user
2.Page refresh or multi-device abuse

✅ Phase 2 (Soft Verification): Network & Context Signals

The backend records metadata such as:

1.IP address
2.Vote timestamp
3.These signals are logged, not hard-blocked

Purpose:

1.Monitoring
2.Auditing
3.Abuse analysis

Reason for soft enforcement:

1.Cloud platforms use shared proxy IPs
2.Hard IP blocking causes false positives in production
3.Design choice: Identity-based enforcement (Google OAuth) is reliable in cloud environments, while IP-based signals are used only for monitoring.

⚠️ Edge Cases Handled:

1Duplicate poll options (case-insensitive)
2.Empty or whitespace-only options
3.Concurrent votes (handled via atomic MongoDB updates)
4.Real-time race conditions
5.Poll expiry (voting disabled after expiry)
6.Page refresh during voting
7.Multiple users voting simultaneously

Known Limitations:

1.Users can vote multiple times using different Google accounts
2.IP-based blocking is not enforced due to cloud proxy limitations

Possible Improvements:

1.Admin / creator dashboard
2.Vote audit & analytics panel
3.Rate-limiting based on time windows
4.CAPTCHA or bot-detection layer
5.Poll option images
6.Poll editing & manual closing
7.Email-based authentication alternative

✅Design:

1.Keep the system simple and robust
2.Prefer correctness over complexity
3.Avoid fragile client-side enforcement
4.Design fairness mechanisms that work in real deployments
5.Clean UX without over-engineering
