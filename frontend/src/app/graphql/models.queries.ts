import { gql } from 'apollo-angular';

export const GET_MODELS = gql`
  query GetModels {
    models {
      id
      name
      urn
      status
      createdAt
      updatedAt
      user {
        id
        email
      }
    }
  }
`;

export const GET_MODEL = gql`
  query GetModel($id: String!) {
    model(id: $id) {
      id
      name
      urn
      objectId
      status
      metadata
      createdAt
      updatedAt
      user {
        id
        email
      }
      annotations {
        id
        type
        data
        position
        createdAt
      }
    }
  }
`;

export const CREATE_MODEL = gql`
  mutation CreateModel($createModelInput: CreateModelInput!) {
    createModel(createModelInput: $createModelInput) {
      id
      name
      urn
      status
    }
  }
`;

export const UPDATE_MODEL = gql`
  mutation UpdateModel($updateModelInput: UpdateModelInput!) {
    updateModel(updateModelInput: $updateModelInput) {
      id
      name
      status
    }
  }
`;

export const DELETE_MODEL = gql`
  mutation DeleteModel($id: String!) {
    removeModel(id: $id)
  }
`;
