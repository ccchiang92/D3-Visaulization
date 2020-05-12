from flask import Flask, render_template, redirect
import sqlalchemy
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import json

# setup flask
app = Flask(__name__)

# render index.html
@app.route("/")
def base():
    return render_template("index.html")


# # Weekly covid data routes
@app.route("/weekly/<week>")
def sql_to_json(week):
    # read from sqlite database
    # return table from that date as json file
    # Connect with sqlite
    engine = create_engine("sqlite:///static/data/Covid19_Weekly.sqlite", echo=True)
    conn = engine.connect()
    # Grab all rows
    rows = engine.execute(f'select * from {week}').fetchall()
    # Grab column names
    col_names = engine.execute(f'SELECT c.name FROM pragma_table_info({week}) c;').fetchall() 
    # Some dictionary formatting
    dict_list=[]
    for row in rows:
        temp_dict={}
        for col in col_names:
            name = col[0]
            temp_dict[name]=row[name]
        dict_list.append(temp_dict)
    return json.dumps(dict_list)


if __name__ == "__main__":
    app.run(debug=True)
