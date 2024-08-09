from flask import Flask, jsonify, render_template 
import pandas as pd 
import numpy as np 
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES

@app.route("/api/v1.0/dashboard")
def dashboard():
    return render_template("dashboard.html")


# SQL Queries
@app.route("/api/v1.0/get_dashboard/<country>")
def get_dashboard(country):

    bar_data = sql.get_bar(country)

    data = {
        "bar_data": bar_data,
    }
    return(jsonify(data))




# Run the App
if __name__ == '__main__':
    app.run(debug=True)