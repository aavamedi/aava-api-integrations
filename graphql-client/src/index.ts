import {
  helloWorld,
  importDepartments,
  importEmployees,
  importAbsences,
  getProcessingStatusCommand
} from "./graphql-client"
import yargs from "yargs"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput
} from "../../generated/aava-api-types"
import { readConfiguration } from "../../common/configuration"
import {
  readData,
  waitForProcessingResult,
  commandLineInterface
} from "../../common/cli"

const aavaApiIntegrationsConfiguration = readConfiguration()

const helloWorldCommand = async () => {
  // tslint:disable-next-line: no-console
  console.log("Hello? " + (await helloWorld(aavaApiIntegrationsConfiguration)))
}

const importDepartmentsCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const departments = readData<DepartmentInput[]>(argv.filename)
  await waitForProcessingResult(
    importDepartments(aavaApiIntegrationsConfiguration, departments),
    getProcessingStatusCommand(aavaApiIntegrationsConfiguration)
  )
}

const importEmployeesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const employees = readData<EmployeeInput[]>(argv.filename)
  await waitForProcessingResult(
    importEmployees(aavaApiIntegrationsConfiguration, employees),
    getProcessingStatusCommand(aavaApiIntegrationsConfiguration)
  )
}

const importAbsencesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const absences = readData<AbsenceInput[]>(argv.filename)
  await waitForProcessingResult(
    importAbsences(aavaApiIntegrationsConfiguration, absences),
    getProcessingStatusCommand(aavaApiIntegrationsConfiguration)
  )
}

commandLineInterface(
  helloWorldCommand,
  importDepartmentsCommand,
  importEmployeesCommand,
  importAbsencesCommand
)
