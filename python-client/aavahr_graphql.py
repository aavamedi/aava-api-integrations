import json
import requests
from base64 import b64encode
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport


def get_bearer_token(parameters):
    # Retrieves the bearer token that will be needed for all requests to Aava API
    # In this and the following functions the 'parameters' variable must contain
    # a dictionary object with the parameters read from properties.json file
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


def import_departments(parameters, departments):
    # Sends the department information to API
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
        url=parameters['aavaApiServer'],
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    query = gql(mutation)
    variables = {
        "organizationId": parameters['organizationId'],
        "departments": departments,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result


def import_employees(parameters, employees):
    # Sends the employee information to API
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


def import_absences(parameters, absences):
    # Sends the absence data to API
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


def get_statuses(parameters, message_ids):
    # Used to query the status of import operations.
    # message_ids parameter must be an array with the response IDs
    # retrieved from previous function calls
    query = gql('''
        query processingStatus(
            $messageIds: [ID!]!
        ) {
            processingStatus(
                messageIds: $messageIds
            ) {
                messageId,
                importType,
                importStatus,
                timestamp
            }
        }
    ''')
    client = Client(transport=RequestsHTTPTransport(
        url=parameters['aavaApiServer'] + "/hr",
        headers={'Authorization': 'Bearer ' + parameters['bearerToken']})
    )

    variables = {
        "messageIds": message_ids,
    }

    result = client.execute(query, variable_values=json.dumps(variables))
    return result
