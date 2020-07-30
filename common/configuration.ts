import { readData } from "./cli"

export type AavaApiIntegrationsConfiguration = {
  aavaApiServer: string
  clientId: string
  clientSecret: string
  organizationId: string
}

const CONFIGURATION_FILE = "../properties.json"

export const readConfiguration = (): AavaApiIntegrationsConfiguration => {
  return readData<AavaApiIntegrationsConfiguration>(CONFIGURATION_FILE)
}
