import sqlalchemy

from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

class SQLHelper:
    
    def __init__(self):
        self.engine = create_engine("sqlite:///aqi.sqlite")  # Adjust the path if needed

    def get_table(self, country):
        """
        Retrieves the top 15 cities with the highest AQI values, optionally filtered by country.

        Args:
            country (str): The country to filter by, or 'All' to retrieve data for all countries.

        Returns:
            list: A list of dictionaries containing city, aqi_value, co_aqi_value, no2_aqi_value, latitude, and longitude.
        """

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
        """
        Retrieves data for generating a map, optionally filtered by country, city, and AQI category.

        Args:
            country (str, optional): The country to filter by. Defaults to None.
            city (str, optional): The city to filter by. Defaults to None.
            aqi_category (str, optional): The AQI category to filter by. Defaults to None.

        Returns:
            list: A list of dictionaries containing city, country, aqi_value, latitude, and longitude.
        """

        query = """
            SELECT city, country, aqi_value, latitude, longitude
            FROM aqi 
            WHERE (:country IS NULL OR country = :country) 
                AND (:city IS NULL OR city = :city) 
                AND (:aqi_category IS NULL OR aqi_category = :aqi_category)
        """

        params = {'country': country, 'city': city, 'aqi_category': aqi_category}

        df = pd.read_sql(text(query), con=self.engine, params=params)
        data = df.to_dict(orient="records")
        return data

    def get_bar(self, country):
        """
        Retrieves the count of cities in each AQI category, optionally filtered by country.

        Args:
            country (str): The country to filter by, or 'All' to retrieve data for all countries.

        Returns:
            list: A list of dictionaries containing aqi_category and count.
        """

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
        """
        Retrieves the top 10 cities with the highest AQI values, optionally filtered by country.

        Args:
            country (str): The country to filter by, or 'All' to retrieve data for all countries

        Returns
            list: A list of dictionaries containing country, city, aqi_value, and aqi_category
        """

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