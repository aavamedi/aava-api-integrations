// tslint:disable: no-console
import axios from "axios"
import { AavaApiIntegrationsConfiguration } from "../../src/common/configuration"
import { getBearerToken } from "../../src/common/authentication"

interface GraphQLHTTPResponse<T> {
  data: T
  errors: any
}

const makeAuthorizedRequest = async <T>(
  configuration: AavaApiIntegrationsConfiguration,
  payload: {
    query: string
    variables?: any
  }
): Promise<GraphQLHTTPResponse<T>> => {
  const response = await axios.post<GraphQLHTTPResponse<T>>(
    configuration.aavaApiServer,
    payload,
    {
      headers: {
        Authorization: await getBearerToken(configuration)
      }
    }
  )
  assertNoErrors(response.data)
  return response.data
}

const assertNoErrors = (result: GraphQLHTTPResponse<any>) => {
  if (result.errors) {
    throw new Error("GraphQL query resulted in error(s)" + result.errors)
  }
}

export const helloWorld = async (
  configuration: AavaApiIntegrationsConfiguration
): Promise<string> => {
  const payload = { query: "{ hello }" }

  const result = await makeAuthorizedRequest<{ hello: boolean }>(
    configuration,
    payload
  )
  return result.data.hello ? "yes" : "no"
}

export const importDepartments = async (
  configuration: AavaApiIntegrationsConfiguration,
  departments: any
): Promise<string[]> => {
  const payload = {
    query: `
      mutation importDepartments(
        $organizationId: ID!
        $departments: [DepartmentInput!]!
      ) {
        importDepartments(
          organizationExternalId: $organizationId
          departments: $departments
        ) {
          messageId
        }
      }
    `,
    variables: {
      organizationId: configuration.organizationId,
      departments
    }
  }
  const messageId = (
    await makeAuthorizedRequest<{
      importDepartments: { messageId: string }
    }>(configuration, payload)
  ).data.importDepartments.messageId
  return [messageId]
}

export const importEmployees = async (
  configuration: AavaApiIntegrationsConfiguration,
  employees: any
): Promise<string[]> => {
  const payload = {
    query: `
      mutation importEmployees(
        $organizationId: ID!
        $employees: [EmployeeInput!]!
      ) {
        importEmployees(
          organizationExternalId: $organizationId
          employees: $employees
        ) {
          messageId
        }
      }
    `,
    variables: {
      organizationId: configuration.organizationId,
      employees
    }
  }
  const messageId = (
    await makeAuthorizedRequest<{ importEmployees: { messageId: string } }>(
      configuration,
      payload
    )
  ).data.importEmployees.messageId
  return [messageId]
}

export const importAbsences = async (
  configuration: AavaApiIntegrationsConfiguration,
  absences: any
): Promise<string[]> => {
  const payload = {
    query: `
      mutation importAbsences(
        $organizationId: ID!
        $absences: [AbsenceInput!]!
      ) {
        importAbsences(
          organizationExternalId: $organizationId
          absences: $absences
        ) {
          messageId
        }
      }
    `,
    variables: {
      organizationId: configuration.organizationId,
      absences
    }
  }
  const messageId = (
    await makeAuthorizedRequest<{ importAbsences: { messageId: string } }>(
      configuration,
      payload
    )
  ).data.importAbsences.messageId
  return [messageId]
}

export const getProcessingStatusCommand = (
  configuration: AavaApiIntegrationsConfiguration
) => {
  return async (messageIds: string[]): Promise<string[]> => {
    const payload = {
      query: `
    query {
      processingStatus(messageIds: [${messageIds.map(m => `"${m}"`)}]) {
        importStatus
      }
    }
  `
    }
    const response = await axios.post<
      GraphQLHTTPResponse<{ processingStatus: { importStatus: string }[] }>
    >(configuration.aavaApiServer, payload)
    return response.data.data.processingStatus.map(
      ({ importStatus }) => importStatus
    )
  }
}
