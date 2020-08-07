// tslint:disable: no-console
import { readData } from "./cli"

export type AavaApiIntegrationsConfiguration = {
  aavaApiServer: string
  clientId: string
  clientSecret: string
  organizationId: string
}

const CONFIGURATION_FILE = "../properties.json"

export const readConfiguration = (): AavaApiIntegrationsConfiguration => {
  const conf = readData<AavaApiIntegrationsConfiguration>(CONFIGURATION_FILE)
  console.log(`Using GraphQL endpoint ` + conf.aavaApiServer)
  return conf
}
