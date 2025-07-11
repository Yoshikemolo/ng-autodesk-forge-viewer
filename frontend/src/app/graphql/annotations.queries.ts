import { gql } from 'apollo-angular';

export const GET_ANNOTATIONS = gql`
  query GetAnnotations($modelId: String) {
    annotations(modelId: $modelId) {
      id
      type
      data
      position
      createdAt
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_ANNOTATION = gql`
  mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
    createAnnotation(createAnnotationInput: $createAnnotationInput) {
      id
      type
      data
      position
      createdAt
    }
  }
`;

export const UPDATE_ANNOTATION = gql`
  mutation UpdateAnnotation($updateAnnotationInput: UpdateAnnotationInput!) {
    updateAnnotation(updateAnnotationInput: $updateAnnotationInput) {
      id
      type
      data
      position
    }
  }
`;

export const DELETE_ANNOTATION = gql`
  mutation DeleteAnnotation($id: String!) {
    removeAnnotation(id: $id)
  }
`;
