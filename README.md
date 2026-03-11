# Viral Content Predictor

A full-stack machine learning project that predicts whether social media content has the potential to go viral. The application combines a Flask backend, a React frontend, and a Random Forest machine learning model to analyze content features and generate predictions.

## Project Overview

The Viral Content Predictor analyzes different factors of social media posts such as hashtags, mentions, emojis, and engagement rate to determine whether the content is likely to go viral.

The application includes:

* A trained machine learning model
* A Flask REST API for predictions
* A React dashboard for user interaction
* SQLite database for storing prediction history
* Visualization of statistics and previous predictions

## Tech Stack

### Backend

* Python
* Flask
* scikit-learn
* pandas
* SQLite

### Frontend

* React
* Axios
* CSS3

### Machine Learning

* Random Forest Classifier
* StandardScaler for feature scaling

## Project Structure

```
viral-predictor
│
├── backend
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── models
│   ├── data
│   └── utils
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── README.md
└── .gitignore
```

## Installation and Setup

### Clone the repository

```
git clone https://github.com/snehach03/viral-content-predictor.git
cd viral-content-predictor
```

### Backend Setup

Navigate to the backend folder

```
cd backend
```

Create a virtual environment

```
python -m venv venv
```

Activate the environment (Windows)

```
venv\Scripts\activate
```

Install dependencies

```
pip install -r requirements.txt
```

Train the machine learning model

```
python train_model.py
```

Run the Flask server

```
python app.py
```

The backend server will run at:

```
http://localhost:5000
```

### Frontend Setup

Open a new terminal and navigate to the frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Start the React development server

```
npm start
```

The frontend application will run at:

```
http://localhost:3000
```

## Features

* Predict whether a social media post will go viral
* Display prediction confidence score
* Store and view prediction history
* Statistics dashboard for previous predictions
* Content analysis based on multiple features such as:

  * Content length
  * Number of hashtags
  * Mentions
  * URLs
  * Emojis
  * Engagement rate
  * Posting hour
  * Day of week

## Machine Learning Model

Model used: Random Forest Classifier

Features used for prediction:

* content_length
* hashtags_count
* mentions_count
* urls_count
* emojis_count
* engagement_rate
* posting_hour
* day_of_week

Expected model accuracy: approximately 85–90%.

## Future Improvements

* Integration with real social media datasets
* Image content analysis
* Trending topic detection
* Advanced analytics dashboard
* Real-time predictions
* Deployment using Docker

