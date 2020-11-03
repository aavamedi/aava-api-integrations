import utils
import datetime
from openpyxl import load_workbook


def get_absences():
    # Load properties and check that they are structurally OK
    props = utils.load_properties()
    try:
        assert props['hourTrackingSystem'] != None, 'No HRM properties section'
        assert props['hourTrackingSystem']['absenceFile'] != None, 'Hour tracking system Absence Excel file not set'
    except Exception as ex:
        print("Properties file not complete:", repr(ex))
        exit()

    wb = load_workbook(props['hourTrackingSystem']['absenceFile'])

    absences = []
    for row in wb.active.iter_rows(min_row=2):
        absence = {
            'externalId': row[0].value,
            'startDate': row[1].value.strftime('%Y-%m-%d')
        }
        if row[2].value:
            absence['endDate'] = row[2].value.strftime('%Y-%m-%d')
        if row[3].value:
            absence['approvalType'] = row[3].value
        absences.append(absence)

    return absences
