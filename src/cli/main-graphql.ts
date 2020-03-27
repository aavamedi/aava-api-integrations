// tslint:disable: no-console
import { helloWorld } from "../apollo-client/something"
import * as aavaApiIntegrationsConfiguration from "../../properties.json"

console.log("Running main-graphql")

helloWorld(aavaApiIntegrationsConfiguration)
  .then(() => {
    console.log("...done.")
  })
  .catch(error => {
    console.log("Failed", error)
  })
