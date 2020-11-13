import utils
from openpyxl import load_workbook


def get_departments():
    # Load properties and check that they are structurally OK
    props = utils.load_properties()
    try:
        assert props['hrMgmtSystem'] != None, 'No HRM properties section'
        assert props['hrMgmtSystem']['departmentsFile'] != None, 'HRM Departments Excel file not set'
    except Exception as ex:
        print("Properties file not complete:", repr(ex))
        exit()

    wb = load_workbook(props['hrMgmtSystem']['departmentsFile'])

    departments = []
    for row in wb.active.iter_rows(min_row=2):
        external_id, fi, sv, en = row
        dep = {
            'externalId': external_id.value,
            'names': {
            }
        }
        if row[1].value:
            dep['names']['fi'] = fi.value
        if row[2].value:
            dep['names']['sv'] = sv.value
        if row[3].value:
            dep['names']['en'] = en.value

        departments.append(dep)

    return departments


def get_personnel():
    # Load properties and check that they are structurally OK
    props = utils.load_properties()
    try:
        assert props['hrMgmtSystem'] != None, 'No HRM properties section'
        assert props['hrMgmtSystem']['employeeFile'] != None, 'HRM Employees Excel file not set'
    except Exception as ex:
        print("Properties file not complete:", repr(ex))
        exit()

    wb = load_workbook(props['hrMgmtSystem']['employeeFile'])

    employees = []
    for row in wb.active.iter_rows(min_row=2):
        employee = {
            'externalId': row[0].value,
            'ssn': row[2].value,
            'callName': row[3].value,
            'lastName': row[4].value,
            'emailAddress': row[5].value,
            'localPhoneNumber': row[8].value,
            'startDate': row[10].value.strftime('%Y-%m-%d'),
            'departments': [{
                'externalId': row[12].value,
                'startDate': row[10].value.strftime('%Y-%m-%d'),
            }]
        }
        if row[11].value:
            employee['endDate'] = row[11].value.strftime('%Y-%m-%d')
        if row[14].value and row[15].value:
            employee['supervisors'] = [{
                'externalId': row[14].value,
                'startDate': row[15].value.strftime('%Y-%m-%d')
            }]
        employees.append(employee)

    return employees
