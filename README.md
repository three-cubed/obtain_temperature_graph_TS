### Temperature data analysis

#### Project Overview

The aim of this project is to consume another API's data, to process that data to obtain particular information, and to display the processed data in graphical form.

The project obtains hourly data for the last five days of weather in London. It then:
- calculates the daily temperature maxima and minima, and displays these as two lines on a graph;
- calculates Pearson's correlation coefficient between the daily maximum and minimum figures;
- calculates standard deviations for the daily maximum and minimum figures.

The original data come from *openweathermap.org*.

The project uses NodeJS, statistics.js, chart.js (via a source tag) & the Fetch API.

#### Typescript

This version of the temperature analysis application uses Typescript. The user does not need to concern himself or herself with this - The file structure uses no `src` or `dist` folders and no build is required. The Typescript files are already compiled as Javascript before the project is pushed to the repository.

#### Before using the application

Before first use:
1. Install NodeJS, if it is not already installed on your system.
2. Use the command `npm install` on the root directory.
3. Create a `.env` file in the root directory.
4. Get an API key by signing up to *openweathermap.org*. This is free and quickly done.
5. Enter your API key as `API_KEY=` into the `.env` file, for example: 
&emsp;API_KEY=a123456789b987654321c654321d0987

#### Using the application

Type `npm start` into the terminal. 

Then go to `http://localhost:3010`.

#### Licence
Attribution - NonCommercial - NoDerivatives 4.0 International (CC BY-NC-ND 4.0)
