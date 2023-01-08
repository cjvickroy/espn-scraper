const express = require('express')
const cheerio = require('cheerio')
const request = require('request');
const app = express()
const port = process.env.PORT || 8000

teamCodes = [
    "ATL",
    "BOS",
    "BKN",
    "CHA",
    "CHI",
    "CLE",
    "DAL",
    "DEN",
    "DET",
    "GSW",
    "HOU",
    "IND",
    "LAC",
    "LAL",
    "MEM",
    "MIA",
    "MIL",
    "MIN",
    "NOP",
    "NYK",
    "OKC",
    "ORL",
    "PHI",
    "PHX",
    "POR",
    "SAC",
    "SAS",
    "TOR",
    "UTA",
    "WAS"
]

function getTeam(team, res){
    var url =  "https://www.espn.com/nba/team/_/name/" + team;

    request(url, function (error, response, html){
        if (!error && response.statusCode == 200){
            const $ = cheerio.load(html);
            var teamName = $('.TeamHeader__TeamName').text();
            var teamRecord = $('.TeamHeader__Record').text();
            var teamPlacing = $('.ClubhouseHeader__Record').children('li:nth-child(2)').text();
            var teamInfo = [];

            teamInfo.push({
                name: teamName,
                record: teamRecord,
                placing: teamPlacing
            });

            res.status(200).send({
                team: teamInfo
            });
        }
    })
}

function getAllGamesMLB(date, res){
    var url = "https://www.espn.com/mlb/scoreboard/_/date/" + date;
    
    var day = date.substring(6, 8);
    var month = date.substring(4, 6);
    var year = date.substring(0, 4);

    var allGames = [];

    //Use Cheerio to scrape data from the URL
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            $('.Scoreboard__Column--Score').each(function (i) {
                var game = [];
                var homeTeam = $(this).find('.ScoreboardScoreCell__Item--home .ScoreCell__TeamName').text();
                var awayTeam = $(this).find('.ScoreboardScoreCell__Item--away .ScoreCell__TeamName').text();
                var homeScore = $(this).find('.ScoreboardScoreCell__Item--home .ScoreboardScoreCell_Linescores > div:nth-child(1)').text();
                var awayScore = $(this).find('.ScoreboardScoreCell__Item--away .ScoreboardScoreCell_Linescores > div:nth-child(1)').text();
                var gameTime = $(this).parents('.Scoreboard__Row').children('.Scoreboard__Column--2').find('.LastPlay h1').text();
                var homeRecord = $(this).find('.ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Record:nth-child(1)').text();
                var awayRecord = $(this).find('.ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Record:nth-child(1)').text();
                var homeHits = $(this).find('.ScoreboardScoreCell__Item--home .ScoreboardScoreCell_Linescores > div:nth-child(2)').text();
                var awayHits = $(this).find('.ScoreboardScoreCell__Item--away .ScoreboardScoreCell_Linescores > div:nth-child(2)').text();
                var homeErrors = $(this).find('.ScoreboardScoreCell__Item--home .ScoreboardScoreCell_Linescores > div:nth-child(3)').text();
                var awayErrors = $(this).find('.ScoreboardScoreCell__Item--away .ScoreboardScoreCell_Linescores > div:nth-child(3)').text();
                
                game.push({
                    home: homeTeam,
                    away: awayTeam,
                    homeScore: homeScore,
                    awayScore: awayScore,
                    time: gameTime,
                    homeRecord: homeRecord,
                    awayRecord: awayRecord,
                    homeHits: homeHits,
                    awayHits: awayHits,
                    homeErrors: homeErrors,
                    awayErrors: awayErrors
                });

                //If the game is over, change time to "Final"
                if ((homeScore != "" && awayScore != "") && (gameTime == "")){
                    game[0].time = "Final";
                }

                allGames.push(game);
            });
            
            res.status(200).send({
                date: month + "/" + day + "/" + year,
                numberOfGames: allGames.length,
                games: allGames
            });
        }
    });
}

function getAllGamesNBA(date, res){
    var url = "https://www.espn.com/nba/scoreboard/_/date/" + date;

    var day = date.substring(6, 8);
    var month = date.substring(4, 6);
    var year = date.substring(0, 4);

    var allGames = [];

    //Use Cheerio to scrape data from the URL
    request(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            $('.Scoreboard__Column--Score').each(function (i) {
                var game = [];
                var homeTeam = $(this).find('.ScoreboardScoreCell__Item--home .ScoreCell__TeamName').text();
                var awayTeam = $(this).find('.ScoreboardScoreCell__Item--away .ScoreCell__TeamName').text();
                var homeScore = $(this).find('.ScoreboardScoreCell__Item--home .ScoreCell__Score').text();
                var awayScore = $(this).find('.ScoreboardScoreCell__Item--away .ScoreCell__Score').text();
                var time = $(this).parents('.Scoreboard__Row').children('.Scoreboard__Column--2').find('.LastPlay h1').text();
                var homeRecord = $(this).find('.ScoreboardScoreCell__Item--home .ScoreboardScoreCell__Record:nth-child(1)').text();
                var awayRecord = $(this).find('.ScoreboardScoreCell__Item--away .ScoreboardScoreCell__Record:nth-child(1)').text();
                var homeLogo = $(this).find('.ScoreboardScoreCell__Item--home').attr('src');
                var awayLogo = $(this).find('.ScoreboardScoreCell__Logo--away').attr('src');

                //Remove the first 10 characters from time
                var gameTime = time.slice(10);

                game.push({
                    home: homeTeam,
                    away: awayTeam,
                    homeScore: homeScore,
                    awayScore: awayScore,
                    time: gameTime,
                    homeRecord: homeRecord,
                    awayRecord: awayRecord,
                    homeLogo: homeLogo,
                    awayLogo: awayLogo
                });

                //If the game is over, change time to "Final"
                if ((homeScore != "" && awayScore != "") && (gameTime == "")){
                    game[0].time = "Final";
                }

                allGames.push(game);
                
            });

            res.status(200).send({
                date: month + "/" + day + "/" + year,
                numberOfGames: allGames.length,
                games: allGames
            });
        }
    });
}

function checkValidTeam(team){
    
    var teamUpper = team.toUpperCase();
    for(var i = 0; i < teamCodes.length; i++){
        if(teamUpper == teamCodes[i]){
            return true;
        }
    }
    return false;
}

app.use(express.json())

app.use(function (req, res, next) {
    console.log("== Request received")
    console.log("  - METHOD:", req.method)
    console.log("  - URL:", req.url)
    console.log("  - HEADERS:", req.headers)
    next()
})

//Base URL
app.get('/', function (req, res, next) {
    res.status(200).send({
        msg: "Not a valid endpoint. Please try again!"
    })
})

app.get('/nba/games/today', function (req, res, next) {

    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    var date = year + month + day;

    getAllGamesNBA(date, res);

})

app.get('/nba/games/tomorrow', function (req, res, next) {

    var today = new Date();
    var day = String(today.getDate() + 1).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    
    var date = year + month + day;

    getAllGamesNBA(date, res);
})

app.get('nba/teams/:team', function (req, res, next) {
    
    var team = req.params.team;

    if (!checkValidTeam(team)) {
        res.status(404).send({
            err: "This team was not found: " + team
        })
    }

    getTeam(team, res);  
})



app.get('/mlb/games/:date', function (req, res, next) {

    let date = req.params.date;
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);

    getAllGamesMLB(date, res);
})
    
   
//Send all NBA games on a specific date. Date format: YYYYMMDD
app.get('/nba/games/:date', function (req, res, next) {

    let date = req.params.date;
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);

    getAllGames(date, res);
})

//Catch wrong URL
app.use('*', function (req, res, next) {
    res.status(404).send({
        err: "This URL was not recognized: " + req.originalUrl
    })
})

app.use(function (err, req, res, next) {
    console.log("  - err:", err)
    res.status(500).send()
})

app.listen(port, function () {
    console.log("== Server is listening on port:", port)
})




