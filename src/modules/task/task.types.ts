import { TaskPriority, TaskStatus } from "@prisma/client"

export interface CreateTaskData {
  title: string
  projectId: string
  createdById: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: Date | null
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: Date | null
}

type SortBy = "createdAt" | "dueDate" | "priority" | "title"
type SortOrder = "asc" | "desc"

export interface TaskListPaginationQuery {
  page: number
  limit: number
}

export interface TaskListPropertyQuery {
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  search?: string
}

export interface TaskListSortQuery {
  sortBy: SortBy
  sortOrder: SortOrder
}

export interface TaskListQuery extends TaskListPaginationQuery, TaskListPropertyQuery, TaskListSortQuery {}
