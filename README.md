![Shiori Banner Image](/public/shiori-banner.jpg)

# Shiori - Trip Planner & Manager

Shiori is a simple and user-friendly trip planner and manager that helps you organize and document your trips. You can plan your trips, add events, and capture your memories all in one place.

### Features:

- **Create New Trips**: Add a trip with essential details like title, location, dates, and images.
- **Event Tracking**: Add events during your trip to document activities, with titles and descriptions.
- **Trip Overview**: See all trips on the home screen with basic information. Click on a trip for detailed views.
- **Trip Management**: Edit or delete trips as needed.
- **Travel Data Insights**: Track your travel data and history.
- **Google Authentication**: Log in using your Google account to securely access and manage your trips.

---

## Tech Stack

Shiori is built with the following technologies:

- **Frontend**:

  - **React**
  - **TypeScript**
  - **Tailwind CSS**
  - **Framer Motion**
  - **Lottie**
  - **Vite**

- **Backend**:

  - **Firebase**

- **Other Tools**:
  - **Figma** (for UI/UX design)
  - **Unsplash API** (for banner/cover image selection)

---

## Installation Instructions

To run Shiori locally, follow these steps:

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Firebase account** for Firebase configuration (authentication, database, etc.)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/shiori.git
   ```
2. **Navigate to the project folder:**:

```bash
 cd shiori
```

3. **Install dependencies:**:

```bash
 npm install
```

4. **Set up Firebase:**:

- Create a Firebase project on the Firebase Console.
- Set up Firebase Authentication (Google Sign-in) in the Firebase Console.
- Add your Firebase project’s config to the project (use .env or configure directly in the app).

5. **Run the application locally**:

```bash
 npm run dev
```

## Usage

To get started with Shiori, follow these simple steps:

1. **Sign In**: When you first open the app, you’ll be prompted to log in using your Google account. This ensures that all your trips and data are securely linked to your account.

2. **Create a New Trip**:

   - Click on the "New Trip" button to start adding a new trip.
   - Enter details like the trip title, location, dates, and upload a banner/cover image to make it unique.
   - You can also write a brief description or notes about your trip.

3. **Add Events**:

   - Inside each trip, you can add multiple events.
   - Each event includes a title (e.g., "Day 1: Explore the City") and a content section (for detailing what you did during the event).
   - Use this feature to capture your daily activities, locations, or highlights from your travels.

4. **Manage Trips**:

   - All your trips will appear on the home screen, displaying basic information like the title, location, and dates.
   - Click on any trip to view the details, edit it, or delete it if needed.

5. **Track Travel Data**:
   - Navigate to the "Travel Data" page to view your travel history and statistics. This feature provides a summary of your trips, helping you track your adventures over time.

### Example Workflow:

- **Start a trip** → **Add events** → **View your trips** → **Manage or edit trips** → **Track your travel data**

## Contributing

We welcome contributions to improve Shiori! To get started, follow these steps:
