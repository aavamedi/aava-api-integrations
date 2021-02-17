// tslint:disable: no-console
import fs from "fs"
import yargs from "yargs"
import { promisify } from "util"
import { ProcessingState, ProcessingStatus } from "../../generated/aava-api-types"

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

type StatusCommand = (messageIds: string[]) => Promise<ProcessingStatus[]>

const allImportsAreFinished = (statuses: ProcessingStatus[]) : Boolean =>
  !statuses.some(
    s => s.importStatus !== ProcessingState.Done &&
    s.importStatus !== ProcessingState.Failure
  )

export const waitForProcessingResult = async (
  result: Promise<string[]>,
  statusCommand: StatusCommand
) => {
  try {
    const messageIds = await result
    console.log("Message ids", messageIds)
    if (!messageIds) {
      throw new Error("Query finished, but no message ids")
    }

    let times = 20
    while (times-- > 0) {
      const statuses = await statusCommand(messageIds)
      const states = statuses.map(s => s.importStatus)
      console.log(`Processing status: ${states.join(',')} (${20 - times}/20)`)
      if (allImportsAreFinished(statuses)) {
        statuses.forEach(s => {
          if (s.error !== null) {
            console.log("\nError in request " + s.messageId + ": " + s.error)
          }

          if (Array.isArray(s.warnings)) {
            const warning_texts = s.warnings.map(w => w.warning + " " + w.externalId)
            console.log("\nThere were warnings:\n" + warning_texts.join("\n"))
          }
        })
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
  parseAndImportDepartmentsCommand: ImportCommand,
  parseAndImportEmployeesCommand: ImportCommand,
  importAbsencesCommand: ImportCommand,
  importCostCentersCommand: ImportCommand
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
      "sympa-departments <filename>",
      "Parse departments exported from Sympa HR and send results to Aava-API",
      y =>
        y.positional("filename", {
          description:
            "Path of a Sympa HR export file containing departments to upload",
          type: "string",
          demandOption: true
        }),
      parseAndImportDepartmentsCommand
    )
    .command(
      "sympa-employees <filename>",
      "Parse employees exported from Sympa HR and send results to Aava-API",
      y =>
        y.positional("filename", {
          description:
            "Path of a Sympa HR export file containing employees to upload",
          type: "string",
          demandOption: true
        }),
      parseAndImportEmployeesCommand
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

    .command(
      "cost-centers <filename>",
      "Send cost centers to Aava-API",
      y =>
        y.positional("filename", {
          description: "Path of a json file containing cost centers to upload",
          type: "string",
          demandOption: true
        }),
      importCostCentersCommand
    )
    .strict()
    .demandCommand(1, "Please specify a command").argv
}
