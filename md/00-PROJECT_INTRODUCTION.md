# PassAI - AI-Powered Study Assistant

## 🎯 Project Overview

PassAI is a web application that helps students prepare for exams more effectively using AI. Students upload their study materials (PDFs, images, notes), and the app uses AI to generate personalized quizzes, predict their chances of passing, create study plans, and gamify the learning experience.

## 👥 Target Users

- **Primary:** High school and college students preparing for exams
- **Secondary:** Anyone studying for certifications or standardized tests

## 🎨 Core Value Proposition

**"Turn your study materials into personalized practice tests and know exactly how ready you are for your exam."**

Instead of passively reading notes, students actively test themselves with AI-generated questions from their own materials, track their progress, and get data-driven predictions about their exam readiness.

## 🌟 Key Features

### 1. Subject Management

Students organize their studies by subjects (e.g., "Biology Midterm", "History Final"). Each subject has:

- A name and optional description
- Test date (when the exam is)
- Progress tracking (how much they've studied)
- Pass chance prediction (likelihood of passing based on quiz performance)

### 2. Material Upload & Management

Students upload study materials to each subject:

- **Supported formats:** PDFs, images (JPG, PNG), text files
- **Text extraction:** Automatically extracts text from PDFs and uses OCR for images
- **Organization:** All materials for a subject are stored together
- **Preview:** Students can view uploaded materials and their extracted text

### 3. Quiz Generation & Taking

The core feature - generate practice quizzes from study materials:

- **Three generation methods:**
  - **Basic:** Fast, local generation (no AI costs)
  - **Advanced:** Better quality, still local
  - **AI-Powered:** Uses OpenAI for sophisticated questions (premium feature)
- **Customization:** Choose difficulty (easy/medium/hard) and number of questions (5-20)
- **Question types:** Multiple choice with 4 options
- **Taking experience:** Clean interface, track progress, can skip/return to questions
- **Immediate feedback:** See score, percentage, correct/incorrect breakdown
- **Review mode:** Review all questions with explanations after completing

### 4. Analytics & Predictions

Data-driven insights to help students understand their readiness:

- **Pass chance prediction:** Bayesian model that predicts likelihood of passing based on quiz performance, time until exam, and study consistency
- **Progress visualization:** Interactive charts showing improvement over time
- **Study plans:** AI-generated personalized study recommendations based on weak areas

### 5. Gamification (Study Garden)

Make studying fun and engaging:

- **Virtual garden:** Grows as students study and take quizzes
- **Plants/trees:** Unlock new plants by hitting study milestones
- **Mood tracking:** Log how they feel before/after study sessions
- **Streaks:** Track consecutive days of studying

### 6. Subscription System

- **Free tier:** Limited features (basic quiz generation, 3 subjects max)
- **Premium tier:** AI quiz generation, unlimited subjects, advanced analytics
- **Stripe integration:** Secure payment processing

## 🎭 User Journey Example

**Sarah, a college student preparing for her Biology exam:**

1. **Signs up** for PassAI with email/password
2. **Creates a subject** called "Biology Midterm" with exam date in 2 weeks
3. **Uploads materials:** Her class notes (PDF), textbook photos (JPG), study guide (TXT)
4. **Generates a quiz:** Selects "Medium" difficulty, 10 questions, AI-powered generation
5. **Takes the quiz:** Answers questions, submits when done
6. **Reviews results:** Scored 70%, reviews incorrect answers with explanations
7. **Checks analytics:** Pass chance shows 65%, sees she's weak on photosynthesis
8. **Gets study plan:** AI recommends focusing more on chapters 5-7
9. **Takes more quizzes:** Over the next week, takes 3 more quizzes, score improves to 85%
10. **Pass chance updates:** Now showing 82% chance of passing
11. **Checks garden:** Her study garden has grown with new plants from her study streak

## 🎯 Success Criteria

A successful implementation should:

- Be intuitive enough that students can start generating quizzes within 5 minutes of signing up
- Generate high-quality, relevant quiz questions that actually test understanding
- Provide accurate, helpful predictions about exam readiness
- Make studying feel less like a chore through gamification
- Be fast and responsive (quiz generation under 10 seconds for basic/advanced)
- Handle errors gracefully (file upload failures, API errors, etc.)
- Work on mobile devices (responsive design)

## 🔒 Security & Privacy

- User data is private and secure
- Students can only access their own subjects and materials
- File storage is secure (Supabase storage with access control)
- Payment information handled securely through Stripe (never stored directly)

## 🚀 Technical Context

- **Frontend:** React with TypeScript, TailwindCSS, ShadCN UI components
- **Backend:** Supabase (PostgreSQL database, Authentication, Storage, Edge Functions)
- **AI:** OpenAI API for advanced quiz generation
- **Payments:** Stripe for subscriptions

## 📈 Future Vision

- Mobile app (iOS/Android)
- Collaborative study groups
- Flashcard generation
- Voice quiz mode
- Integration with learning management systems (Canvas, Blackboard)
- Study buddy matching (connect students studying same subjects)

---

**This is PassAI. An AI-powered study companion that transforms passive studying into active, data-driven exam preparation.**
