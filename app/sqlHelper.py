import sqlalchemy

from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

class SQLHelper():


    def __init__(self):
        self.engine = create_engine("sqlite:///aqi.sqlite") # might need to change

    
    def get_table(self, country):

        if country == 'All':
            where_clause = "1=1"
        else:
            where_clause = f" country = '{country}'"


        # build the query
        query = f"""
            SELECT
                city,
                aqi_value,
                co_aqi_value,
                no2_aqi_value,
                latitude,
                longitude
            FROM
                aqi
            WHERE
                {where_clause}
            ORDER BY
                aqi_value DESC,
                co_aqi_value DESC,
                no2_aqi_value;
        """

        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
        
    
    def get_map(self): #add
         
        query = f"""
            SELECT latitude, longitude, aqi_value, city, country, aqi_category
            FROM aqi;
        """
        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)



    def get_bar(self, country):

        # switch on user_country
        if country == 'All':
            where_clause = "1=1"
        else:
            where_clause = f"country = '{country}'"

        # build the query
        query = f"""
            SELECT
                country,
                city,
                aqi_value,
                aqi_category,
                co_aqi_value,
                co_aqi_category,
                ozone_aqi_value,
                ozone_aqi_category,
                no2_aqi_value,
                no2_aqi_value
            FROM
                aqi
            WHERE
                {where_clause}
            ORDER BY
                country DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    
    def get_bar2(self, country):# add
        if country == 'All':
            where_clause = ""
        else:
            where_clause = f"WHERE country = '{country}'"

        query = f"""
            SELECT
                aqi_category,
                city,
                COUNT(*) as count
            FROM
                aqi
            {where_clause}
            GROUP BY
                aqi_category;
        """

        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)