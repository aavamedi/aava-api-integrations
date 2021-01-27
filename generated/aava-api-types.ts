/* tslint:disable */
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: string,
  MediumString: string,
  DepartmentCode: any,
  SSN: string,
  CostCenterCode: any,
  CostCenterName: any,
  DateTime: any,
  DepartmentName: any,
  Email: any,
  FinnishBusinessId: any,
  FinnishPhoneNumber: any,
  LongString: any,
  PageSize: any,
  ShortString: any,
  UUID: string,
};


export enum AbsenceApprovalType {
  Supervisor = 'Supervisor',
  Doctor = 'Doctor',
  Nurse = 'Nurse'
}

export type AbsenceInput = {
  externalId: Scalars['ID'],
  startDate: Scalars['Date'],
  endDate: Scalars['Date'],
  approvalType?: Maybe<AbsenceApprovalType>,
};

export type Address = {
   __typename?: 'Address',
  street?: Maybe<Scalars['MediumString']>,
  postalCode?: Maybe<Scalars['MediumString']>,
  postOffice?: Maybe<Scalars['MediumString']>,
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type CostCenterInput = {
  externalId: Scalars['ID'],
  names: NamesInput,
  code?: Maybe<Scalars['CostCenterCode']>,
};





export type DepartmentInput = {
  externalId: Scalars['ID'],
  names: NamesInput,
  code?: Maybe<Scalars['DepartmentCode']>,
};



export type EmployeeCostCenterInput = {
  externalId: Scalars['ID'],
  startDate: Scalars['Date'],
  endDate?: Maybe<Scalars['Date']>,
};

export type EmployeeDepartmentInput = {
  externalId: Scalars['ID'],
  startDate: Scalars['Date'],
  endDate?: Maybe<Scalars['Date']>,
};

export type EmployeeInput = {
  externalId: Scalars['ID'],
  identifier?: Maybe<Scalars['MediumString']>,
  ssn: Scalars['SSN'],
  callName: Scalars['MediumString'],
  lastName: Scalars['MediumString'],
  emailAddress?: Maybe<Scalars['MediumString']>,
  privateEmailAddress?: Maybe<Scalars['MediumString']>,
  jobTitle?: Maybe<Scalars['MediumString']>,
  localPhoneNumber?: Maybe<Scalars['MediumString']>,
  phoneCountryCode?: Maybe<Scalars['MediumString']>,
  startDate: Scalars['Date'],
  endDate?: Maybe<Scalars['Date']>,
  departments?: Maybe<Array<EmployeeDepartmentInput>>,
  supervisors?: Maybe<Array<EmployeeSupervisorInput>>,
  periodicHealthExaminationClinic?: Maybe<Scalars['MediumString']>,
  costCenters?: Maybe<Array<EmployeeCostCenterInput>>,
  language?: Maybe<Language>,
};

export type EmployeeSupervisorInput = {
  externalId: Scalars['ID'],
  startDate: Scalars['Date'],
  endDate?: Maybe<Scalars['Date']>,
};



export type ImportPushResponse = {
   __typename?: 'ImportPushResponse',
  messageId?: Maybe<Scalars['MediumString']>,
};

export enum Language {
  Fi = 'fi',
  Sv = 'sv',
  En = 'en'
}

export type LocalizedString = {
   __typename?: 'LocalizedString',
  fi?: Maybe<Scalars['String']>,
  sv?: Maybe<Scalars['String']>,
  en?: Maybe<Scalars['String']>,
};



export type Meta = {
   __typename?: 'Meta',
  lang?: Maybe<Language>,
};

export type Mutation = {
   __typename?: 'Mutation',
  _empty?: Maybe<Scalars['String']>,
  importDepartments: ImportPushResponse,
  importEmployees: ImportPushResponse,
  importAbsences: ImportPushResponse,
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

export type NamesInput = {
  fi?: Maybe<Scalars['MediumString']>,
  sv?: Maybe<Scalars['MediumString']>,
  en?: Maybe<Scalars['MediumString']>,
};


export type Pagination = {
  limit?: Maybe<Scalars['PageSize']>,
  offset?: Maybe<Scalars['Int']>,
};

export type PrivateCustomerInput = {
  ssn: Scalars['SSN'],
  firstName?: Maybe<Scalars['MediumString']>,
  lastName?: Maybe<Scalars['MediumString']>,
  emailAddress?: Maybe<Scalars['MediumString']>,
  phoneNumber?: Maybe<Scalars['MediumString']>,
  mobilePhoneNumber?: Maybe<Scalars['MediumString']>,
  streetAddress?: Maybe<Scalars['MediumString']>,
  postalCode?: Maybe<Scalars['MediumString']>,
  postOffice?: Maybe<Scalars['MediumString']>,
  allowsCommonRegistry?: Maybe<Scalars['Boolean']>,
  allowsViewingOccupationalInformation?: Maybe<Scalars['Boolean']>,
  allowsTreatmentInstructionsMail?: Maybe<Scalars['Boolean']>,
  allowsBookingSms?: Maybe<Scalars['Boolean']>,
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
};

export type Query = {
   __typename?: 'Query',
  hello: Scalars['Boolean'],
  processingStatusWithVerify?: Maybe<Array<Maybe<ProcessingStatus>>>,
};


export type QueryProcessingStatusWithVerifyArgs = {
  messageIds: Array<Scalars['ID']>,
  organizationExternalId: Scalars['ID']
};





