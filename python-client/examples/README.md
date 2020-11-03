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
