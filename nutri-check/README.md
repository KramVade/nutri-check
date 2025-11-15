# Nutri-Check

Nutri-Check is a health and nutrition application designed to help users calculate their Body Mass Index (BMI) and receive personalized food and activity recommendations based on their BMI results.

## Features

- **BMI Calculator**: Users can input their weight and height to calculate their BMI. The application categorizes the BMI into Underweight, Normal weight, Overweight, or Obese.
- **Health Suggestions**: Based on the calculated BMI, users receive tailored food and activity recommendations to help them achieve their health goals.
- **User Authentication**: The application includes a logout feature to ensure user sessions are managed securely.

## Project Structure

```
nutri-check
├── src
│   ├── components
│   │   ├── BmiCalculator.vue        # Component for calculating BMI
│   │   └── HealthSuggestion.vue      # Component for displaying health suggestions
│   ├── views
│   │   ├── Home.vue                  # Home view of the application
│   │   └── HealthSuggestionPage.vue   # View for the health suggestion page
│   ├── router
│   │   └── index.js                  # Routing configuration
│   └── main.js                       # Entry point of the application
├── package.json                       # NPM configuration file
└── README.md                          # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd nutri-check
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm run serve
   ```
2. Open your browser and navigate to `http://localhost:8080` to access the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.