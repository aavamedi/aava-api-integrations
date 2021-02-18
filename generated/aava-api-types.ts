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
  /** Non-empty String with less or equal than 1024 characters */
  MediumString: string,
  /** Non-empty String with less or equal than 6 characters */
  DepartmentCode: any,
  /** Finnish social security number */
  SSN: string,
  /** Non-empty String with less or equal than 10 characters */
  CostCenterCode: any,
  /** Non-empty String with less or equal than 30 characters */
  CostCenterName: any,
  /** Date and time in ISO 8601 format */
  DateTime: any,
  /** Non-empty String with less or equal than 30 characters */
  DepartmentName: any,
  /** Email address */
  Email: any,
  /** Finnish business id, 'y-tunnus' */
  FinnishBusinessId: any,
  /** Finnish phone number */
  FinnishPhoneNumber: any,
  LongString: any,
  /** Query page size with a reasonable max value */
  PageSize: any,
  /** Non-empty String with less or equal than 42 characters */
  ShortString: any,
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
  /** End date of the absence (required to be startDate or later) */
  endDate: Scalars['Date'],
  /** Type of absence approval */
  approvalType?: Maybe<AbsenceApprovalType>,
};

/** Address */
export type Address = {
   __typename?: 'Address',
  /** Street address, eg. Vanha valtatie 198 */
  street?: Maybe<Scalars['MediumString']>,
  /** Postal code, eg. 04500 */
  postalCode?: Maybe<Scalars['MediumString']>,
  /** Post office, eg. Kellokoski */
  postOffice?: Maybe<Scalars['MediumString']>,
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


/** Input type for importing cost centers. */
export type CostCenterInput = {
  /** Identifier of the cost center */
  externalId: Scalars['ID'],
  /** Localized names of the cost center */
  names: NamesInput,
  /** Cost center code - Needed if data is integrated to Health Information System */
  code?: Maybe<Scalars['CostCenterCode']>,
};





/** Input type for importing departments. */
export type DepartmentInput = {
  /** Identifier of the department */
  externalId: Scalars['ID'],
  /** Localized names of the department */
  names: NamesInput,
  /** Department Code. This code is needed if data is integrated to Health Information System */
  code?: Maybe<Scalars['DepartmentCode']>,
};



export type EmployeeCostCenterInput = {
  /** Identifier of the cost center the employee has been attached to */
  externalId: Scalars['ID'],
  /** Start date of being attached to the cost center */
  startDate: Scalars['Date'],
  /** End date of being attached to the cost center, if any */
  endDate?: Maybe<Scalars['Date']>,
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
  /** Job title */
  jobTitle?: Maybe<Scalars['MediumString']>,
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
  /** Periodic health examination clinic code */
  periodicHealthExaminationClinic?: Maybe<Scalars['MediumString']>,
  /** Cost centers the employee has been attached to */
  costCenters?: Maybe<Array<EmployeeCostCenterInput>>,
  /** Language */
  language?: Maybe<Language>,
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

export enum InternalOrganization {
  Aava = 'aava',
  Pikkujatti = 'pikkujatti'
}

export enum Language {
  Fi = 'fi',
  Sv = 'sv',
  En = 'en'
}

/** Localized string */
export type LocalizedString = {
   __typename?: 'LocalizedString',
  /** Finnish */
  fi?: Maybe<Scalars['String']>,
  /** Swedish */
  sv?: Maybe<Scalars['String']>,
  /** English */
  en?: Maybe<Scalars['String']>,
};



/** Meta data to be used in resolvers */
export type Meta = {
   __typename?: 'Meta',
  lang?: Maybe<Language>,
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
  /** Import cost centers to the Aava-HR application */
  importCostCenters: ImportPushResponse,
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


export type MutationImportCostCentersArgs = {
  organizationExternalId: Scalars['ID'],
  costCenters: Array<CostCenterInput>
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


export type Pagination = {
  /** Number of items to fetch */
  limit?: Maybe<Scalars['PageSize']>,
  /** Number of items to skip */
  offset?: Maybe<Scalars['Int']>,
};

/** Input type for importing private persons */
export type PrivateCustomerInput = {
  /** Social security number */
  ssn: Scalars['SSN'],
  /** First name of the person, such as the given name */
  firstName?: Maybe<Scalars['MediumString']>,
  /** Last name of the person, such as the family name */
  lastName?: Maybe<Scalars['MediumString']>,
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
  /** Allows use of centralized medical records registry */
  allowsCommonRegistry?: Maybe<Scalars['Boolean']>,
  /** Allows use of occupational healthcare records in private care */
  allowsViewingOccupationalInformation?: Maybe<Scalars['Boolean']>,
  /** Allows sending of treatment instructions via mail */
  allowsTreatmentInstructionsMail?: Maybe<Scalars['Boolean']>,
  /** Allows sending of booking reminders via SMS */
  allowsBookingSms?: Maybe<Scalars['Boolean']>,
  /** Allows sending of marketing email */
  allowsMarketingMail?: Maybe<Scalars['Boolean']>,
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
  error?: Maybe<Scalars['String']>,
  organizationExternalId?: Maybe<Scalars['ID']>,
  timestamp?: Maybe<Scalars['Date']>,
  warnings?: Maybe<Array<ProcessingWarning>>,
};

export type ProcessingWarning = {
   __typename?: 'ProcessingWarning',
  warning: Scalars['String'],
  externalId?: Maybe<Scalars['String']>,
};

export type Query = {
   __typename?: 'Query',
  hello: Scalars['Boolean'],
  /** Get the status of an asynchronously processed message and verify organization */
  processingStatusWithVerify?: Maybe<Array<Maybe<ProcessingStatus>>>,
};


export type QueryProcessingStatusWithVerifyArgs = {
  messageIds: Array<Scalars['ID']>,
  organizationExternalId: Scalars['ID']
};

export enum QueryResult {
  Success = 'success',
  Failure = 'failure'
}





