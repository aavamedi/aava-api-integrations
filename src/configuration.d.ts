declare module "*.json" {
  const value: AavaApiIntegrationsConfiguration
  export default value
}

export type AavaApiIntegrationsConfiguration = {
  aavaApiServer: string
  oktaAuthenticationUrl: string
  clientId: string
  clientSecret: string
  organizationId: string
}
