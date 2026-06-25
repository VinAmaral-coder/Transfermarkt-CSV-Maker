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
CSV-Maker/
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
data/database.json
```

## Example Output

```json
{
  "name": "Vinícius Júnior",
  "club": "Real Madrid",
  "nationality": "Brazil",
  "marketValue": "€170M"
}
```

## Future Improvements

- [x] CSV export support
- [ ] Better error handling
- [ ] Search filters
- [ ] Multiple league support
- [ ] Automatic updates
- [x] Separeted topics for clubs and players

## Current Problems
- ~~No minifaces for all players~~
- Problems with separating the topics
- And more

## License

This project is intended for educational and personal use.
