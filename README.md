# argyle-task

## Description

This project is a **Posts Management Dashboard** that allows users to view, add, and delete posts. The data is fetched from a mock API and displayed in a dashboard-style layout. The app aggregates posts, user information, and comments from different API endpoints and displays them in a user-friendly interface.
Details are [here](FE%20Task.pdf).

## Features

- **Fetch Posts, Users, and Comments**: Fetches posts, users, and comments from external APIs.
- **View Post Details**: Displays detailed information for individual posts, including associated comments.
- **Add New Post**: Allows users to add new posts for any selected user.
- **Delete Post**: Users can delete posts, and the UI will reflect this change.
- **Responsive Design**: The UI is designed to be responsive and adjusts based on the device size.
- **Localization**: The app supports multiple languages using **i18next**. Default language is English.

## Tech Stack

- **React**: For building the user interface.
- **React Context and Hooks**: For state management.
- **TypeScript**: Provides type safety and improved development experience.
- **Material-UI (MUI)**: Used for component styling and layout.
- **Ky**: Simplifies API request handling.
- **i18next**: Enables localization and internationalization for multilingual support.
- **React Testing Library**: Used for unit testing the components.
- **Playwright**: Used for end-to-end testing of user interactions.

## Future Improvements

- **State Management**: As the application grows, managing the global state with React Context could become cumbersome. Migrating to a more scalable solution like **Redux** or **Zustand** could help future-proof the app.
- **Lazy Loading**: For better performance, implement lazy loading or pagination to handle large datasets, especially for posts and comments.
- **Accessibility**: Improve accessibility by adding ARIA labels and roles where necessary.

## Installation & Setup

**Clone the repository**:

- **`git clone https://github.com/romaleev/argyle-task.git`**
- **`cd argyle-task`**

**Install dependencies**:

- **`npm install`**

## Scripts

### Development

- **`npm start`**: Starts the development server using **react-scripts** with experimental JSON module support. The app will be available at `http://localhost:3000`.

### Production

- **`npm run build`**: Builds the app for production using **react-scripts**. The production files are generated in the `build` directory.

### Testing

- **`npm test`**: Runs both unit and end-to-end (E2E) tests by invoking **`npm run test-unit`** and **`npm run test-e2e`**.
- **`npm run test-unit`**: Runs unit tests using **react-scripts test** with all tests executed once (i.e., no watch mode).
- **`npm run test-unit-watch`**: Runs unit tests with **watch** mode enabled, automatically rerunning tests on file changes.
- **`npm run test-e2e`**: Runs end-to-end tests using **Playwright**. Make sure **`npm run start`** is up and running.

### Mock Data

- **`npm run update-mocks`**: Updates mock data based on external API requests.

### Linting and Formatting

- **`npm run lint`**: Runs **ESLint** for code quality checks and **Prettier** for formatting. Also ensures TypeScript definitions are checked using `tsc`.
- **`npm run lint-fix`**: Fixes linting issues using **ESLint** and formats code using **Prettier**. Additionally, it runs TypeScript checks without emitting any output.

### Dependency Management

- **`npm run update-deps`**: Updates all dependencies using **npm-check-updates** and also runs `npm audit fix` to resolve vulnerabilities.

### Project Preparation

- **`npm run prepare`**: Installs **Husky** for managing git hooks and installs the necessary browser dependencies for Playwright testing.

### Ejecting

- **`npm run eject`**: Ejects the project from **Create React App** configuration, providing full control over the Webpack and Babel configurations. **This is irreversible**.
