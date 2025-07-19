const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar DateTime

  enum EmployeeStatus {
    ACTIVE
    VACATION
    SICK
    FIRED
  }

  enum ScheduleStatus {
    WORK
    WEEKEND
    VACATION
    SICK
    ABSENT
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    middleName: String
    birthDate: DateTime
    avatar: String
    position: String!
    department: String
    hireDate: DateTime!
    salary: Float
    status: EmployeeStatus!
    phone: String!
    email: String
    telegram: String
    whatsapp: String
    emergencyContact: String
    emergencyPhone: String
    createdAt: DateTime!
    updatedAt: DateTime!
    scheduleRecords: [EmployeeSchedule!]!
    organizationId: String!
  }

  type EmployeeSchedule {
    id: ID!
    date: DateTime!
    status: ScheduleStatus!
    hoursWorked: Float
    notes: String
    employeeId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Organization {
    id: ID!
    name: String!
    employees: [Employee!]!
  }

  type EmployeeStats {
    total: Int!
    byStatus: [StatusCount!]!
    avgAge: Float
    avgSalary: Float
    hireByMonth: [HireStat!]!
    topPositions: [PositionStat!]!
    attendance: [AttendanceStat!]!
  }

  type StatusCount {
    status: EmployeeStatus!
    count: Int!
  }

  type HireStat {
    month: String!
    count: Int!
  }

  type PositionStat {
    position: String!
    count: Int!
  }

  type AttendanceStat {
    date: String!
    present: Int!
    absent: Int!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
    employeeSchedule(
      employeeId: ID!
      year: Int!
      month: Int!
    ): [EmployeeSchedule!]!
    employeeStats: EmployeeStats!
  }

  input CreateEmployeeInput {
    firstName: String!
    lastName: String!
    middleName: String
    birthDate: DateTime
    avatar: String
    passportPhoto: String
    passportSeries: String
    passportNumber: String
    passportIssued: String
    passportDate: DateTime
    address: String
    position: String!
    department: String
    hireDate: DateTime!
    salary: Float
    status: EmployeeStatus
    phone: String!
    email: String
    telegram: String
    whatsapp: String
    emergencyContact: String
    emergencyPhone: String
    organizationId: String!
  }

  input UpdateEmployeeInput {
    firstName: String
    lastName: String
    middleName: String
    birthDate: DateTime
    avatar: String
    passportPhoto: String
    passportSeries: String
    passportNumber: String
    passportIssued: String
    passportDate: DateTime
    address: String
    position: String
    department: String
    hireDate: DateTime
    salary: Float
    status: EmployeeStatus
    phone: String
    email: String
    telegram: String
    whatsapp: String
    emergencyContact: String
    emergencyPhone: String
    organizationId: String
  }

  input UpdateScheduleInput {
    employeeId: String!
    date: DateTime!
    status: ScheduleStatus!
    hoursWorked: Float
    notes: String
  }

  type CreateEmployeeResponse {
    employee: Employee!
  }

  type UpdateEmployeeResponse {
    employee: Employee!
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): CreateEmployeeResponse!
    updateEmployee(
      id: ID!
      input: UpdateEmployeeInput!
    ): UpdateEmployeeResponse!
    deleteEmployee(id: ID!): Boolean!
    updateEmployeeSchedule(input: UpdateScheduleInput!): Boolean!
  }
`;

module.exports = { typeDefs };
