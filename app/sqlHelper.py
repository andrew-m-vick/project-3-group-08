import sqlalchemy

from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

class SQLHelper:
    
    def __init__(self):
        self.engine = create_engine("sqlite:///aqi.sqlite")  # Adjust the path if needed

    def get_table(self, country):

        if country == 'All':
            where_clause = "1=1"
            params = {}
        else:
            where_clause = "country = :country"
            params = {'country': country}

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
                no2_aqi_value
            LIMIT 15;
        """

        df = pd.read_sql(text(query), con=self.engine, params=params)
        data = df.to_dict(orient="records")
        return data

    def get_map(self, country=None, city=None, aqi_category=None):

        query = """
            SELECT
                city,
                country,
                aqi_value,
                latitude,
                longitude
            FROM
                aqi 
            WHERE (:country IS NULL OR country = :country) 
                AND (:city IS NULL OR city = :city) 
                AND (:aqi_category IS NULL OR aqi_category = :aqi_category)
        """

        params = {'country': country, 'city': city, 'aqi_category': aqi_category}

        df = pd.read_sql(text(query), con=self.engine, params=params)
        data = df.to_dict(orient="records")
        return data

    def get_bar(self, country):

        if country == 'All':
            where_clause = ""
            params = {}
        else:
            where_clause = "WHERE country = :country"
            params = {'country': country}

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

        df = pd.read_sql(text(query), con=self.engine, params=params)
        data = df.to_dict(orient="records")
        return data

    def get_bar2(self, country):

        if country == 'All':
            where_clause = ""
            params = {}
        else:
            where_clause = "WHERE country = :country"
            params = {'country': country}

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

        df = pd.read_sql(text(query), con=self.engine, params=params)
        data = df.to_dict(orient="records")
        return data