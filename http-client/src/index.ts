// tslint:disable: no-console

import { readConfiguration } from "../../common/configuration"
import { readData, commandLineInterface, formatResult } from "../../common/cli"
import yargs from "yargs"
import {
  helloWorld,
  importDepartments,
  importEmployees,
  importAbsences
} from "./http-client"

const aavaApiIntegrationsConfiguration = readConfiguration()

const helloWorldCommand = async () => {
  await formatResult(helloWorld(aavaApiIntegrationsConfiguration))
}

const importDepartmentsCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const departments = readData<any>(argv.filename)
  await formatResult(
    importDepartments(aavaApiIntegrationsConfiguration, departments)
  )
}

const importEmployeesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const employees = readData<any>(argv.filename)
  await formatResult(
    importEmployees(aavaApiIntegrationsConfiguration, employees)
  )
}

const importAbsencesCommand = async (
  argv: yargs.Arguments<{
    filename: string
  }>
) => {
  const absences = readData<any>(argv.filename)
  await formatResult(importAbsences(aavaApiIntegrationsConfiguration, absences))
}

commandLineInterface(
  helloWorldCommand,
  importDepartmentsCommand,
  importEmployeesCommand,
  importAbsencesCommand
)
