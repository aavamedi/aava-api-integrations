// tslint:disable: no-console

import { readConfiguration } from "../../src/common/configuration"
import {
  readData,
  commandLineInterface,
  waitForProcessingResult,
} from "../../src/common/cli"
import yargs from "yargs"
import {
  helloWorld,
  importDepartments,
  importEmployees,
  importAbsences,
  getProcessingStatusCommand,
  importCostCenters,
} from "./http-client"
import {
  parseEmployeeData,
  parseDepartmentData,
} from "../../src/sympa/sympa-parser"

const aavaApiIntegrationsConfiguration = readConfiguration()

const helloWorldCommand = async () => {
  console.log("Hello? " + (await helloWorld(aavaApiIntegrationsConfiguration)))
}

const importDepartmentsCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const departments = readData<any>(argv.filename)
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
  const employees = readData<any>(argv.filename)
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
  const absences = readData<any>(argv.filename)
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
  const costCenters = readData<any>(argv.filename)
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
