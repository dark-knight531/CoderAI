# 🤖 CoderAI - AI Powered Code Review Assistant

<p align="center">
  <img src="https://img.shields.io/badge/AI-Code%20Reviewer-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=for-the-badge"/>
</p>


## 📌 Overview

**CoderAI** is an AI-powered code review and debugging assistant designed to help developers write better code by providing intelligent analysis, error explanations, optimization suggestions, and improvement recommendations.

The platform uses **Large Language Models (LLMs)** to analyze user-submitted code and generate detailed feedback similar to an experienced developer reviewing code.

---

# ✨ Features

## 🧠 AI Code Review

- Analyze code using advanced AI models
- Detect logical errors and inefficient approaches
- Suggest optimized solutions
- Explain coding best practices


## 🐞 Intelligent Debugging

- Identify possible bugs
- Explain runtime and compilation issues
- Provide step-by-step debugging guidance


## 💡 Code Improvement Suggestions

- Improve code readability
- Suggest performance optimizations
- Recommend better programming practices


## ⚡ Fast AI Responses

- Optimized API communication
- Real-time AI-generated responses
- Smooth developer experience


## 🎨 Modern Developer Interface

- Clean and responsive UI
- User-friendly code input experience
- Structured AI feedback presentation


---

# 🏗️ Application Architecture


```
                User

                 |
                 |

        React Frontend

                 |

                 |

        Express REST API

                 |

                 |

        Groq API Service

                 |

                 |

          LLaMA 3.3 Model

                 |

                 |

        AI Code Review Output
```


---

# 🛠️ Tech Stack


## Frontend

| Technology | Purpose |
|------------|---------|
| React.js | User Interface |
| JavaScript | Frontend Logic |
| Tailwind CSS | Styling |
| Vite | Development Environment |


## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | REST API Development |
| CORS | Cross-Origin Requests |
| dotenv | Environment Management |


## Artificial Intelligence

| Technology | Purpose |
|------------|---------|
| Groq API | AI Model Access |
| LLaMA 3.3 | Code Analysis & Generation |


## Tools

- Git
- GitHub
- Postman
- Vercel
- Render


---

# 📂 Project Structure


```
CoderAI
│
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
│
├── backend
│   │
│   ├── controllers
│   ├── routes
│   ├── config
│   ├── server.js
│   ├── package.json
│   └── .env
│
│
└── README.md

```


---

# ⚙️ Installation & Setup


## 1. Clone Repository


```bash
git clone https://github.com/yourusername/CoderAI.git

cd CoderAI
```


---

# Frontend Setup


Navigate to frontend:


```bash
cd frontend
```


Install dependencies:


```bash
npm install
```


Start development server:


```bash
npm run dev
```


Frontend will run on:

```
http://localhost:5173
```


---

# Backend Setup


Open another terminal:


```bash
cd backend
```


Install dependencies:


```bash
npm install
```


Create `.env` file:


```env
PORT=5000

GROQ_API_KEY=your_groq_api_key
```


Start backend:


```bash
npm run dev
```


Backend will run on:


```
http://localhost:5000
```


---

# 🔄 Working Flow


```
1. User enters code snippet

          ↓

2. React sends request to backend

          ↓

3. Express API processes request

          ↓

4. Backend sends prompt to Groq API

          ↓

5. LLaMA 3.3 analyzes code

          ↓

6. AI response returned to user

          ↓

7. Developer receives code review
```


---

# 📸 Screenshots


Add your project screenshots here:


## Homepage

<img src="./screenshots/home.png">


## Code Editor

<img src="./screenshots/editor.png">


## AI Review Output

<img src="./screenshots/result.png">


---

# 🚀 Deployment


Frontend:

```
Vercel
```


Backend:

```
Render
```


---

# 🔮 Future Enhancements


- [ ] Support multiple programming languages
- [ ] User authentication system
- [ ] Save previous code reviews
- [ ] GitHub repository code analysis
- [ ] AI generated unit tests
- [ ] VS Code extension
- [ ] Code quality scoring system


---

# 🎯 Learning Outcomes


Through this project I explored:


- Building full-stack applications using MERN stack
- Integrating Generative AI APIs
- Working with Large Language Models
- Designing REST APIs
- Handling asynchronous AI responses
- Creating developer-focused tools


---

# 👨‍💻 Author


## Ojas Chauhan


B.Tech Chemical Engineering  
Maulana Azad National Institute of Technology, Bhopal


### Connect With Me


GitHub:
```
https://github.com/dark-knight531
```


LinkedIn:
```
https://linkedin.com/in/ojaschauhan12
```


Email:
```
ojaschauhan587@gmail.com
```


---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
