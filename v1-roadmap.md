# Woodhill Ward Website - Setup & V1 Roadmap

## Phase 1: Local Environment Preparation

Before writing any code, we need to ensure your local machine is equipped with the necessary tools to run and manage a Vue.js project.

1. **Install VS Code:** Download and install Visual Studio Code as your primary IDE.
2. **Install VS Code Extensions:** * Search for and install the **Vue - Official** extension. This provides essential syntax highlighting and error checking for Vue's Single-File Components.
3. **Install Node.js:** Download and install the LTS (Long Term Support) version of **Node.js**. This installs `npm` (Node Package Manager) behind the scenes, which is strictly required to download Vue, Firebase, and run your local development server.

## Phase 2: GitHub Repository Setup

Version control is essential. We will set this up before scaffolding the project so your entire history is tracked from minute one.

1. **Create the Repo:** Go to GitHub and create a new repository named `woodhill-ward-website`.
* *Note: Do NOT initialize it with a README, .gitignore, or license just yet. Vue's setup tool will generate these for you.*


2. **Clone to Local:** Open VS Code, open a new Terminal window, and run `git clone [your-github-repo-url]`.
3. **Navigate:** Open the newly cloned (and currently empty) folder in VS Code.

## Phase 3: Firebase & Firestore Configuration

This sets up your backend infrastructure on the free tier.

1. **Create the Project:** Go to the Firebase Console, click "Add Project", and name it `Woodhill Ward Website`. Disable Google Analytics for now to keep the setup as simple as possible.
2. **Enable Authentication:**
* Navigate to **Build > Authentication** in the sidebar.
* Click "Get Started" and enable the **Email/Password** sign-in method.


3. **Enable Firestore Database:**
* Navigate to **Build > Firestore Database**.
* Click "Create Database".
* Start in **Test Mode**. (Note: This temporarily leaves the database open so we can test V1 easily. We will lock this down later using Firebase Security Rules based on your user roles ).


* Choose a server location closest to Utah (e.g., `us-west2` or `us-west3`).


4. **Enable Cloud Storage:**
* Navigate to **Build > Storage**.
* Click "Get Started" and start in Test Mode.


5. **Register the Web App:** Go to the Project Overview page, click the Web icon (`</>`), register the app, and save the provided `firebaseConfig` block. You will need this configuration text soon.

## Phase 4: Vue.js Project Initialization

Now we will generate the actual codebase inside your GitHub folder.

1. **Scaffold the App:** In your VS Code terminal (ensure you are inside your repository folder), run:
`npm create vue@latest .` *(The period at the end tells it to build inside the current folder).*
2. **Configuration Choices:** The prompt will ask several setup questions. To keep it aligned with your HTML/JS background and bare-bones approach, answer as follows:
* TypeScript: **No**
* JSX: **No**
* Vue Router: **Yes** *(Crucial for navigating between the feed, user profiles, and admin tools).*
* Pinia (State Management): **No**
* Vitest / End-to-End Testing: **No**
* ESLint / Prettier: **Yes** *(Helps catch basic JavaScript typos).*


3. **Install Core Dependencies:** Run `npm install` to download the standard Vue packages.
4. **Install Backend Dependencies:** Run `npm install firebase vuefire` to add the tools needed to connect to your new database.

## Phase 5: V1 Development Strategy (Logic First)

Since V1 will feature zero CSS formatting, development should proceed in this specific order to ensure data integrity:

1. **Auth First:** Build plain HTML forms for Sign Up, Log In, and Log Out. Verify that new users successfully appear in the Firebase Authentication console.
2. **Database Connection:** Initialize Firebase using your saved `firebaseConfig`. Write a script so that upon signing up, a document is automatically created in the `users` Firestore collection matching the user's Auth UID.


3. 
**Core CRUD (Create, Read, Update, Delete):** Build simple HTML inputs and buttons to create posts and comments. Ensure they sync with Firestore and display in real-time on the page.


4. 
**Role & Permission Testing:** Manually edit a user's role in the Firestore console from `viewer` to `mod`. Write conditional logic to test if "Create Event" and "Create Announcement" buttons properly hide or show based on that role change.