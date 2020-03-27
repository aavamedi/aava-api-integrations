import axios from "axios"
import { AavaApiIntegrationsConfiguration } from "./configuration"

export const getOktaAuthToken = async (
  configuration: AavaApiIntegrationsConfiguration
) => {
  const basicAuth = Buffer.from(
    `${configuration.clientId}:${configuration.clientSecret}`
  ).toString("base64")

  const url = configuration.oktaAuthenticationUrl
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

  const payload = "grant_type=client_credentials&scope=api:read"
  const response = await axios.post(url, payload, options)
  return response.data
}
