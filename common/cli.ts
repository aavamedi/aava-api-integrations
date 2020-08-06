// tslint:disable: no-console
import fs from "fs"
import yargs from "yargs"
import { promisify } from "util"

export const readData = <T>(filename: string): T => {
  if (!fs.existsSync(filename)) {
    throw new Error(`💀  File ${filename} not found`)
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

type StatusCommand = (messageId: string) => Promise<string | undefined>

export const waitForProcessingResult = async (
  result: Promise<string | undefined>,
  statusCommand: StatusCommand
) => {
  try {
    const messageId = await result
    console.log("Message id", messageId)
    if (!messageId) {
      throw new Error("Query finished, but no message id")
    }

    let times = 20
    while (times-- > 0) {
      const status = await statusCommand(messageId)
      console.log(`Processing status: ${status} (${20 - times}/20)`)
      if (status === "DONE") {
        break
      }
      await promisify(setTimeout)(2000)
    }
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

type ImportCommand = (
  argv: yargs.Arguments<{
    filename: string
  }>
) => Promise<void>

export const commandLineInterface = (
  helloWorldCommand: () => {},
  importDepartmentsCommand: ImportCommand,
  importEmployeesCommand: ImportCommand,
  importAbsencesCommand: ImportCommand
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
