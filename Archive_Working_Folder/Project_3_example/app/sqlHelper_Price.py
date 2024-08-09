import sqlalchemy # type: ignore
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func # type: ignore
import datetime

import pandas as pd # type: ignore
import numpy as np # type: ignore

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///aqi.sqlite")
        # self.Base = None

        # # automap Base classes
        # self.init_base()

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_bar(self, country):
            # switch on user_country
        if country == 'All':
            where_clause = "and 1=1"
        else:
            where_clause = f"and country = '{country}'"

        # build the query
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

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

