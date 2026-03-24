# Weather Dashboard

A polished React weather app that lets users search for any city and view live weather conditions in a clean, responsive interface.

**Live demo:** https://weaather-dvjhf0vmq-jonathan-wrenns-projects.vercel.app/

---

## Overview

This project started as a simple weather lookup app and was later redesigned into a more portfolio-ready frontend project with a stronger UI, better state handling, and a cleaner user experience.

Users can search for a city and instantly view:
- current temperature
- weather condition
- feels-like temperature
- humidity
- wind speed
- pressure
- visibility
- daily high / low

---

## Features

- **Live city search** using the OpenWeather API
- **Responsive UI** that works on desktop and mobile
- **Quick-search chips** for popular cities
- **Loading and error states** for better UX
- **Condition-based visual theme** for different weather types
- **Custom weather visuals** for a more consistent design language

---

## Tech Stack

- **React**
- **JavaScript**
- **CSS**
- **OpenWeather API**
- **Vercel** for deployment

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/jonowrenn/WeatherApp.git
cd WeatherApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the project root:

```bash
REACT_APP_API_KEY=your_openweather_api_key_here
```

### 4. Start the development server

```bash
npm start
```

---

## Deployment

This project is deployed with **Vercel**.

To deploy your own version:
1. import the repository into Vercel
2. add `REACT_APP_API_KEY` in the project environment variables
3. deploy

---

## What I Improved

Compared to the original version of this app, I improved:
- the visual design and layout
- search UX and empty states
- loading and error handling
- weather detail presentation
- deployment setup and production readiness

---

## Future Improvements

Possible next steps:
- geolocation support
- multi-day forecast
- saved recent searches
- animated weather transitions

---

## Author

**Jonathan Wrenn**  
- Portfolio: https://jonathanwrenn.com  
- LinkedIn: https://www.linkedin.com/in/jonathanwrenn218/  
- GitHub: https://github.com/jonowrenn
