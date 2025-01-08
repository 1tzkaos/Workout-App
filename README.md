# Fitness Tracking Mobile App

## Overview

My friend didn't want to pay a subscription to track his workout data, so I just created the app vagain
This is a React Native mobile application designed to help users track their workout exercises, sets, and progress. The app provides an intuitive interface for logging workout sets, viewing exercise history, and analyzing performance over time.

## Features

### Key Functionalities
- Add and manage exercises
- Log individual sets with weight and repetitions
- View exercise history
- Track last used dates for exercises
- Analyze exercise performance with charts
- Delete previously logged sets

### Screens
1. **Home Screen**
   - Display list of exercises
   - Quick tip for logging sets
   - Add new exercises
   - Bottom navigation

2. **Add Exercise Screen**
   - Search and select from popular exercises
   - Add custom exercises
   - Save selected exercises to personal list

3. **Exercise Detail Screen**
   - View sets for a specific exercise
   - See last used date
   - Quick access to analytics
   - Swipe to delete sets
   - Add new sets

4. **Add Set Screen**
   - Log weight and repetitions
   - Numeric keypad for input
   - Record sets for specific exercises

5. **Analytics Screen**
   - View progress charts for weight and reps
   - Display max and average weight statistics
   - Visualize last 7 sets

## Technologies Used
- React Native
- AsyncStorage for local data persistence
- React Navigation for screen routing
- react-native-chart-kit for visualizations
- react-native-gesture-handler for swipe interactions

## Data Storage
The app uses AsyncStorage to persist data locally:
- `@exercises`: Stores user's exercise list
- `@workout_sets`: Stores individual workout sets

## Installation

### Prerequisites
- Node.js
- React Native CLI
- Expo (recommended)

### Setup Steps
1. Clone the repository
   ```bash
   git clone https://github.com/1tzkaos/Workout-App.git
   ```

2. Install dependencies
   ```bash
   cd Workout-App
   npm install
   ```

3. Run the application
   ```bash
   npx react-native run-ios   # For iOS
   npx react-native run-android   # For Android
   ```

## Project Structure
- `screens/`: Contains all screen components
  - `HomeScreen.js`
  - `AddExerciseScreen.js`
  - `ExerciseDetailScreen.js`
  - `AddSetScreen.js`
  - `AnalyticsScreen.js`
- `components/`: Reusable UI components

## Customization
- Modify `POPULAR_EXERCISES` in `AddExerciseScreen.js` to change default exercise list
- Adjust styles in each screen's stylesheet for custom theming

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Nick
