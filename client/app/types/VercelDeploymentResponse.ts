interface VercelDeploymentResponse {
  url: string;
  id: string;
  name: string;
  meta: {
    githubCommitAuthorName?: string;
    githubCommitMessage?: string;
    githubCommitOrg?: string;
    githubCommitRef?: string;
    githubCommitRepo?: string;
    githubCommitSha?: string;
    githubDeployment?: string;
    githubOrg?: string;
    githubRepo?: string;
    githubCommitRepoId?: string;
    githubRepoId?: string;
    githubCommitAuthorLogin?: string;
  };
  target?: string;
  alias?: string[];
  projectId?: string;
  projectName?: string;
  teamId?: string;
  createdAt: number;
  buildingAt: number;
  ready: number;
  readyState:
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "QUEUED"
    | "READY"
    | "CANCELED";
  state:
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "QUEUED"
    | "READY"
    | "CANCELED";
  type: "LAMBDAS";
  creator: {
    uid: string;
    email: string;
    username: string;
  };
}
