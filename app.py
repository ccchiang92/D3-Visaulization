from flask import Flask, render_template, redirect
# from flask_pymongo import PyMongo
# import scrape_mars
# flask app to render mars website
# using some code from scrape costa rica activity

# setup flask and pymongo
app = Flask(__name__)
# mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_db")

# render index.html by passing mongo db data
@app.route("/")
def base():

    # mars_data = mongo.db.mars.find_one()

    # using template from costa rica activity as a base 
    return render_template("index.html")


# # Scrape route
# @app.route("/scrape")
# def scrape():

#     mars_data = scrape_mars.scrape()
#     # Update the Mongo database using update and upsert=True
#     mongo.db.mars.update({}, mars_data, upsert=True)

#     return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
