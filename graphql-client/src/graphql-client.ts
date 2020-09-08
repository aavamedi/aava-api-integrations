import ApolloClient, { gql } from "apollo-boost"
import fetch from "cross-fetch"
import { AavaApiIntegrationsConfiguration } from "../../src/common/configuration"
import { getBearerToken } from "../../src/common/authentication"
import { ExecutionResult } from "graphql"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput,
  ProcessingStatus,
  ProcessingState
} from "../../generated/aava-api-types"
import { stdout } from "process"

const getApolloClient = async (
  configuration: AavaApiIntegrationsConfiguration,
  noAuthorization?: boolean
) => {
  const bearerToken = !noAuthorization && (await getBearerToken(configuration))

  return new ApolloClient({
    fetch,
    uri: `${configuration.aavaApiServer}`,
    headers: {
      Authorization: bearerToken
    }
  })
}

export const helloWorld = async (
  configuration: AavaApiIntegrationsConfiguration
): Promise<string | undefined> => {
  const client = await getApolloClient(configuration)
  const result = await client.query<{ hello: boolean }>({
    query: gql`
      {
        hello
      }
    `
  })
  assertNoErrors(result)
  return result.data.hello ? "yes" : "no"
}

export const importDepartments = async (
  configuration: AavaApiIntegrationsConfiguration,
  departments: DepartmentInput[]
): Promise<string[]> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importDepartments... ")
  const result = await client.mutate<{
    importDepartments: { messageId: string }
  }>({
    mutation: gql`
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
  })
  assertNoErrors(result)
  stdout.write("done\n")
  return result.data? [result.data.importDepartments.messageId] : []
}

export const importEmployees = async (
  configuration: AavaApiIntegrationsConfiguration,
  employees: EmployeeInput[]
): Promise<string[]> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importEmployees... ")
  const result = await client.mutate<{
    importEmployees: { messageId: string }
  }>({
    mutation: gql`
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
  })
  assertNoErrors(result)
  stdout.write("done\n")
  return result.data ? [result.data.importEmployees.messageId] : []
}

export const importAbsences = async (
  configuration: AavaApiIntegrationsConfiguration,
  absences: AbsenceInput[]
): Promise<string[]> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importAbsences... ")
  const result = await client.mutate<{
    importAbsences: { messageId: string }
  }>({
    mutation: gql`
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
  })
  assertNoErrors(result)
  stdout.write("done\n")
  return result.data? [result.data.importAbsences.messageId] : []
}

export const getProcessingStatusCommand = (
  configuration: AavaApiIntegrationsConfiguration
) => {
  return async (messageIds: string[]): Promise<ProcessingState[]> => {
    const client = await getApolloClient(configuration, true)
    const result = await client.query<{ processingStatus: ProcessingStatus[] }>({
      query: gql`
        query getProcessingStatus($messageIds: [ID!]!) {
          processingStatus(messageIds: $messageIds) {
            importStatus
          }
        }
      `,
      variables: {
        messageIds
      }
    })
    assertNoErrors(result)
    return result.data.processingStatus.map(({ importStatus }) => importStatus)
  }
}

const assertNoErrors = (result: ExecutionResult) => {
  if (result.errors) {
    throw new Error(
      "GraphQL query resulted in error(s): " +
        result.errors.map(e => e.message).join(", ")
    )
  }
}
