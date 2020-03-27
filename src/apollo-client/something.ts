// tslint:disable: no-console
import ApolloClient, { FetchResult, gql } from "apollo-boost"
import fetch from "cross-fetch"
import { AavaApiIntegrationsConfiguration } from "../configuration"
import { getOktaAuthToken } from "../authentication"
import { HelloQuery } from "../../generated/aava-api-types"

let bearerToken = "Bearer generate_me"

const getApolloClient = async (
  configuration: AavaApiIntegrationsConfiguration
) => {
  const response = await getOktaAuthToken(configuration)
  // tslint:disable-next-line: no-unsafe-any
  bearerToken = `Bearer ${response.access_token}`

  return new ApolloClient({
    fetch,
    uri: `${configuration.aavaApiServer}/aava-api`,
    headers: {
      Authorization: bearerToken
    }
  })
}

export const helloWorld = async (
  configuration: AavaApiIntegrationsConfiguration
) => {
  const client = await getApolloClient(configuration)
  const result: FetchResult<HelloQuery> = await client.query({
    query: gql`
      {
        hello
      }
    `
  })
  console.log("result", result.data)
  return result.data && result.data.hello
}
