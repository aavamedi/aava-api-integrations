/* tslint:disable */
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** Date in ISO 8601 format */
  Date: string,
  /** Non-empty String with less than 1024 characters */
  MediumString: string,
  /** Finnish social security number */
  SSN: string,
  /** Universally Unique Identifier */
  UUID: string,
};


/** Type of the approval for absence */
export enum AbsenceApprovalType {
  /** Own notive, with the permission of the supervisor */
  Supervisor = 'Supervisor',
  /** Doctor's note */
  Doctor = 'Doctor',
  /** Nurse's note */
  Nurse = 'Nurse'
}

export type AbsenceInput = {
  /** Unique identifier of the employee */
  externalId: Scalars['ID'],
  /** Start date of the absence */
  startDate: Scalars['Date'],
  /** End date of the absence */
  endDate?: Maybe<Scalars['Date']>,
  /** Type of absence approval */
  approvalType?: Maybe<AbsenceApprovalType>,
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type DepartmentInput = {
  /** Identifier of the department */
  externalId: Scalars['ID'],
  /** Localized names of the department */
  names: NamesInput,
  /** Short name of the department */
  code?: Maybe<Scalars['MediumString']>,
};

/** Response to import mutations */
export type DhImportPushResponse = {
   __typename?: 'DhImportPushResponse',
  /** The identifier of the batch of data received to be processed. The value can be used to trace the status of the processing. */
  messageId?: Maybe<Scalars['MediumString']>,
};

export type EmployeeDepartmentInput = {
  /** Identifier of the department where the employee has worked in */
  externalId: Scalars['ID'],
  /** Start date of working at the department */
  startDate: Scalars['Date'],
  /** End date of working at the department, if any */
  endDate?: Maybe<Scalars['Date']>,
};

/** Input type for importing employees. */
export type EmployeeInput = {
  /** Unique identifier of the employee */
  externalId: Scalars['ID'],
  /** Human-readable identifier of the employee, such as employee number */
  identifier?: Maybe<Scalars['MediumString']>,
  /** Social security number */
  ssn: Scalars['SSN'],
  /** Call name of the employee, such as the given name */
  callName: Scalars['MediumString'],
  /** Last name of the employee, such as the family name */
  lastName: Scalars['MediumString'],
  /** Work-related email address of the employee */
  emailAddress?: Maybe<Scalars['MediumString']>,
  /** Private, personal email address of the employee */
  privateEmailAddress?: Maybe<Scalars['MediumString']>,
  /** Local phone number of the employee, given without the country code */
  localPhoneNumber?: Maybe<Scalars['MediumString']>,
  /** Phone country code, given with the leading plus */
  phoneCountryCode?: Maybe<Scalars['MediumString']>,
  /** Start date of the employment relationship */
  startDate: Scalars['Date'],
  /** End date of the employment relationship, if any */
  endDate?: Maybe<Scalars['Date']>,
  /** Deparments where the employee has worked in */
  departments?: Maybe<Array<EmployeeDepartmentInput>>,
  /** Supervisors of the employee */
  supervisors?: Maybe<Array<EmployeeSupervisorInput>>,
};

export type EmployeeSupervisorInput = {
  /** Reference to the external identifier of the employee object of the supervisor of the employee */
  externalId: Scalars['ID'],
  /** Start date of the supervisory relationship */
  startDate: Scalars['Date'],
  /** End date of the supervisory relationship, if any */
  endDate?: Maybe<Scalars['Date']>,
};

/** Response to import mutations */
export type ImportPushResponse = {
   __typename?: 'ImportPushResponse',
  /** The identifier of the batch of data received to be processed. The value can be used to trace the status of the processing. */
  messageId?: Maybe<Scalars['MediumString']>,
};


export type Mutation = {
   __typename?: 'Mutation',
  /** Placeholder for empty mutation base type. Has no resolver. */
  _empty?: Maybe<Scalars['String']>,
  /** Import departments to the Aava-HR application */
  importDepartments: ImportPushResponse,
  /** Import employees to the Aava-HR application */
  importEmployees: ImportPushResponse,
  /** Import absences of employees to the Aava-HR application */
  importAbsences: ImportPushResponse,
  /** Import private persons to Aava */
  importPrivateCustomers: Array<DhImportPushResponse>,
};


export type MutationImportDepartmentsArgs = {
  organizationExternalId: Scalars['ID'],
  departments: Array<DepartmentInput>
};


export type MutationImportEmployeesArgs = {
  organizationExternalId: Scalars['ID'],
  employees: Array<EmployeeInput>
};


export type MutationImportAbsencesArgs = {
  organizationExternalId: Scalars['ID'],
  absences: Array<AbsenceInput>
};


export type MutationImportPrivateCustomersArgs = {
  updateData?: Maybe<Scalars['Boolean']>,
  PrivateCustomers: Array<PrivateCustomerInput>
};

/** Localized names */
export type NamesInput = {
  /** The name in Finnish */
  fi?: Maybe<Scalars['MediumString']>,
  /** The name in Swedish */
  sv?: Maybe<Scalars['MediumString']>,
  /** The name in English */
  en?: Maybe<Scalars['MediumString']>,
};

/** Input type for importing private persons */
export type PrivateCustomerInput = {
  /** Social security number */
  ssn: Scalars['SSN'],
  /** First name of the person, such as the given name */
  firstName: Scalars['MediumString'],
  /** Last name of the person, such as the family name */
  lastName: Scalars['MediumString'],
  /** Personal email address of the person */
  emailAddress?: Maybe<Scalars['MediumString']>,
  /** Phone number of the person; if the value does not start with a plus sign, it is interpreted as a Finnish phone number */
  phoneNumber?: Maybe<Scalars['MediumString']>,
  /** 
 * Mobile phone number of the person; if the value does not start with a plus
   * sign, it is interpreted as a Finnish phone number
 */
  mobilePhoneNumber?: Maybe<Scalars['MediumString']>,
  /** Postal street address of the person */
  streetAddress?: Maybe<Scalars['MediumString']>,
  /** Postal code of the address */
  postalCode?: Maybe<Scalars['MediumString']>,
  /** Post office of the address */
  postOffice?: Maybe<Scalars['MediumString']>,
};

export enum ProcessingState {
  Unknown = 'UNKNOWN',
  InProgress = 'IN_PROGRESS',
  Failure = 'FAILURE',
  Done = 'DONE'
}

export type ProcessingStatus = {
   __typename?: 'ProcessingStatus',
  messageId: Scalars['ID'],
  importStatus: ProcessingState,
  importType?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['Date']>,
};

export type Query = {
   __typename?: 'Query',
  hello: Scalars['Boolean'],
  /** Get the status of an asynchronously processed message */
  processingStatus?: Maybe<Array<Maybe<ProcessingStatus>>>,
};


export type QueryProcessingStatusArgs = {
  messageIds: Array<Scalars['ID']>
};




