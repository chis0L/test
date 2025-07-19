import { gql } from '@apollo/client';

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      employee {
        id
        firstName
        lastName
        middleName
        position
        phone
        email
        status
        avatar
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      employee {
        id
        firstName
        lastName
        middleName
        position
        phone
        email
        status
        avatar
      }
    }
  }
`; 