import axios from 'axios'

// PaperMC API Types
export type Project = string
export type Version = string
export type Build = number
export type Family = string

export type Channel = 'default' | 'experimental'

export type Change = {
  commit: string
  summary: string
  message: string
}

export type Download = {
  name: string
  sha256: string
}

export type VersionBuild = {
  build: Build
  time: string
  channel: Channel
  promoted: boolean
  changes: Change[]
  downloads: Record<'application' & string, Download>
}

export type VersionFamilyBuild = {
  version: Version
  build: Build
  time: string
  channel: Channel
  promoted: boolean
  changes: Change[]
  downloads: Record<'application' & string, Download>
}

// Requests Response Types
export interface ProjectsResponse {
  projects: Project[]
}

export interface ProjectResponse {
  project_id: Project
  project_name: string
  version_groups: string[]
  versions: Version[]
}

export interface VersionResponse {
  project_id: Project
  project_name: string
  version: Version
  builds: Build[]
}

export interface BuildsResponse {
  project_id: Project
  project_name: string
  version: Version
  builds: VersionBuild[]
}

export interface BuildResponse {
  project_id: Project
  project_name: string
  version: Version
  build: Build
  time: string
  channel: Channel
  promoted: boolean
  changes: Change[]
  downloads: Record<'application' & string, Download>
}

export interface VersionFamilyResponse {
  project_id: Project
  project_name: string
  version_group: Family
  versions: Version[]
}

export interface VersionFamilyBuildsResponse {
  project_id: Project
  project_name: string
  version_group: Family
  versions: Version[]
  builds: VersionFamilyBuild[]
}

export const paperAPIInstance = axios.create({
  baseURL: 'https://api.papermc.io/v2',
})

export class PaperMC {
  /**
   * Get PaperMC's Projects List
   * @description Get a list of all PaperMC projects
   * @returns The list of projects
   */
  public static async getProjects(): Promise<ProjectsResponse> {
    const { data } = await paperAPIInstance.get<ProjectsResponse>('/projects')
    return data
  }

  /**
   * Get a Project's Info
   * @description Get information about a specific project
   * @param project The project to get information about
   * @returns The project's information
   */
  public static async getProject(project: Project): Promise<ProjectResponse> {
    const { data } = await paperAPIInstance.get<ProjectResponse>(`/projects/${project}`)
    return data
  }

  /**
   * Get a Project's Version Info
   * @description Get information about a specific project's version
   * @param project The project to get information about
   * @param version The version to get information about
   * @returns The project version information
   */
  public static async getVersion(project: Project, version: Version): Promise<VersionResponse> {
    const { data } = await paperAPIInstance.get<VersionResponse>(`/projects/${project}/versions/${version}`)
    return data
  }

  /**
   * Get a Project's Version Builds List
   * @description Get a list of all builds for a specific project's version
   * @param project The project to get builds for
   * @param version The version to get builds for
   * @returns The list of builds for the version
   */
  public static async getBuilds(project: Project, version: Version): Promise<BuildsResponse> {
    const { data } = await paperAPIInstance.get<BuildsResponse>(`/projects/${project}/versions/${version}/builds`)
    return data
  }

  /**
   * Get a Project's Version Build Info
   * @description Get information about a specific project's version's build
   * @param project The project to get information about
   * @param version The version to get information about
   * @param build The build to get information about
   * @returns The project version build information
   */
  public static async getBuild(project: Project, version: Version, build: Build): Promise<BuildResponse> {
    const { data } = await paperAPIInstance.get<BuildResponse>(`/projects/${project}/versions/${version}/builds/${build}`)
    return data
  }

  /**
   * Get a Project Version Build Download Link
   * @description Get a download link for a specific project's version's build
   * @param project The project id
   * @param version The version to download
   * @param build The build to download
   * @returns The download link for the build
   */
  public static getDownloadURL(project: Project, version: Version, build: Build): string {
    return `${paperAPIInstance.getUri()}/projects/${project}/versions/${version}/builds/${build}/downloads/${project}-${version}-${build}.jar`
  }

  /**
   * Get a Project's Version Family Info
   * @description Get information about a specific project's version family
   * @param project The project to get information about
   * @param family The version group family to get information about
   * @returns The project version family information
   */
  public static async getVersionFamily(project: Project, family: Family): Promise<VersionFamilyResponse> {
    const { data } = await paperAPIInstance.get<VersionFamilyResponse>(`/projects/${project}/version_group/${family}`)
    return data
  }

  /**
   * Get a Project's Version Family Builds List
   * @description Get a list of all builds for a specific project's version family
   * @param project The project to get builds for
   * @param family The version group family to get builds for
   * @returns The list of builds for the version family
   */
  public static async getVersionFamilyBuilds(project: Project, family: Family): Promise<VersionFamilyBuildsResponse> {
    const { data } = await paperAPIInstance.get<VersionFamilyBuildsResponse>(`/projects/${project}/version_group/${family}/builds`)
    return data
  }

  /**
   * Get Latest Build for a Project Version
   * @description Get the latest build for a specific project's version
   * @param project The project to get the latest build
   * @returns The latest project build download link
   */
  public static async getLatestVersionDownloadURL(project: Project): Promise<string> {
    const { versions } = await PaperMC.getProject(project)
    const { builds } = await PaperMC.getBuilds(project, versions[versions.length - 1])
    return PaperMC.getDownloadURL(project, versions[versions.length - 1], builds[builds.length - 1].build)
  }
}