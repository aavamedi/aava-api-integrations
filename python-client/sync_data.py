import json
import importlib
import shutil
from time import sleep
from sys import argv

# All the API calls are wrapped in functions
import aavahr_graphql as api


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
            props = json.load(json_file)

            assert "aavaApiServer" in props, "aavaApiServer missing"
            assert "clientId" in props, "clientId missing"
            assert "clientSecret" in props, "clientSecret missing"
            assert "organizationId" in props, "organizationId missing"
            assert "hrMgmtSystem" in props, "hrMgmtSystem missing"
            assert "moduleName" in props["hrMgmtSystem"], "hrMgmtSystem.moduleName missing"
            assert "hourTrackingSystem" in props, "hourTrackingSystem missing"
            assert "moduleName" in props["hourTrackingSystem"], "hourTrackingSystem.moduleName missing"

            return props

    except FileNotFoundError:
        shutil.copyfile('properties-template.json', 'properties.json')
        print('''
        Empty properties file has been created as 'properties.json'
        Fill in the connection parameters and rerun the script
        ''')
        exit()
    except AssertionError as e:
        print("Properties file not complete:", repr(e))
        exit()


def main():
    # Load the connection parameters or inform user that the parameter file is not found
    props = load_properties()

    # Personnel and department data fetching is wrapped in one source file,
    # absences in another one.
    try:
        hrm = importlib.import_module(props["hrMgmtSystem"]["moduleName"])
        ttr = importlib.import_module(
            props["hourTrackingSystem"]["moduleName"])
    except ModuleNotFoundError as e:
        print("Module loading failed:", repr(e))
        exit()

    acceptable_args = [
        '--help',
        '-sd', '--suppress_deps',
        '-se', '--suppress_employees',
        '-sa', '--suppress_absences',
        '-sc', '--suppress_ccs',
        '--read_only'
    ]

    for a in argv[1:]:
        if a not in acceptable_args:
            print('Argument ' + a + ' not recognized, exiting!')
            exit()

    if '--help' in argv:
        print('''
        How to use:
        python sync_data.py [--help | --suppress_deps | --suppress_employees | --suppress_absences | --read_only ]

        Options:
        --help - Show this help
        -sd / --suppress_deps - Don't read or write department information
        -se / --suppress_employees - Don't read or write employee information
        -sa / --suppress_absences - Don't read or write absence information
        -sc / --suppress_ccs - Don't read or write cost center information
        --read_only - Don't make API call, only print out the data that was read from source
        ''')
        exit()

    message_ids = []

    if '-sd' not in argv and '--suppress_deps' not in argv:
        # Load department data from HRM adjacent system and push it to Aava-API
        deps = hrm.get_departments()
        if '--read_only' in argv:
            print(json.dumps(deps, indent=4, sort_keys=True))
        else:
            print("Importing " + str(len(deps)) + " departments...")
            res_deps = api.import_departments(props, deps)
            message_ids.append(res_deps['importDepartments']['messageId'])

    if '-sc' not in argv and '--suppress_ccs' not in argv:
        # Load cost center data from HRM adjacent system and push it to Aava-API
        ccs = hrm.get_cost_centers()
        if '--read_only' in argv:
            print(json.dumps(ccs, indent=4, sort_keys=True))
        else:
            print("Importing " + str(len(ccs)) + " cost centers...")
            res_ccs = api.import_cost_centers(props, ccs)
            message_ids.append(res_ccs['importCostCenters']['messageId'])

    if '-se' not in argv and '--suppress_employees' not in argv:
        # Load employee data from HRM and push it to Aava-API
        emps = hrm.get_personnel()
        if '--read_only' in argv:
            print(json.dumps(emps, indent=4, sort_keys=True))
        else:
            print("Importing " + str(len(emps)) + " employees...")
            res_emps = api.import_employees(props, emps)
            message_ids.append(res_emps['importEmployees']['messageId'])

    if '-sa' not in argv and '--suppress_absences' not in argv:
        # Load absence data from hour trackin system and push it to Aava-API
        abs = ttr.get_absences()
        if '--read_only' in argv:
            print(json.dumps(abs, indent=4, sort_keys=True))
        else:
            print("Importing " + str(len(abs)) + " absences...")
            res_abs = api.import_absences(props, abs)
            message_ids.append(res_abs['importAbsences']['messageId'])

    print("Results:")

    while True:
        # Keep reading statuses until they are all ready
        ready = True
        results = api.get_statuses(props, message_ids)

        for r in results['processingStatusWithVerify']:
            if r['importStatus'] == 'UNKNOWN' or r['importStatus'] == 'IN_PROGRESS':
                ready = False

        if ready:
            break

        print('prosessing...')
        sleep(1)

    for r in results['processingStatusWithVerify']:
        print("\nFor " + str(r['importType']) + " at " + str(r['timestamp']))
        print("Message ID: " + r['messageId'])
        print("Status    : " + r['importStatus'])
        if r['importStatus'] == 'FAILURE':
            print("Error     : " + r['error'])
        if r['warnings']:
            print("\nThere were warnings:")
            for warning in r['warnings']:
                print(warning['warning'], warning['externalId'])


if __name__ == "__main__":
    main()
