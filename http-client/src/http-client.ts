// tslint:disable: no-console
import axios from "axios"
import { AavaApiIntegrationsConfiguration } from "../../common/configuration"
import { getBearerToken } from "../../common/authentication"

interface GraphQLHTTPResponse {
  data: any
  errors: any
}

const makeAuthorizedRequest = async (
  configuration: AavaApiIntegrationsConfiguration,
  payload: {
    query: string
    variables?: any
  }
): Promise<GraphQLHTTPResponse> => {
  const response = await axios.post<GraphQLHTTPResponse>(
    configuration.aavaApiServer,
    payload,
    {
      headers: {
        Authorization: await getBearerToken(configuration)
      }
    }
  )
  return response.data
}

export const helloWorld = async (
  configuration: AavaApiIntegrationsConfiguration
): Promise<GraphQLHTTPResponse> => {
  const payload = { query: "{ hello }" }

  return makeAuthorizedRequest(configuration, payload)
}

export const importDepartments = async (
  configuration: AavaApiIntegrationsConfiguration,
  departments: any
): Promise<GraphQLHTTPResponse> => {
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
  return makeAuthorizedRequest(configuration, payload)
}

export const importEmployees = async (
  configuration: AavaApiIntegrationsConfiguration,
  employees: any
): Promise<GraphQLHTTPResponse> => {
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
  return makeAuthorizedRequest(configuration, payload)
}

export const importAbsences = async (
  configuration: AavaApiIntegrationsConfiguration,
  absences: any
): Promise<GraphQLHTTPResponse> => {
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
  return makeAuthorizedRequest(configuration, payload)
}
