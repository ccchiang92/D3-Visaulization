import pandas as pd
import os

def summarize():
    path=os.getcwd()
    sars_file_path='SARS_data.csv'
    mers_file_path='mers_final.csv'
    ebola_file_path='ebola_final.csv'
    covid_file_path='covid_daily_world.csv'

    # list of dictionary where each dictionary holds the stats for each disease
    all_disease=[]

    # summarize SARS
    sars_dict={}
    df=pd.read_csv(path+'/'+sars_file_path)
    latest_date=df['Date'].max()
    sars_max_case_ct=df[(df['Date']==latest_date) & (df['Country']=='Total')]['Cases'].values[0]
    sars_max_death_ct=df[(df['Date']==latest_date) & (df['Country']=='Total')]['Deaths'].values[0]

    sars_dict['name']='sars'
    sars_dict['cases']=sars_max_case_ct
    sars_dict['deaths']=sars_max_death_ct

    all_disease.append(sars_dict)
    
    # Summarize MERS
    mers_dict={}
    df=pd.read_csv(path+'/'+mers_file_path)
    mers_max_case_ct=df['Cases'].sum()

    sars_dict['name']='mers'
    sars_dict['cases']=sars_max_case_ct
    sars_dict['deaths']='nd'

    all_disease.append(mers_dict)

    # summarize ebola
    ebola_dict={}
    df=pd.read_csv(path+'/'+ebola_file_path)
    latest_date=df['Date'].max()
    ebola_max_case_ct=df[(df['Date']==latest_date)]['No. of confirmed cases'].sum
    ebola_max_death_ct=df[(df['Date']==latest_date)['No. of confirmed deaths'].sum

    ebola_dict['name']='ebola'
    ebola_dict['cases']=ebola_max_case_ct
    ebola_dict['deaths']=ebola_max_death_ct

    all_disease.append(ebola_dict)

    # summarize COVID
    covid_dict={}
    df=pd.read_csv(path+'/'+covid_file_path)
    latest_date=df['Date'].max()
    covid_max_case_ct=df[(df['Date']==latest_date) & (df['Country']=='Total')]['Confirmed'].values[0]
    covid_max_death_ct=df[(df['Date']==latest_date) & (df['Country']=='Total')]['Deaths'].values[0]

    covid_dict['name']='covid-19'
    covid_dict['cases']=covid_max_case_ct
    covid_dict['deaths']=covid_max_death_ct

    all_disease.append(covid_dict)

    # Create new CSV for summary table
    all_disease.to_csv(path+'/summary_table.csv')

summarize()