import os
import csv
import utils
import pysftp
import paramiko
from base64 import decodebytes


def parse_date(datestring):
    # Timeplan return the date in format "dd-mm-yy"
    day, month, year = datestring.split('-')
    year = str(int(year) + 2000)
    return '{}-{}-{}'.format(year, month, day)


def get_absences():
    # Load properties and check that they are structurally OK
    props = utils.load_properties()
    try:
        assert props['hourTrackingSystem'] != None, 'No hourTrackingSystem properties section'
        assert props['hourTrackingSystem']['moduleName'] != None, 'Time tracking module name not set'
        assert props['hourTrackingSystem']['host'] != None, 'Time tracking host not set'
        assert props['hourTrackingSystem']['port'] != None, 'Time tracking server port not set'
        assert props['hourTrackingSystem']['path'] != None, 'Time tracking file path not set'
        assert props['hourTrackingSystem']['id'] != None, 'Time tracking user ID not set'
        assert props['hourTrackingSystem']['pw'] != None, 'Time tracking password not set'
        assert props['hourTrackingSystem']['hostKey'] != None, 'Time tracking hostKey not set'
    except Exception as ex:
        print("Properties file not complete:", repr(ex))
        exit()

    absences = []

    # For added security, the server's hostkey is verified against the one stored in properties
    bHostKey = str.encode(props['hourTrackingSystem']['hostKey'])
    hostKey = paramiko.DSSKey(data=decodebytes(bHostKey))
    cnopts = pysftp.CnOpts()
    cnopts.hostkeys.add(props['hourTrackingSystem']['host'],
                        'ssh-rsa',
                        hostKey)

    tempfile = '__temp.csv'

    with pysftp.Connection(host=props['hourTrackingSystem']['host'],
                           username=props['hourTrackingSystem']['id'],
                           password=props['hourTrackingSystem']['pw'],
                           cnopts=cnopts) as sftp:
        sftp.get(props['hourTrackingSystem']['path'], tempfile)

    csvfile = open(tempfile, 'r')
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        absence = {
            'externalId': row[0],
            'startDate': parse_date(row[2]),
            'endDate': parse_date(row[3])
        }
        absences.append(absence)

    os.remove(tempfile)

    return absences
