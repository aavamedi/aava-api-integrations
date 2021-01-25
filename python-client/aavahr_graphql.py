import json
import requests
from base64 import b64encode
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport


def get_bearer_token(parameters: dict) -> dict:
    """
    Retrieves the bearer token that will be needed for all requests to Aava API
    In this and the following functions the 'parameters' variable must contain
    a dictionary object with the parameters read from properties.json file

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)

    Returns:
        dict: Bearer Token for making requests; a dictionary object, the key for token is 'access_token'
    """

    basic_auth = b64encode(str.encode(
        parameters['clientId'] + ':' + parameters['clientSecret']))
    hdrs = {
        'Accept': "application/json",
        'Authorization': 'Basic ' + basic_auth.decode('utf-8'),
        'Content-Type': "application/x-www-form-urlencoded"
    }
    payload = "grant_type=client_credentials&scope=api:read"
    resp = requests.post(
        parameters['aavaApiServer'] + '/auth/token', data=payload, headers=hdrs)
    if resp.status_code == 200:
        return json.loads(resp.text)


def import_departments(parameters: dict, departments: dict) -> dict:
    """
    Imports the department information to Aava API.

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)
        departments (dict): A dictionary object containing the department data (see simple_example_hrm.py)

    Returns:
        dict: Structure containing the request ID for querying the status of request; in r['importDepartments']['messageId']
    """

    mutation = '''
        mutation importDepartments(
            $organizationId: ID!
            $departments: [DepartmentInput!]!
        ) {
            importDepartments(
            organizationExternalId: $organizationId
            departments: $departments
            ) {
            messageId
            }
        }
    '''
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + '/hr',
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    query = gql(mutation)
    variables = {
        "organizationId": parameters['organizationId'],
        "departments": departments,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result


def import_cost_centers(parameters: dict, costCenters: dict) -> dict:
    """
    Imports the cost center information to Aava API.

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)
        costCenters (dict): A dictionary object containing the cost center data (similar to department data)

    Returns:
        dict: Structure containing the request ID for querying the status of request; in r['importCostCenters']['messageId']
    """

    mutation = '''
        mutation importCostCenters(
            $organizationId: ID!
            $costCenters: [CostCenterInput!]!
        ) {
            importCostCenters(
            organizationExternalId: $organizationId
            costCenters: $costCenters
            ) {
            messageId
            }
        }
    '''
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + '/hr',
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    query = gql(mutation)
    variables = {
        "organizationId": parameters['organizationId'],
        "costCenters": costCenters,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result


def import_employees(parameters: dict, employees: dict) -> dict:
    """
    Imports the employee information retrieved from HRM to Aava API

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)
        employees (dict): A dictionary object containing the employee data (see simple_example_hrm.py)

    Returns:
        dict: Structure containing the request ID for querying the status of request; in r['importEmployees']['messageId']
    """

    mutation = '''
        mutation importEmployees(
            $organizationId: ID!
            $employees: [EmployeeInput!]!
        ) {
            importEmployees(
                organizationExternalId: $organizationId
                employees: $employees
            ) {
            messageId
            }
        }
    '''
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + "/hr",
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    query = gql(mutation)
    variables = {
        "organizationId": parameters['organizationId'],
        "employees": employees,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result


def import_absences(parameters: dict, absences) -> dict:
    """
    Imports the absence data retrieved from work hour tracking system to Aava API

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)
        absences (dict): A dictionary object containing the absence data (see simple_example_time_tracker.py)

    Returns:
        dict: Structure containing the request ID for querying the status of request; in r['importAbsences']['messageId']
    """

    mutation = '''
        mutation importAbsences(
            $organizationId: ID!
            $absences: [AbsenceInput!]!
        ) {
            importAbsences(
                organizationExternalId: $organizationId
                absences: $absences
            ) {
                messageId
            }
        }
    '''
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + "/hr",
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    query = gql(mutation)
    variables = {
        "organizationId": parameters['organizationId'],
        "absences": absences,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result


def get_statuses(parameters: dict, message_ids: list) -> dict:
    """
    Used to query the status of import operations. Returns a list of status objects, each object containing
    the request ID ('messageId'), timestamp ('timestamp'), import type ('importType') and the current status
    of the operation (key 'importStatus', value one of UNKNOWN, IN_PROGRESS, FAILURE, DONE)

    Args:
        parameters (dict): Parameters for connecting to Aava API (see properties-template.json)
        message_ids (list): An array containing the message IDs received from import requests

    Returns:
        dict: A dictionary object with key 'processingStatus', under which there is an array of status objects
    """

    query = gql('''
        query processingStatusWithVerify(
            $messageIds: [ID!]!
            $organizationExternalId: ID!
        ) {
            processingStatusWithVerify(
                messageIds: $messageIds,
                organizationExternalId: $organizationExternalId
            ) {
                messageId,
                importType,
                importStatus,
                timestamp,
                error
            }
        }
    ''')
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + "/hr",
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    variables = {
        "messageIds": message_ids,
        "organizationExternalId": parameters['organizationId']
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result
