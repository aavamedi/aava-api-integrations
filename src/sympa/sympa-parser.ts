import { readData } from "../common/cli"
import {
  DemoAava as Employee,
  Employments__DemoAava__TYPE
} from "../../generated/sympa-types"
import { EmployeeInput } from "../../generated/aava-api-types"
import { parsePhoneNumber } from "libphonenumber-js"

// Note: The data mapping in this file is based on the demo data provided by Sympa HR.
// Each actual integration will need to have it's own mapping implemented.

const readEmployees = (inputFilename: string): Employee[] => {
  const { value: employees } = readData<{
    "@odata.context": string
    value: Employee[]
  }>(inputFilename)
  return employees
}

const sortByStartDate = <T extends { startDate?: string }>(items: T[]): T[] => {
  return items.sort((e1, e2) => {
    if (!e1.startDate) {
      return -1
    }
    if (!e2.startDate) {
      return 1
    }
    return (
      Date.parse(e1.startDate).valueOf() - Date.parse(e2.startDate).valueOf()
    )
  })
}

const sympaEmployeeToEmployeeInput = (employee: Employee): EmployeeInput => {
  const sortedEmployments = sortByStartDate<Employments__DemoAava__TYPE>(
    employee.Employments
  )

  const parsedPhoneNumber =
    employee.localPhoneNumber &&
    parsePhoneNumber(employee.localPhoneNumber.trim(), "FI")
  const phoneCountryCode = parsedPhoneNumber
    ? parsedPhoneNumber.countryCallingCode
    : "-"
  const localPhoneNumber = parsedPhoneNumber
    ? parsedPhoneNumber.nationalNumber
    : "-"

  return ({
    externalId: employee.externalId,
    identifier: employee.identifier,
    // ssn: employee.ssn ? employee.ssn : "010101-1119", // TODO Sympa demo ssn's are invalid
    ssn: "010101-1119",
    callName: employee.callName ? employee.callName : "-",
    lastName: employee.lastName,
    emailAddress: employee.emailAddress,
    privateEmailAddress: employee.privateEmailAddress,
    phoneCountryCode,
    localPhoneNumber,
    startDate: sortedEmployments[0].startDate,
    endDate: sortedEmployments[sortedEmployments.length - 1].endDate,
    departments: employee.Departments.filter(d => d.departmentId).map(d => {
      return {
        externalId: d.departmentId,
        startDate: d.startDate,
        endDate: d.endDate
      }
    }),
    supervisors: employee.supervisor
      ? [
          {
            externalId: employee.supervisor,
            startDate: sortedEmployments[0].startDate // Note: supervisor history is unavailable
          }
        ]
      : []
  } as unknown) as EmployeeInput
}

export const parseEmployeeData = (inputFilename: string): EmployeeInput[] => {
  return readEmployees(inputFilename).map(sympaEmployeeToEmployeeInput)
}