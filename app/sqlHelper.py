import sqlalchemy

from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

class SQLHelper():


    def __init__(self):
<<<<<<< HEAD
        self.engine = create_engine("sqlite:///aqi.sqlite") # might need to change
=======
        self.engine = create_engine("sqlite:///../Resources/aqi.sqlite") # might need to change
>>>>>>> main

    
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
<<<<<<< HEAD
                no2_aqi_value;
=======
                no2_aqi_value
            LIMIT 15;
>>>>>>> main
        """

        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
<<<<<<< HEAD
        
    
    def get_map(self): #add
         
        query = f"""
            SELECT latitude, longitude, aqi_value, city, country, aqi_category
            FROM aqi;
=======
    
    def get_map(self, country): #add
        
        if country == 'All':
            where_clause = "1=1"
        else:
            where_clause = f" country = '{country}'"
         
        query = f"""
            SELECT latitude, longitude, aqi_value
            FROM aqi
            {where_clause};
>>>>>>> main
        """
        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)



<<<<<<< HEAD
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

=======
    def get_bar(self, country):# add
        if country == 'All':
            where_clause = ""
        else:
            where_clause = f"WHERE country = '{country}'"

        query = f"""
            SELECT
                aqi_category,
                COUNT(*) as count
            FROM
                aqi
            {where_clause}
            GROUP BY
                aqi_category;
        """

        # execute query
>>>>>>> main
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    
<<<<<<< HEAD
    def get_bar2(self, country):# add
=======
    def get_bar2(self, country): #add
>>>>>>> main
        if country == 'All':
            where_clause = ""
        else:
            where_clause = f"WHERE country = '{country}'"
<<<<<<< HEAD

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
=======
        query = f"""
            SELECT
                country,
                city,
                aqi_value,
                aqi_category
            FROM
                aqi
            {where_clause}
            ORDER BY
                aqi_value DESC
            LIMIT
                10;
        """
        df2 = pd.read_sql(text(query), con = self.engine)
        data = df2.to_dict(orient="records")
        return(data) 
>>>>>>> main
