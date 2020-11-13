import utils
import requests
from requests.auth import HTTPBasicAuth
from hashlib import md5

# In this implementation it is assumed, that SympaHR has no separate
# method for querying only the department info. To avoid doubling the
# REST request, we are using a global parameter to store the fetched
# data for the duration of the run
deps = {}
employees = []


def get_depId(department_name):
    # Since SympaHR has no unique ID for the departments, we are using
    # a hash generated from the Finnish department name as one
    return md5(department_name.encode("UTF-8")).hexdigest()[0:15]


def load_sympa():
    # Load properties and check that they are structurally OK
    props = utils.load_properties()
    try:
        assert props['hrMgmtSystem'] != None, 'No HRM properties section'
        assert props['hrMgmtSystem']['moduleName'] != None, 'HRM module name not set'
        assert props['hrMgmtSystem']['url'] != None, 'HRM URL not set'
        assert props['hrMgmtSystem']['pw'] != None, 'HRM user ID not set'
        assert props['hrMgmtSystem']['id'] != None, 'HRM password not set'
    except Exception as ex:
        print("Properties file not complete:", repr(ex))
        exit()

    # Load all the information for use by the other two functions
    response = requests.get(
        props['hrMgmtSystem']['url'],
        auth=(props['hrMgmtSystem']['id'],
              props['hrMgmtSystem']['pw'])
    )

    if not response:
        print("Could not read employee info")
        print(response.content)
        exit()

    errors = []
    for e in response.json()["value"]:
        # Not all employees are created perfect
        try:
            assert e["Henkilönumero"] != None
            assert e["Henkilötunnus"] != None
            assert len(e["Työsuhdetiedot"]) > 0
        except Exception as ex:
            errors.append(repr(ex))
            continue

        e["Etunimet"] = ' '.join(
            map(lambda x: x.capitalize(), e["Etunimet"].split(' '))
        )

        # Initialize the dictionary with information we trust to
        # always be available
        employee = {
            'externalId': e["Henkilönumero"],
            'identifier': e["Henkilönumero"],
            'ssn': e["Henkilötunnus"],
            'callName': e["Etunimet"].split(' ')[0],
            'lastName': e["Sukunimi"],
            'emailAddress': e["Työsähköposti"],
            'localPhoneNumber': e["Puhelinnumero_työ"],
            'startDate': e["Työsuhdetiedot"][0]["Työsuhteen_alkupvm"],
            'departments': []
        }

        # Add employment end date, if set
        if e["Työsuhdetiedot"][0]["Työsuhteen_päättymispvm"]:
            employee['endDate'] = e["Työsuhdetiedot"][0]["Työsuhteen_päättymispvm"]

        # Add supervisor information, if available
        if e["Lähin_esimies"]:
            employee['supervisors'] = [{
                'externalId': e["Lähin_esimies"],
                'startDate': e["Työsuhdetiedot"][0]["Työsuhteen_alkupvm"]
            }]

        # Add information of past and current departments
        for d in e["Työsuhdetiedot"]:
            try:
                assert d["Kustannuspaikka"] != None
            except Exception as ex:
                errors.append(repr(ex))
                continue

            d_id = get_depId(d["Kustannuspaikka"])

            # make sure the department info is in the deps array
            deps[d_id] = d["Kustannuspaikka"]

            d_info = {
                'externalId': d_id,
                'startDate': d["Rivi_voimassa_alkaen_pvm"]
            }
            if d["Rivi_voimassa_asti_pvm"] != None:
                d_info['endDate'] = d["Rivi_voimassa_asti_pvm"]

            employee['departments'].append(d_info)

        employees.append(employee)

    if len(errors) > 0:
        print("Found {} errors when loading employee data.".format(len(errors)))


def get_departments():
    if len(deps) == 0:
        load_sympa()
    departments = []
    for key in deps:
        departments.append({
            'externalId': key,
            'names': {'fi': deps[key]}
        })
    return departments


def get_personnel():
    if len(employees) == 0:
        load_sympa()
    return employees
