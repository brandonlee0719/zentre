interface Contact {
  PersonActFlagID: string,
  ActFlagID: number,
  UserID: string,
  FirstName: string,
  LastName: string,
  ChineseName: string,
  HeadSculpture: string,
  Birthday: string,
  UserRoleBindingState: number,
  IsTrial: number,
  SchoolID: string,
  SchoolName: string,
  SchLevID: string,
  ClassID: string,
  ClassName: string,
  SubjectID: string,
  SubjectName: String,
  RoleBindingID: string,
  RoleID: string,
  RoleName: string,
  FlagFrom: string,
  InsertDate: string
}

interface UserInfo {
  RoleID: string
  RoleBindingID: string
  Whatsapp: string
  ReceivingSMSAlerts: string
  ReceivingEmailAlerts: string
  OtherDate: string
  SignatureMainApplicantDate: string
  OtherRace: string
  OtherCountry: string
  UserInfoID: string
  UserID: string
  FirstName: string
  LastName: string
  ChineseName: string
  Letter: string
  DmainName: string
  HeadSculpture: string
  INBC: string
  Birthday: string
  Sex: number
  Email: string
  Phone: string
  Tel: string
  Fax: string
  HouseNo: string
  FloorNo: string
  UnitNo: string
  BuildName: string
  Address: string
  ZipCode: string
  CountryID: string
  CountryName: string
  ProvinceID: string
  CityID: string
  MaritalID: string
  CountryBornID: string
  RaceID: string
  MapPath: string
  RegionPath: string
  Webhttp: string
  IDType: number
  TypeofPass: number
  DateofApp: string
  DateofExp: string
  PassPortNO: string
  HouseholdIcome: number
  HousingType: number
  HQualification: number
  HEducational: number
  WorkingStatus: number
  EmployerName: string
  EmAddress: string
  OfficeTel: string
  WorkPMTH: string
  Occupation: number
  MonthlyIncome: number
  ChildQualification: number
  Designation: number
  Experience: string
  Achievements: string
  SelfAppraisal: string
  InsertDate: string
  BirthOrder: string
  Religion: number
  ProgramState: string
  SiblingsNo: string
  CentreCode: string
  ProgramText: string
  Statetype: string
  RegistrationNo: string
  EnrolmentDate: string
  UserRelationship: string
  OtherRelationship: string
  CreateID: string
  TuserID: string
}

interface Gender {
  name: string
  id: string
}
interface FeedType {

  name: string

  id: string

}

interface Relationship {
  name: string
  id: string
}

interface Country {
  name: string
  id: string
}

interface Nationality {
  name: string
  id: string
}

interface AddressType {
  name: string
  id: string
}

interface CountryOfAddress {
  name: string
  id: string
}

interface Province {
  name: string
  id: string
}

interface City {
  name: string
  id: string
}

interface Relation {
  RelationshipID: string
  IUserID: string
  UserRelationship: string
  OtherRelationship: string
  TUserID: string
  InsertDate: string
  UserID: string
  FirstName: string
  LastName: string
  ChineseName: string
  HeadSculpture: string
  Birthday: string
  Email: string
  Phone: string
}

interface UserAddress {
  CreateID: string
  ContactID: string
  UserID: string
  ContactType: string
  HouseNo: string
  FloorNo: string
  UnitNo: string
  BuildName: string
  Address: string
  ConatctCountry: string
  ContactProvince: string
  ContactCity: string
  ZipCode: string
  IsDefault: number
  IsDelete: number,
  InsertDate: string
}

interface Level {
  ActFlagID: number,
  CreateID: string,
  InOnlineRegistration: string,
  InsertDate: string,
  IsPublic: number,
  OrderBy: number,
  SchLevID: string,
  SchoolLevelID: string,
  SchoolLevelName: string,
  SchoolName: string,
  UserID: string,
}

interface Group {
  ClassEndDate: string,
  ClassID: string,
  ClassLogo: string,
  ClassMemberNum: number,
  ClassMemberRoleBindingID: string,
  ClassMemberType: number,
  ClassName: string,
  ClassStartDate: string,
  ClassTeacherRoleBindingID: string,
  CommencementDate: string,
  CreateID: string,
  EnrolmentReached: string,
  InsertDate: string,
  MaxMemberNum: number,
  RoleBindingID: string,
  SchLevID: string,
  SchoolID: string,
  SchoolLevelID: string,
  SchoolLevelName: string,
  SchoolName: string,
  SubClassRoleBindingID: string,
  SystemID: string,
  UpdateDate: string,
  UserRoleBindingID: string,
  UserRoleBindingState: number,
  V3MemberNum: number,
  V3TeacherNum: number,
}

interface Tags {
  name: string
  id: string
}