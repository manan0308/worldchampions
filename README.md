# 🏏 Champions: T20 World Cup 🇮🇳

Relive the greatest moments of Indian cricket with this React-based web application showcasing memorable T20 World Cup reels.

## ✨ Features

- 🎥 Random selection of T20 World Cup highlight reels
- 👆 Swipe functionality for mobile users
- 🌓 Dark mode toggle
- 🔗 Share functionality
- ❤️ Favorite button to save your favorite moments
- 📊 Progress bar to track viewed videos
- 📱 Responsive design for all device sizes

## 🛠 Tech Stack

- ⚛️ React 18 with Hooks
- 🎨 Tailwind CSS for styling
- 🚀 Framer Motion for animations
- 🔌 Axios for API requests
- 📊 React GA for Google Analytics integration
- 🖥️ Express.js for backend API
- 🗃️ In-memory storage for video data
- 📦 Node-cache for server-side caching

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/champions-t20-world-cup.git
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd champions-t20-world-cup
   npm install
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and another in the `backend` directory. Add the following:

   Frontend `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5002
   REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
   ```

   Backend `.env`:
   ```
   PORT=5002
   ```

4. Start the development servers:

   Frontend:
   ```bash
   npm start
   ```

   Backend:
   ```bash
   cd backend
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## 🗄️ Backend Architecture

- RESTful API built with Express.js
- In-memory storage for video data
- Node-cache for caching oEmbed responses
- Error handling middleware for consistent error responses
- Custom logging for better debugging

## 🔒 Security Measures

- CORS configuration to restrict API access
- Helmet.js for setting various HTTP headers
- Environment variables for sensitive information

## 🚀 Deployment on Heroku

1. Create a Heroku account and install the Heroku CLI.

2. Login to Heroku CLI:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create champions-t20-world-cup
   ```

4. Set up environment variables on Heroku:
   ```bash
   heroku config:set REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com
   heroku config:set REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
   ```

5. Add Heroku remote to your git repository:
   ```bash
   heroku git:remote -a champions-t20-world-cup
   ```

6. Deploy the application:
   ```bash
   git push heroku main
   ```

7. Open the deployed app:
   ```bash
   heroku open
   ```

## 🧪 Testing

- Jest can be set up for unit testing
- React Testing Library for component testing
- Supertest for API endpoint testing

## 📈 Performance Optimization

- React.lazy and Suspense for code-splitting
- Debouncing for video fetching
- Server-side caching of oEmbed responses
- Responsive image and video sizing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- All original content creators of the T20 World Cup moments
- [Manan Agarwal](https://x.com/manan_0308) for creating this project
- The React and open-source community for their invaluable tools and resources

## 📞 Contact

Manan Agarwal - [@manan_0308](https://x.com/manan_0308)

Project Link: [https://github.com/your-username/champions-t20-world-cup](https://github.com/your-username/champions-t20-world-cup)
