import json
import utils
import importlib
from time import sleep
from sys import argv

# All the API calls are wrapped in functions
import aavahr_graphql as api

# Load the connection parameters or inform user that the parameter file is not found
props = utils.load_properties()
if (props is None):
    utils.initialize_properties_and_exit()

try:
    assert "aavaApiServer" in props, "aavaApiServer missing"
    assert "clientId" in props, "clientId missing"
    assert "clientSecret" in props, "clientSecret missing"
    assert "organizationId" in props, "organizationId missing"
    assert "hrm" in props, "hrm missing"
    assert "moduleName" in props["hrm"], "hrm.moduleName missing"
    assert "ttr" in props, "ttr missing"
    assert "moduleName" in props["ttr"], "ttr.moduleName missing"
except Exception as e:
    print("Properties file not complete:", repr(e))
    exit()

# Personnel and department data fetching is wrapped in one source file,
# absences in another one.
try:
    hrm = importlib.import_module(props["hrm"]["moduleName"])
    ttr = importlib.import_module(props["ttr"]["moduleName"])
except Exception as e:
    print("Module loading failed:", repr(e))
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
    --read_only - Don't make API call, only print out the data that was read from source
    ''')
    exit()

# Get an access token for making requests to Aava API
resp = api.get_bearer_token(props)
if resp is None:
    print('Error fetching authentication token, please check properties')
    exit()
props['bearerToken'] = resp['access_token']

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

    for r in results['processingStatus']:
        if r['importStatus'] == 'UNKNOWN' or r['importStatus'] == 'IN_PROGRESS':
            ready = False

    if ready:
        break

    print('prosessing...')
    sleep(1)


for r in results['processingStatus']:
    print("\nFor " + str(r['importType']) + " at " + str(r['timestamp']))
    print("Message ID: " + r['messageId'])
    print("Status    : " + r['importStatus'])
