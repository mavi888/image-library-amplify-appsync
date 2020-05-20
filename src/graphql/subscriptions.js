/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePicture = /* GraphQL */ `
  subscription OnCreatePicture($owner: String!) {
    onCreatePicture(owner: $owner) {
      id
      name
      owner
      labels
      file {
        bucket
        region
        key
      }
    }
  }
`;
export const onUpdatePicture = /* GraphQL */ `
  subscription OnUpdatePicture($owner: String!) {
    onUpdatePicture(owner: $owner) {
      id
      name
      owner
      labels
      file {
        bucket
        region
        key
      }
    }
  }
`;
export const onDeletePicture = /* GraphQL */ `
  subscription OnDeletePicture($owner: String!) {
    onDeletePicture(owner: $owner) {
      id
      name
      owner
      labels
      file {
        bucket
        region
        key
      }
    }
  }
`;
