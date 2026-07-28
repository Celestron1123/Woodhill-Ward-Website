# Woodhill Ward Website

A robust, mobile-first social media and communication platform designed specifically for the Woodhill Ward.

## Project Scope

The Woodhill Ward Website aims to provide a functional and accessible communication channel for all ward members. Built with a focus on simplicity and readability, the platform ensures an intuitive experience for users of all technical abilities.

### Key Features

- **Community Feed:** Verified members can share updates, post pictures with captions, and comment on other posts.
- **Announcements & Events:** Ward leaders can post official announcements and manage a ward calendar.
- **Role-Based Access Control:** A tier-based permission system (Viewer, Verified, Mod, Admin, Dev) ensures that only verified members can interact with the community, maintaining a safe and appropriate environment.
- **Content Tagging:** Posts can be categorized with tags (e.g., Young Men’s, Relief Society) for easy sorting and retrieval.
- **Secure Authentication:** Features email verification to lower bot counts and secure identity management.

## Technology Stack

The technology stack was chosen to prioritize ease of development, maintainability, and cost-effectiveness.

- **Front-End Framework:** Vue.js - Chosen for its approachability and simple integration with standard web languages.
- **Core Web Languages:** HTML, CSS, JavaScript.
- **Database:** Firebase Firestore - A NoSQL document database acting as the primary, cost-effective data store.
- **Identity Management:** Firebase Auth - Handles user authentication and email verification securely.
- **File Hosting:** TBD - Firebase Storage is paywalled now, so another service will likely have to be used.
- **Integration:** VueFire - Manages real-time data syncing between Firestore and the Vue frontend.
- **Tools:** GitHub for version control and VS Code for code development.

## Authors

- Elijah Potter
- Lauren Cunningham
