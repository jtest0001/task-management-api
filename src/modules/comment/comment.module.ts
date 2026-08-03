import { prisma } from "../../common/database/prisma"
import { TaskRepository } from "../task/task.repository"
import { CommentController } from "./comment.controller"
import { CommentRepository } from "./comment.repository"
import { createCommentRoutes } from "./comment.routes"
import { CommentService } from "./comment.service"

const commentRepository = new CommentRepository(prisma)
const taskRepository = new TaskRepository(prisma)
const commentService = new CommentService(commentRepository, taskRepository)
const commentController = new CommentController(commentService)

export const commentRouter = createCommentRoutes(commentController)
