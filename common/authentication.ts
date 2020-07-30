import axios from "axios"
import { AavaApiIntegrationsConfiguration } from "./model"

export const getAuthToken = async (
  configuration: AavaApiIntegrationsConfiguration
): Promise<string> => {
  const basicAuth = Buffer.from(
    `${configuration.clientId}:${configuration.clientSecret}`
  ).toString("base64")

  const url = configuration.aavaApiServer + "/auth/token"
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }

  const payload = "grant_type=client_credentials&scope=api:read"
  const response = await axios.post<{ access_token: string }>(
    url,
    payload,
    options
  )
  return response.data.access_token
}
