import pandas as pd
import os



def summarize():
    path=os.getcwd()
    sars_file_path='SARS_data.csv'
    # list of dictionary where each dictionary holds the stats for each disease
    all_disease=[]

    # summarize SARS
    sars_dict={}
    df=pd.read_csv(path+'/'+sars_file_path)
    latest_date=df['Date'].max()
    sars_max_case_ct=df[(df['Date']==latest_date) & (df['Country']=='Total')]['Cases'].values[0]

    sars_dict['name']='sars'
    sars_dict['case']=sars_max_case_ct
    # print(df[df['Country']=='Total'])
    #sars_dict={'name': 'SARS', 
    #        'death_count': 100, 
    #        'case_count': 50}

    all_disease.append(sars_dict)


    # df=pd.read_csv(path+'/'+sars_file_path)
    # print(df)

    # files=os.listdir(path)

    # files=[file_name for file_name in files if file_name.split('.')[-1] == 'csv']
    # for each_file in files: 
        # do something with the csv, e.g. pd.read_csv()
summarize()