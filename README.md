# API-TEST

## Table of Contents

- [Introduction](#introduction)
- [Requirement](#requirement)
- [Installation](#installation)
- [Explanation](#Explanation)

## Introduction
This project automates the process of fetching SpaceX launch data using a REST API, posting selected details to a mock REST API, and saving the data to a CSV file. The script is implemented in Node.js.


## Requirement
- Node.js (v14 or later)
- npm (Node Package Manager)    

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Rafid-Al-Ahsan/API-TEST.git
````

2. Navigate to the project directory and open command prompt

3. Install dependencies by running:
```bat
npm install axios json2csv
```
4. Execute the script using Node.js:
```bat
   node script.js 
```

## Explanation
We retrived the data using the SpaceX REST API. The axios library was to send the HTTP request to the API endpoint and from the response we collect relevant data such as - mission name, launch date and rocket ID. The is formatted into payload and then sent using HTTP POST request. The fetched data is exported to an csv file, for this we used a third-party libary json2csv. For error handling if the API returns 403 then the request is skipped. 

