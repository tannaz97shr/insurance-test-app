# Smart Insurance Application Portal

## Overview

The **Smart Insurance Application Portal** is a web-based platform designed to allow users to apply for insurance by selecting and filling out dynamic forms. It is built using modern front-end technologies and best practices for scalability and maintainability.

## Features

- Dynamic form rendering based on selected insurance type
- Responsive UI with support for dark mode
- API integration for fetching form structures
- State management using React Hooks
- Modular and maintainable code structure

## Tech Stack

- **Framework**: React.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router
- **HTTP Requests**: Axios
- **Package Manager**: Yarn

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/smart-insurance-portal.git
   cd smart-insurance-portal
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Start the development server:
   ```sh
   yarn dev
   ```

## API Integration

This project uses Axios to fetch form structures dynamically from an API.

- **Endpoint:** `GET /api/forms`
- **Response Example:**
  ```json
  [
    {
      "formId": "life-insurance",
      "title": "Life Insurance Application",
      "fields": [...]
    }
  ]
  ```

## Dark Mode Support

The application supports dark mode using Tailwind’s `dark:` variant. Ensure your system or browser theme is set to dark mode for automatic adaptation.

## Deployment

To build the project for production:

```sh
yarn build
```

Then, serve it using a static file server or deploy to platforms like Vercel or Netlify.

## Contributing

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

## License

This project is licensed under the MIT License.
