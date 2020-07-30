import ApolloClient, { gql } from "apollo-boost"
import fetch from "cross-fetch"
import { AavaApiIntegrationsConfiguration } from "../../common/configuration"
import { getBearerToken } from "../../common/authentication"
import { ExecutionResult } from "graphql"
import {
  DepartmentInput,
  EmployeeInput,
  AbsenceInput
} from "../../generated/aava-api-types"
import { stdout } from "process"

const getApolloClient = async (
  configuration: AavaApiIntegrationsConfiguration
) => {
  const bearerToken = await getBearerToken(configuration)

  stdout.write(
    `Initializing client with endpoint ${configuration.aavaApiServer}\n`
  )
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
): Promise<ExecutionResult> => {
  const client = await getApolloClient(configuration)
  const result = await client.query({
    query: gql`
      {
        hello
      }
    `
  })
  return result
}

export const importDepartments = async (
  configuration: AavaApiIntegrationsConfiguration,
  departments: DepartmentInput[]
): Promise<ExecutionResult> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importDepartments... ")
  const result = await client.mutate({
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
  stdout.write("done\n")
  return result
}

export const importEmployees = async (
  configuration: AavaApiIntegrationsConfiguration,
  employees: EmployeeInput[]
): Promise<ExecutionResult> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importEmployees... ")
  const result = await client.mutate({
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
  stdout.write("done\n")
  return result
}

export const importAbsences = async (
  configuration: AavaApiIntegrationsConfiguration,
  absences: AbsenceInput[]
): Promise<ExecutionResult> => {
  const client = await getApolloClient(configuration)
  stdout.write("Sending mutation importAbsences... ")
  const result = await client.mutate({
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
  stdout.write("done\n")
  return result
}
