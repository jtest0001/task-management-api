type Role = "ADMIN" | "OWNER" | "MEMBER"
export interface CreateProjectMemberData {
  projectId: string
  role: Role
  userId: string
}
