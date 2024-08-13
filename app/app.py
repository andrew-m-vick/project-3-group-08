from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper

app = Flask(__name__)
sql = SQLHelper()


@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

<<<<<<< HEAD
@app.route("/resources")
def resoucres():
    return render_template("resources.html")

# SQL Querris
@app.route("/api/v1.0/get_dashboard/<country>") #change
def get_dashboard(country): #add
=======
# SQL Querris
@app.route("/api/v1.0/get_dashboard/<country>") #change
def get_dashboard(country): #add
    # min_attempts = int(min_attempts) # cast to int
>>>>>>> main

    bar_data = sql.get_bar(country) #add
    bar2_data = sql.get_bar2(country) #add
    table_data = sql.get_table(country)

    data = {
        "bar_data": bar_data,
        "bar2_data": bar2_data,
        "table_data": table_data
    }
    return(jsonify(data))

<<<<<<< HEAD
@app.route("/api/v1.0/get_map") #change
def get_map(): #add/take away
=======
@app.route("/api/v1.0/get_map/<country>") #change
def get_map(country): #add/take away
>>>>>>> main
    #min_attempts = int(min_attempts) # cast to int
    map_data = sql.get_map() #double check

    return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)