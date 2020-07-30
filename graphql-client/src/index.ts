// tslint:disable: no-console
import {
  importDepartments,
  helloWorld,
  importEmployees,
  importAbsences
} from "./graphql-client"
import yargs from "yargs"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput
} from "../../generated/aava-api-types"
import { readConfiguration } from "../../common/configuration"
import { readData, formatResult, commandLineInterface } from "../../common/cli"

const aavaApiIntegrationsConfiguration = readConfiguration()

const helloWorldCommand = async () => {
  await formatResult(helloWorld(aavaApiIntegrationsConfiguration))
}

const importDepartmentsCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const departments = readData<DepartmentInput[]>(argv.filename)
  await formatResult(
    importDepartments(aavaApiIntegrationsConfiguration, departments)
  )
}

const importEmployeesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const employees = readData<EmployeeInput[]>(argv.filename)
  await formatResult(
    importEmployees(aavaApiIntegrationsConfiguration, employees)
  )
}

const importAbsencesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const absences = readData<AbsenceInput[]>(argv.filename)
  await formatResult(importAbsences(aavaApiIntegrationsConfiguration, absences))
}

commandLineInterface(
  helloWorldCommand,
  importDepartmentsCommand,
  importEmployeesCommand,
  importAbsencesCommand
)
