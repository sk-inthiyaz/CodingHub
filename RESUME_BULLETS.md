# Resume Bullets — Coding Hub Project

## Full Stack Engineer
- Built a full-stack MERN application with JWT auth, role-based access, and AI-assisted coding workflows, integrating React, Express, MongoDB, and Docker.
- Designed REST APIs for practice problems, streak questions, discussions, profiles, and settings; enforced auth middleware and admin policies across endpoints.
- Implemented Docker-based multi-language code execution (JS/Python/Java/C++) with resource limits and timeouts, improving sandbox security and reliability.
- Optimized data access via indexed queries and projections (e.g., `activeDate`, `difficulty`, `topic`), reducing query latency across practice and streak modules.
- Delivered LeetCode-style Run vs Submit flows with public/hidden test cases and detailed failure reporting, increasing user debugging effectiveness.
- Instrumented local environment configs (`.env`) and robust error handling with structured controller responses, enhancing developer productivity and maintainability.

## Frontend Engineer
- Built React SPA with route-driven pages (Practice, Streak, Discussions, Admin, Profile) using React Router and Context-based auth state.
- Integrated Monaco Editor for multi-language code editing with dynamic templates and dark-mode support, improving UX for practice and streak modules.
- Implemented paginated lists, result panels, and detailed test feedback (expected vs actual) using modular components and state management.
- Rendered AI explanations via `react-markdown` and syntax highlighting, enabling readable, structured code insights in chat and assistant views.
- Improved UI performance by scoping local state, minimizing re-renders in editor flows, and lazy-loading heavy views where appropriate.

## Backend Engineer
- Developed Express APIs covering auth (`/api/auth`), practice (`/api/practice`), streak (`/api/streak`), discussions (`/api/discussions`), and admin routes with layered middleware.
- Implemented code execution pipeline: harness generation per language + `dockerRunner` with memory/CPU limits and stdout/stderr parsing for error diagnostics.
- Designed Mongoose models for `User`, `PracticeProblem`, `StreakQuestion`, `Submission`, `Discussion`, and `ChatHistory` with indexes on hot fields.
- Built acceptance-rate tracking and submission statistics; denormalized counters to speed up reads on dashboards and lists.
- Added robust validation (e.g., `returnType` whitelist, payload checks) and defensive error handling to prevent malformed uploads and improve API resilience.

## AI/ML Engineer
- Integrated Google Gemini 2.0 Flash API for code explanation/generation via curated prompts and markdown-formatted responses.
- Implemented input heuristics to gate AI calls to code-like content, reducing wasted tokens and improving relevance of generated explanations.
- Standardized AI output rendering with markdown + syntax highlighting to enhance readability and developer comprehension.
- Structured prompts to elicit stepwise explanations, complexity analysis, and driver code summaries aligned to the project’s learning goals.

## MERN Stack Developer
- Delivered end-to-end MERN features: React UI, Express REST APIs, MongoDB models, and Dockerized execution for language runtimes.
- Implemented JWT authentication, role-based admin gates, and protected routes, aligning with common SaaS patterns.
- Built streak, practice, and discussion modules with pagination, stats aggregation, and user histories.
- Configured local environment (.env for `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`) and CORS for local dev, enabling smooth multi-service workflows.

## System Engineer
- Engineered secure code-execution subsystem using Docker containers (`node:alpine`, `python:alpine`, `openjdk:alpine`, `gcc`) with strict resource constraints.
- Established harness-driven I/O across languages and normalized output comparison (JSON, numeric, string) to ensure consistent validation.
- Implemented cleanup of temp artifacts and enforced timeouts to prevent runaway processes; planned network isolation for containers.
- Tuned system via DB indexing and request-level projections to lower server load and improve responsiveness under typical usage.

## Associate Software Engineer
- Implemented core features across the stack: auth, practice submissions, streak flows, and discussion CRUD with voting and comments.
- Wrote maintainable controllers and utilities (validator, code harness, docker runner) with clear logging and error responses.
- Collaborated with UI flows to provide actionable feedback (test case diffs, compile/runtime errors) enhancing user learning outcomes.
- Contributed to admin tooling for problem uploads and content management with strong validation and safe overwrite behaviors.

---

## Project Experience Summary
Built a full-stack coding platform combining AI-powered code explanations, a LeetCode-style practice system, and community discussions. Implemented secure, Docker-based multi-language execution, robust REST APIs, JWT auth, and indexed MongoDB models to deliver reliable local-first workflows with detailed test and error reporting.

## Skills Extracted From This Project
- Languages/Frameworks: React, JavaScript, Node.js, Express, MongoDB, Mongoose, Python, Java, C++
- Tools/Platforms: Docker, Google Gemini API, Axios, React Router, react-markdown, Monaco Editor
- Backend/Systems: JWT auth, role-based access control, RESTful APIs, CORS, environment configuration
- Data/Models: Indexing, denormalization, acceptance-rate tracking, submission histories
- Testing/Validation: Payload validation, output normalization, compile/runtime error parsing
- Architecture/Design: MERN stack, layered middleware, modular controllers/utilities, local-first deployment strategy
- Performance/Optimization: Indexed queries, projections, Alpine images, pagination, cleanup/timeout control
