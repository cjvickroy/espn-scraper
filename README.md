# espn-scraper
RESTful API that uses Cheerio to scrape NBA games and team information from ESPN

---

## About
This API is in active development and will be hosted publicly soon.

The ESPN Scraper API provides scores and team information for the NBA, NFL, and MLB. 

## Endpoints

### Scores

Currently there are 3 different methods to get scores in a league on any given date:

* **{league}/games/today**
* **{league}/games/tomorrow**
* **{league}/games/YYYYMMDD**

(Where league is one of the 3 league codes: [nba, mlb, or nfl])
