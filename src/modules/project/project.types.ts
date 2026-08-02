export interface CreateProjectData {
  name: string
  description?: string
  ownerId: string
}

type Role = "ADMIN" | "OWNER" | "MEMBER"
export interface CreateProjectMemberData {
  projectId: string
  role: Role
  userId: string
}

export interface UpdateProjectData {
  name: string
  description?: string
}
