export interface CourseItem {
  userId: string
  courseId: string
  createdAt: string
  name: string
  description:string
  instructor:string
  startDate:string
  endDate:string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
