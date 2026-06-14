
# Lotto Number Generator

This is a simple web application that generates random lottery numbers with a modern, responsive UI and theme support.

## Features

*   **Lotto Generation:** Generates 6 unique random numbers between 1 and 45.
*   **Animated UI:** Displays the generated numbers with a staggered animation and color-coded balls.
*   **Theme Support:** Supports both Light and Dark modes, with persistence via LocalStorage.
*   **Contact Form:** Integrated a feedback/contact form using Formspree for backend processing.
*   **Modern Design:** Clean, centered layout with expressive typography and polished shadows.

## Project History & Implementation Details

*   **Base Framework:** Framework-less (Vanilla HTML/CSS/JS).
*   **Styling:** Modern CSS using Flexbox, CSS Variables, and transitions.
*   **Interactivity:** Vanilla JS for DOM manipulation and logic.

## Current Plan: Add Theme Support (Light/Dark Mode)

1.  **CSS Refactoring:**
    *   Introduce CSS variables for background, text, container, and accent colors.
    *   Define a `[data-theme="dark"]` selector to override these variables.
2.  **UI Enhancement:**
    *   Add a theme toggle button in the header/top corner of the container.
    *   Use an icon or clear text to indicate the current state.
3.  **JavaScript Logic:**
    *   Implement a toggle function that switches the `data-theme` attribute on the `<html>` element.
    *   Save the user preference in `localStorage`.
    *   Apply the saved theme (or system preference) on page load.
4.  **Deployment:**
    *   Commit the changes and push to GitHub.
