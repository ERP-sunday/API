import * as admin from 'firebase-admin';
import * as firebaseAccount from './credentials.json'

const firebaseParams = {
  type: firebaseAccount.type,
  projectId: firebaseAccount.project_id,
  privateKeyId: firebaseAccount.private_key_id,
  privateKey: firebaseAccount.private_key,
  clientEmail: firebaseAccount.client_email,
  clientId: firebaseAccount.client_id, 
  authUri: firebaseAccount.auth_uri, 
  tokenUri: firebaseAccount.token_uri,
  authProviderX509CertUrl: firebaseAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseAccount.client_x509_cert_url
}

const firebase = admin.initializeApp({
  credential: admin.credential.cert(firebaseParams)
});

export default firebase;