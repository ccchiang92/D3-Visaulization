// Get data from CSV's
d3.csv('../raw_data/Brent_oil_price.xls').then(function(getPrices) {
    var dates = date.map(Brent_oil_price => Brent_oil_price.Date);
    var prices = price.map(Brent_oil_price => Brent_oil_price.Date);
    date.forEach(function(getDate) {
      Brent_oil_price.Date = parseDate(Brent_oil_price.Date);
    })
    date.forEach(function(getPrice) {
      Brent_oil_price.`Weekly Europe Brent Spot Price FOB  (Dollars per Barrel)` = parseDate(Brent_oil_price.`Weekly Europe Brent Spot Price FOB  (Dollars per Barrel)`);
    })
  })
  d3.csv('../cleaned_data/In-progress/SARS_data.csv').then(function(readData) {
    var dates = date.map(SARS_data => SARS_data.Date)
    date.forEach(function(getDate) {
      SARS_data.Date = parseDate(SARS_data.Date)
    })
  })