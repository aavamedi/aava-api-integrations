# Example modules

To kick start your integration project, some example modules are included. You
may freely copy and modify these modules to suit your purposes.

## Simple example

A module with hard coded value to demonstrate the data structure used for
sending data to the API.

Files:

```
simple_example_hrm.py
simple_example_time_tracker.py
```

This module is preconfigured in the properties-template.json file, if you want
to play around with the data and see how it is transmitted over GraphQL.

## Excel example

This module is more closely resembling of a real life solution. It can even be
used as such by simply configuring a HR management system and Hour tracking systems
to produce Excel files with columns corresponding to the ones in the examples.

To run this example, you will need to install openpyxl library:

`pip install openpyxl`

Files:

```
excel_example_hrm.py
excel_example_time_tracker.py
excel_example_hrm.xlsx
excel_example_time_tracker.xlsx
excel_example_departments.xlsx
properties-excel-example.json
```

This example also shows, how module specific properties can be configured in the
properties JSON file. Copy the example JSON to the parent directory with name
properties.json to use it as the basis for your further development.

## SympaHR Example

This is a copy of the actual module used by Aava itself (with very minor changes).
Since in our setup the departments can not be fetched from SympaHR with a separate
query, both departments and employees are retrieved in one run. Also, the department
ID is not available through the REST API, so a unique identifier is generated from
the Finnish name of the department.

Files:

```
properties-sympahr-example.json
sympahr_example_hrm.py
```

The module specific properties are the URL of the REST API, username and password. These
can be either requested from Sympa or they can be generated with SympaHR admin tools. The
values in example properties file are copied from Sympa Integration Guide, and do not work.
