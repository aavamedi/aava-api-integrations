import axios from "axios"
import { AavaApiIntegrationsConfiguration } from "./configuration"
import { stdout } from "process"

export const getBearerToken = async (
  configuration: AavaApiIntegrationsConfiguration
): Promise<string> => {
  stdout.write("Authenticating... ")
  const basicAuth = Buffer.from(
    `${configuration.clientId}:${configuration.clientSecret}`
  ).toString("base64")

  const url = new URL("/auth/token", configuration.aavaApiServer).href
  const options = {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }

  const payload = "grant_type=client_credentials&scope=api:read"
  const response = await axios.post<{ access_token: string }>(
    url,
    payload,
    options
  )
  const bearerToken = `Bearer ${response.data.access_token}`
  stdout.write("done\n")
  return bearerToken
}
