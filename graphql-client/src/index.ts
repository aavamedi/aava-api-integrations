import {
  helloWorld,
  importDepartments,
  importEmployees,
  importAbsences,
  getProcessingStatusCommand,
  importCostCenters,
} from "./graphql-client"
import yargs from "yargs"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput,
  CostCenterInput,
} from "../../generated/aava-api-types"
import { readConfiguration } from "../../src/common/configuration"
import {
  parseDepartmentData,
  parseEmployeeData,
} from "../../src/sympa/sympa-parser"
import {
  readData,
  waitForProcessingResult,
  commandLineInterface,
} from "../../src/common/cli"

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

const parseAndImportDepartmentsCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const departments = parseDepartmentData(argv.filename)
  await waitForProcessingResult(
    importDepartments(aavaApiIntegrationsConfiguration, departments),
    getProcessingStatusCommand(aavaApiIntegrationsConfiguration)
  )
}

const parseAndImportEmployeesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const employees = parseEmployeeData(argv.filename)
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

const importCostCentersCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const costCenters = readData<CostCenterInput[]>(argv.filename)
  await waitForProcessingResult(
    importCostCenters(aavaApiIntegrationsConfiguration, costCenters),
    getProcessingStatusCommand(aavaApiIntegrationsConfiguration)
  )
}

commandLineInterface(
  helloWorldCommand,
  importDepartmentsCommand,
  importEmployeesCommand,
  parseAndImportDepartmentsCommand,
  parseAndImportEmployeesCommand,
  importAbsencesCommand,
  importCostCentersCommand
)
