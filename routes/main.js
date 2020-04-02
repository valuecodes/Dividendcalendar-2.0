var express = require('express');
var app = express();
let path = require('path');
app.use(express.json());
require('dotenv').config();
console.log(process.env.API_KEY)

app.get('/tickerList', function (req, res) {
    req.getConnection(function (error, con) {
        con.query("SELECT * FROM tickers", function (err, result, fields) {
            if (err) throw error;
            // console.log(result);
            res.json(result);
        });
    });
});

app.post('/search', function (req, res) {
    req.getConnection(function (error, con) {
        con.query("SELECT * FROM tickers WHERE ticker='" + req.body.name + "'", function (err, result, fields) {
            if (err) throw error;
            res.json({
                status: 'success',
                data: result
            })
        });
    });
})

app.get('/portfolioList', (req, res) => {
    req.getConnection(function (error, con) {
        con.query("SELECT * FROM portfolios", function (err, result, fields) {
            if (err) throw error;
            // console.log(result);
            res.json(result);
        });
    });
})

app.post('/createPortfolio', (req, res) => {
    let tickerData = req.body.tickers;
    let tickers = '';
    for (var i = 0; i < tickerData.length; i++) {
        tickers += tickerData[i][0] + ',' + tickerData[i][1] + ','
    }
    req.getConnection(function (error, con) {
        var sql = "INSERT INTO portfolios (name,stocks,isActive) VALUES('" + req.body.name + "','" + tickers + "','" + req.body.isActive + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(req.body.name + " inserted");
        });
    })

    res.json({
        name: req.body.name,
        data: req.body.data
    })
})

app.post('/deletePortfolio', (req, res) => {
    // console.log(req.body.id);
    let id = req.body.id;
    req.getConnection(function (error, con) {
        var sql = "DELETE FROM portfolios WHERE id= '" + id + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(req.body.id + " Deleted");
        });
    })

    res.json({
        message: 'Portfolio deleted'
    })
})

app.post('/savePortfolio', (req, res) => {
    let tickerData = req.body.tickers;
    let tickers = '';
    for (var i = 0; i < tickerData.length; i++) {
        tickers += tickerData[i][0] + ',' + tickerData[i][1] + ','
    }
    let id = req.body.id;
    req.getConnection(function (error, con) {
        var sql = "UPDATE portfolios SET stocks = '" + tickers + "' WHERE id= '" + id + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(req.body.id + " updated");
        });
    })

    res.json({
        message: 'Portfolio saved'
    })
})

app.post('/getDividendData', function (req, res) {
    console.log(req.body.data);

    tickers = '';
    for (var i = 0; i < req.body.data.length; i++) {
        tickers += "'" + req.body.data[i] + "',"
    }
    tickers = tickers.slice(0, -1);


    req.getConnection(function (error, con) {
        let array = tickers.split(',');
        let values = [];
        for (var i = 0; i < array.length; i++) {
            values.push(array[i].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
        }
        let sql = "SELECT * FROM tickers WHERE ticker in (" + array + ")";
        con.query(sql, function (err, fresult, fields) {
            if (err) throw error;
            // console.log(fresult);
            let tickerData = fresult;
            let fkey = fresult.map(element => element.id);
            let sql = "SELECT * FROM dividends where ticker_id in (" + fkey + ")";
            con.query(sql, function (err, result, fields) {
                if (err) throw error;
                let dividends = result;
                let sql = "SELECT * FROM yeardata where ticker_id in (" + fkey + ")";
                con.query(sql, function (err, result3, fields) {
                    // console.log(result3);
                    let yeardata = result3;
                    let sql = "SELECT * FROM insider where ticker_id in (" + fkey + ")";
                    con.query(sql, function (err, result4, fields) {
                        let insider = result4;

                        let sql = "SELECT * FROM weeklydata where ticker_id in (" + fkey + ")";
                        con.query(sql, function (err, result5, fields) {
                            let wdata = result5;

                            let dataArray = [];
                            for (var a = 0; a < fkey.length; a++) {
                                let weData = wdata.filter(element => element.ticker_id == fkey[a]);
                                let yeData = yeardata.filter(element => element.ticker_id == fkey[a]);
                                let diData = dividends.filter(element => element.ticker_id == fkey[a]);
                                let inData = insider.filter(element => element.ticker_id == fkey[a]);
                                dataArray.push([fresult[a], weData, yeData, diData, inData]);
                            }
                            console.log(dataArray);

                            res.json({
                                data: dataArray,
                                message: 'All data received'
                            });

                        })

                    })
                    // let sql = "SELECT * FROM tickers JOIN weeklydata ON tickers.id =  weeklydata.ticker_id where ticker IN (" + tickers + ")"
                    // con.query(sql, function (err, result2, fields) {
                    //     let weeklydata = result2;
                    //     res.json({
                    //         dividends: dividends,
                    //         qfinancials: qfinancials,
                    //         weeklydata: weeklydata,
                    //         message: 'Dividend and earnings data set'
                    //     });
                    // })
                })
            });
        })
    });
});


module.exports = app;