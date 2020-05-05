# A python script that will auto update and clean our ETL project database and csv files
# By Chris Chiang
# Import dependencies

import pandas as pd
from bs4 import BeautifulSoup as bs
import requests
import datetime as dt
from splinter import Browser
import time

# Setting some global variables
# csv file location for covid 19 case data
# cases data from Johns Hopkins CSSE github repo, set up as a submodule inside this repo
case_data_loc = './raw_data/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/'
# Storage location for final cleaned data tables
data_final_loc = './cleaned_data/Auto_Updated/'
# Read old data
tot_df =  pd.read_csv(data_final_loc + 'Total_Auto.csv')

#------------------------------------------
# Alternative path for loading static project data
# data_loc = './cleaned_data/Final_data_tables/'
# US_df = pd.read_csv(data_loc + 'US_ALL.csv')
# It_df = pd.read_csv(data_loc + 'It_ALL.csv')
# KR_df = pd.read_csv(data_loc + 'KR_ALL.csv')
# CN_df = pd.read_csv(data_loc + 'CN_ALL.csv')
# tot_df = pd.read_csv(data_loc + 'Total.csv')
#-------------------------------------------

# Setup dates for updates
last_data = tot_df['Date'].max()
start_date = dt.date.fromisoformat(last_data) + dt.timedelta(days=1)
# grab data up to yesterday to accommodate timezones
yesterday = dt.date.today() - dt.timedelta(days=1)
no_update =False
if start_date>=yesterday:
    no_update =True
    print('No new data to update')
#     exit()


# Set up naming strings
country_strings=['South Korea','Mainland China','Italy','US','Total']


# Creating functions for various cleaning and data extration tasks
def start_browser():
    # browser init for webscraping
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    return browser


def load_new_market_data():
    # Scrape investing.com for updated market index data
    # will only work update up to one month
    kr = 'https://www.investing.com/indices/kospi-historical-data'
    cn = 'https://www.investing.com/indices/shanghai-composite-historical-data'
    it = 'https://www.investing.com/indices/it-mib-40-historical-data'
    us = 'https://www.investing.com/indices/us-30-historical-data'
    countries = [kr, cn, it, us]
    invest_tabs=[]
    browser=start_browser()
    for coun in countries:
        browser.visit(coun)
        time.sleep(1)
        html = bs(browser.html, 'html.parser')
        tab_tag=html.find('table',id='curr_table')
        temp_df = pd.read_html(str(tab_tag))[0]
        invest_tabs.append(temp_df)
    browser.quit()
    # Cleaning a grabing only the latest data
    edited=[]
    for table in invest_tabs:
        new_df = pd.DataFrame()
        for index, row in table.iterrows():
            date = dt.datetime.strptime(table.iloc[index]['Date'], '%b %d, %Y').date()
            if date >= start_date:
                row = pd.DataFrame(
                    {'Date': date, 'Price': row['Price'], 'Change %': row['Change %']}, index=[index])
                new_df = pd.concat([row, new_df])
        edited.append(new_df)
    return edited

def scrape_cnn():
    # Update major events table
    # Scraping for an cnn article
    browser=start_browser()
    url = requests.get('https://www.cnn.com/2020/02/06/health/wuhan-coronavirus-timeline-fast-facts/index.html')
    soup = bs(url.text, 'html.parser')
    timeline = soup.body.find_all('div', class_='zn-body__paragraph')

    article = {}

    for date in timeline:
        if date.find('strong'):
            article_date = date.find('strong').text.strip('- ')
            article_text = date.get_text(strip=True)
            article[article_date] = article_text
        else:
            next    
    df = pd.DataFrame(article.items(), columns=['Date', 'article'])
    df['Date'] =  pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    browser.quit()
    return df

def load_new_cases():
    # a script to combine all new daily case data into one data frame
    days = (yesterday - start_date).days
    # forloop init
    current_date = start_date
    combine_df = pd.DataFrame()
    # i is the index of combine_df
    i = 0

    for day in range(int(days)+1):
        # convert date into string and load in csv
        load_string = current_date.strftime("%m-%d-%Y")
        try:
            today_df = pd.read_csv(case_data_loc + load_string +
                                '.csv').groupby('Country/Region')
        except KeyError:
            # deal with data column format change
            today_df = pd.read_csv(case_data_loc + load_string +
                                '.csv').groupby('Country_Region')
        except :
            print(load_string + ' No JH case data')
            break
        # total count init
        day_deaths_tot = 0
        day_confirmed_tot = 0
        # Loop through intrested countries
        for needed in ['US', 'Mainland China', 'South Korea', 'Italy', 'China', 'Korea, South', 'Republic of Korea']:
            try:
                needed_df = today_df.get_group(needed)
                day_deaths_tot += needed_df['Deaths'].sum()
                day_confirmed_tot += needed_df['Confirmed'].sum()
                # write rows base on country
                # handle all South Korea formats
                if needed in ['South Korea', 'Korea, South', 'Republic of Korea']:
                    row = pd.DataFrame({'Date': current_date, 'Country/Region': 'South Korea',
                                        'Confirmed': needed_df['Confirmed'].sum(), 'Deaths': needed_df['Deaths'].sum()}, index=[i])
                # handle All China formats
                elif needed in ['China', 'Mainland China']:
                    row = pd.DataFrame({'Date': current_date, 'Country/Region': 'Mainland China',
                                        'Confirmed': needed_df['Confirmed'].sum(), 'Deaths': needed_df['Deaths'].sum()}, index=[i])
                else:
                    # Italy and US rows
                    row = pd.DataFrame({'Date': current_date, 'Country/Region': needed,
                                        'Confirmed': needed_df['Confirmed'].sum(), 'Deaths': needed_df['Deaths'].sum()}, index=[i])
                # add row into full df
                combine_df = pd.concat([row, combine_df])
                i += 1
            except KeyError:
                # catch missing data
                # No Italy Data for first few days so store 0
                if needed == 'Italy':
                    row = pd.DataFrame(
                        {'Date': current_date, 'Country/Region': needed, 'Confirmed': 0, 'Deaths': 0}, index=[i])
                    combine_df = pd.concat([row, combine_df])
                    i += 1
                else:
                    print(f'{needed} data not found on {current_date}')
            # add total row
        row = pd.DataFrame({'Date': current_date, 'Country/Region': 'Total',
                            'Confirmed': day_confirmed_tot, 'Deaths': day_deaths_tot}, index=[i])
        combine_df = pd.concat([row, combine_df])
        i += 1
        # increment date
        current_date = current_date + dt.timedelta(days=1)
    return combine_df

def combine_data(case_data, market_data):
    # Combine market and cases data into individual contry tables
    output = []
    for i in range(len(market_data)):
        # Join tables
        temp_df = pd.DataFrame.merge(case_data.groupby(
        'Country/Region').get_group(country_strings[i]), market_data[i], on='Date')
        # Rename for clearity
        temp_df.rename(columns={'Confirmed': "Confirmed cases",
                                        'Price': "Index Price", "Change %": "Index Daily % Change"}, inplace=True)
        if temp_df.isnull().sum().sum()>0:
            print('Data update errors')
        # Type convertion for easy visualization
        temp_df["Index Daily % Change"] = temp_df["Index Daily % Change"].apply(
            lambda x: float(x.replace('%', '')))
        output.append(temp_df)
    tot_df = case_data.groupby('Country/Region').get_group('Total')
    tot_df.rename(columns={'Confirmed': "Confirmed cases"}, inplace=True)
    output.append(tot_df)
    return output


# auto update sqlite database
def sqlupdate(data_table_list):
    from sqlalchemy import create_engine, Column
    from sqlalchemy.types import Float, String, Date, BigInteger
    engine = create_engine("sqlite:///./sqlite_database/Auto_Updated/Covid19_VS_Market.sqlite", echo=False)
    conn = engine.connect()
    # define data types
    table_type_country={'Date':Date ,'Country/Region':String,'Confirmed cases':BigInteger,'Deaths':BigInteger,'Index Price':Float,'Index Daily % Change':Float}
    table_type_tot={'Date':Date ,'Country/Region':String,'Confirmed cases':BigInteger,'Deaths':BigInteger}
    table_type_event={'Date':Date ,'Major Event':String}
    # convert dataframe into sql tables
    for i in range(4):
        data_table_list[i].to_sql(country_strings[i] + '_data', conn,index = False, dtype =table_type_country,if_exists='replace')
    data_table_list[4].to_sql('Total_table', conn,index = False, dtype =table_type_tot,if_exists='replace')
    data_table_list[5].to_sql('Event_table', conn,index = False, dtype =table_type_event,if_exists='replace')


# Grab old csv files to appended new data
old_tables = []
for country in country_strings:
    temp_df = pd.read_csv(data_final_loc +country+ '_Auto.csv')
    temp_df['Date']=temp_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
    old_tables.append(temp_df)

#-------------------------------------------
# Alternative path for loading static project data
# US_df['Date']=US_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
# It_df['Date']=It_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
# CN_df['Date']=CN_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
# KR_df['Date']=KR_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
# tot_df['Date']=tot_df['Date'].apply(lambda x : dt.date.fromisoformat(x))
# old_tables=[KR_df,CN_df,It_df,US_df,tot_df]
#-------------------------------------------

# grab new data and clean using modify code from the juypter notebooks
index_dfs=load_new_market_data()
event_df = scrape_cnn()
case_df =load_new_cases()
if len(case_df)>0 and len(index_dfs)>0:
    final_tabs = combine_data(case_df, index_dfs)
else:
    print('No new data to update')
    no_update = True

# save csv files
if no_update:
    auto_table_list = old_tables
else:
    auto_table_list=[]
    for i in range(len(final_tabs)):
        update_date = old_tables[i]['Date'].max()
        try:
            new_and_old = old_tables[i].append(final_tabs[i].loc[final_tabs[i]['Date']>update_date])
            new_and_old.sort_values('Date').to_csv('./cleaned_data/Auto_Updated/'+country_strings[i]+'_Auto.csv', index=False)
            auto_table_list.append(new_and_old.sort_values('Date'))
        except :
            print('No new data to append')
            auto_table_list.append(old_tables[i].sort_values('Date'))
event_df.sort_values('Date').to_csv('./cleaned_data/Auto_Updated/'+'Events'+'_Auto.csv')
auto_table_list.append(event_df.sort_values('Date'))

# Save to dashboard folder
for i in range(len(auto_table_list)-1):
    temp = auto_table_list[i].dropna(0)
    temp.to_csv('./dashboard/dist/data/'+country_strings[i]+'_Auto.csv', index=False)
event_df.sort_values('Date').to_csv('./dashboard/dist/data/'+'Events'+'_Auto.csv')

# Rewrite sqlite database if there are new data
if not no_update:
    sqlupdate(auto_table_list)





