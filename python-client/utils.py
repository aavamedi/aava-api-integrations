import json
import shutil


def load_properties() -> dict:
    """
    Loads the properties from 'properties.json' to be used for connecting to
    Aava API and to specify the modules that are used for retrieving the employee
    and absence data from 


    Returns:
        dict: A dictionary object with the connection parameters; can be passed straight to import functions
    """
    try:
        with open('properties.json') as json_file:
            return json.load(json_file)
    except FileNotFoundError:
        print('Properties file was not initialized')


def initialize_properties_and_exit():
    """Creates an empty properties.json file for configuring the integration module"""
    shutil.copyfile('properties-template.json', 'properties.json')

    print('''
    Empty properties file has been created as 'properties.json'
    Fill in the connection parameters and rerun the script
    ''')
    exit()
