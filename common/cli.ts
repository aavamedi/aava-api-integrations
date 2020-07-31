// tslint:disable: no-console
import fs from "fs"
import { ExecutionResult } from "graphql"
import yargs from "yargs"

export const readData = <T>(filename: string): T => {
  if (!fs.existsSync(filename)) {
    throw new Error(`💀  File ${filename} not found, exiting.`)
  }

  console.log(`Reading ${filename}`)
  return JSON.parse(
    fs
      .readFileSync(filename, {
        encoding: "utf-8"
      })
      .toString()
  ) as T
}

export const formatResult = async (
  result: Promise<ExecutionResult | { errors: any; data: any }>
) => {
  try {
    const resolved = await result
    resolved.errors
      ? console.log(
          "Query finished with errors:",
          resolved.data,
          resolved.errors
        )
      : console.log("Query finished, results:", resolved.data)
  } catch (error) {
    // Actual errors from the server may be in error.response.data.errors,
    // which is too deep to be output by console.error
    // tslint:disable: no-unsafe-any
    if (error.response?.data?.errors) {
      console.error(
        `Response: ${error.response?.status} ${error.response?.statusText}`
      )
      console.error("Errors:", error.response.data.errors)
    } else {
      console.error("Failed", error)
    }
    // tslint:enable: no-unsafe-any}
  }
}

type APICommand = (
  argv: yargs.Arguments<{
    filename: string
  }>
) => Promise<void>

export const commandLineInterface = (
  helloWorldCommand: () => {},
  importDepartmentsCommand: APICommand,
  importEmployeesCommand: APICommand,
  importAbsencesCommand: APICommand
) => {
  return yargs
    .scriptName("yarn cli")
    .command("hello", "Get a 'hello' from Aava-API", helloWorldCommand)
    .command(
      "departments <filename>",
      "Send departments to Aava-API",
      y =>
        y.positional("filename", {
          description: "Path of a json file containing departments to upload",
          type: "string",
          demandOption: true
        }),
      importDepartmentsCommand
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
      importEmployeesCommand
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
      importAbsencesCommand
    )
    .strict()
    .demandCommand(1, "Please specify a command").argv
}
