// This file was generated by sympa-codegen.ts
export type DemoAava = {
  externalId: string,
  identifier: string,
  ssn?: string,
  callName?: string,
  lastName: string,
  emailAddress?: string,
  privateEmailAddress?: string,
  localPhoneNumber?: string,
  supervisor?: string,
  Employments: Employments__DemoAava__TYPE[],
  Departments: Departments__DemoAava__TYPE[]
}
export type Employments__DemoAava__TYPE = {
  validFrom?: string,
  startDate?: string,
  endDate?: string,
  validUntil?: string,
  Approval?: number
}
export type Departments__DemoAava__TYPE = {
  startDate?: string,
  departmentId?: string,
  endDate?: string,
  Approval?: number
}
export type DemoAavaDepartments = {
  externalId: string,
  name: string
}