# Covid-19 Data Visaulization

This is a data visualization project for UC Berkeley’s extension Data Analytics bootcamp. \
In this webpage we have compiled data from various pandemics and created interactive visuals for the data. \
The goal here was to measure, compare and understand the spread and impact of different pandemics through easy digestible visuals. 

### This project involved bringing together many different elements:
We utilized many of the tools and techniques we learned in class, to create a complete package. \
Starting from data extraction by web scraping, to data wrangling with python pandas, to loading data into a sql data base and finally interactive custom visualization of the data using java script with libraries d3, plotly and leaflet. \
<br /> 
Here are just some of the steps and details
* Obtaining various data from many source, such as csv covid-19 case data and scrapping html tables for SARS cases
* Cleaning and wrangling data mainly through python pandas and saving dataframes into csv files
* Partially convert csv data into a sqlite database file, then create a python flask server that will load sql table into json files at different end points
* Finally loading data into javascript and create visualizations
    - A leaflet/mapbox interactive map plotting cases counts according to coordinates. Also includes a slider to change dates for the covid heatmap
    - A custom d3 plot comparing case trends and stock market indexes for different pandemics and regions. Can use the buttons to switch between different data/views  
    - pie and line graphs created by plotly for more pandemic comparisons, and a graph comparing case trends to oil prices.
    - A quick summary table, comparing different pandemics 
<br /> 

### There are 2 versions of the web page in this repo
1. All loaded data are in csv for easy deployment on github pages.
2. a flask/json version, that can be launch by running the python app.py script, where data for the covid heat map is put into a sqlite database and loaded through python flask, sqlalchemy and json end points. 
<br /> 

### Here is what the repo contains
* html files for github pages
* templates: html for flask
* app.py for flask server
* raw data in raw_data
* cleaned data for some processed data
* data_cleaning_scripts for data wrangling and web scraping python script
* database : sqlite database file and python script that compiled it
* static : html elements, visualization js, final csv data files

#### Data Sources
* Covid cases : https://github.com/CSSEGISandData/COVID-19
* Sars cases : https://www.who.int/csr/sars/country/en/
* Ebola cases : https://www.kaggle.com/imdevskp/ebola-outbreak-20142016-complete-dataset
* Stock market index prices : https://www.investing.com/
* Oil Prices : https://www.eia.gov/dnav/pet/hist/RBRTEd.htm
    
  