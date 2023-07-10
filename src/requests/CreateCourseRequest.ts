/**
 * Fields in a request to create a single item.
 */
export interface CreateCourseRequest {
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
}
