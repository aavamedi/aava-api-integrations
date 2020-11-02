import json
import shutil


def load_properties():
    try:
        with open('properties.json') as json_file:
            return json.load(json_file)
    except FileNotFoundError:
        print('Properties file was not initialized')


def initialize_properties_and_exit():
    shutil.copyfile('properties-template.json', 'properties.json')

    print('''
    Empty properties file has been created as 'properties.json'
    Fill in the connection parameters and rerun the script
    ''')
    exit()
