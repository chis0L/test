import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
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
`; 