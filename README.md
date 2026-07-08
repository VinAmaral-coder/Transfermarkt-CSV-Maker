![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

# CSV-Maker

A Node.js application that collects football data from Transfermarkt and exports it into structured JSON files, with future support for CSV generation.

## About

CSV-Maker was created to automate the collection of football information such as:

- Player names
- Current clubs
- National teams
- Market values
- Team logos
- Squad information
- Other Transfermarkt data

The collected data is stored in JSON format and can later be converted into CSV files for analysis, spreadsheets, databases, or personal projects.

## Technologies

- JavaScript
- Node.js
- Axios
- Transfermarkt Data Scraping

## Project Structure

```text
Transfermarkt-CSV-Maker/
│
├── src/
│   ├── transfermarktScraper.js
│   └── competitions.js
│
├── data/
│   └── database.json
│
├── package.json
├── package-lock.json
└── README.md
```

## Usage

Run the scraper:

```bash
node src/transfermarktScraper.js
```

The generated data will be saved inside:

```text
data/database.csv
```

## Example Output - CSV and Google Sheets

- CSV:
<img width="3806" height="444" alt="CSV" src="https://github.com/user-attachments/assets/48131409-28c2-44bf-b03a-1d1101bd77ab" />


- Google Sheets:
  <img width="3806" height="444" alt="Google-Sheets" src="https://github.com/user-attachments/assets/ea2ad859-c163-45a8-83e2-7765bb8d7eaa" />


## Future Improvements

- [x] CSV export support.
- [x] Clubs and Players with images
- [ ] Better error handling
- [ ] Search filters
- [ ] Multiple league support
- [ ] Automatic updates

## Current Problems
- Better layout
- Players and Teams on separeted topics
- Competitions names and logos
- National teams with logos

  
## License

This project is intended for educational and personal use.
