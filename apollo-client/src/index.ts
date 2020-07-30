// tslint:disable: no-console
import {
  importDepartments,
  helloWorld,
  importEmployees,
  importAbsences
} from "./graphql-client"
import fs from "fs"
import { ExecutionResult } from "graphql"
import yargs from "yargs"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput
} from "../../generated/aava-api-types"
import { AavaApiIntegrationsConfiguration } from "../../common/model"

const CONFIGURATION_FILE = "../properties.json"

const readData = <T>(filename: string): T => {
  console.log(`Reading ${filename}`)
  return JSON.parse(
    fs
      .readFileSync(filename, {
        encoding: "utf-8"
      })
      .toString()
  ) as T
}

const formatResult = async (result: Promise<ExecutionResult>) => {
  try {
    const resolved = await result
    resolved.errors
      ? console.log("Query finished with errors:", resolved.errors)
      : console.log("Query finished, results:", resolved.data)
  } catch (error) {
    console.log("Failed", error)
  }
}

if (!fs.existsSync(CONFIGURATION_FILE)) {
  console.error(`💀  Properties file ${CONFIGURATION_FILE} not found, exiting.`)
  process.exit()
}

const aavaApiIntegrationsConfiguration = readData<
  AavaApiIntegrationsConfiguration
>(CONFIGURATION_FILE)

// tslint:disable-next-line: no-unused-expression
yargs
  .scriptName("yarn run cli")
  .command("hello", "Get a 'hello' from Aava-API", async () => {
    await formatResult(helloWorld(aavaApiIntegrationsConfiguration))
  })
  .command(
    "departments <filename>",
    "Send departments to Aava-API",
    y =>
      y.positional("filename", {
        description: "Path of a json file containing departments to upload",
        type: "string",
        demandOption: true
      }),
    async argv => {
      const departments = readData<DepartmentInput[]>(argv.filename)
      await formatResult(
        importDepartments(aavaApiIntegrationsConfiguration, departments)
      )
    }
  )
  .command(
    "employees <filename>",
    "Send employees to Aava-API",
    y =>
      y.positional("filename", {
        description: "Path of a json file containing employees to upload",
        type: "string",
        demandOption: true
      }),
    async argv => {
      const employees = readData<EmployeeInput[]>(argv.filename)
      await formatResult(
        importEmployees(aavaApiIntegrationsConfiguration, employees)
      )
    }
  )
  .command(
    "absences <filename>",
    "Send absences to Aava-API",
    y =>
      y.positional("filename", {
        description: "Path of a json file containing absences to upload",
        type: "string",
        demandOption: true
      }),
    async argv => {
      const absences = readData<AbsenceInput[]>(argv.filename)
      await formatResult(
        importAbsences(aavaApiIntegrationsConfiguration, absences)
      )
    }
  )
  .strict()
  .demandCommand(1, "Please specify a command").argv
