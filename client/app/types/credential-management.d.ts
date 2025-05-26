interface PasswordCredentialData {
  id: string;
  name?: string;
  password: string;
  iconURL?: string;
}

interface PasswordCredential extends Credential {
  readonly type: "password";
  id: string;
  name?: string;
  password: string;
  iconURL?: string;
}

interface CredentialCreationOptions {
  password?: PasswordCredentialData;
}

interface CredentialRequestOptions {
  password?: boolean;
}

interface CredentialsContainer {
  get(options?: CredentialRequestOptions): Promise<Credential | null>;
  store(credential: Credential): Promise<Credential>;
  preventSilentAccess(): Promise<void>;
  create(options?: CredentialCreationOptions): Promise<Credential | null>;
}

interface Navigator {
  readonly credentials: CredentialsContainer;
}

declare const PasswordCredential: {
  prototype: PasswordCredential;
  new (data: PasswordCredentialData): PasswordCredential;
};
