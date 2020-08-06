// tslint:disable: no-console

import { readConfiguration } from "../../common/configuration"
import {
  readData,
  commandLineInterface,
  waitForProcessingResult
} from "../../common/cli"
import yargs from "yargs"
import {
  helloWorld,
  importDepartments,
  importEmployees,
  importAbsences,
  getProcessingStatusCommand
} from "./http-client"

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

commandLineInterface(
  helloWorldCommand,
  importDepartmentsCommand,
  importEmployeesCommand,
  importAbsencesCommand
)
