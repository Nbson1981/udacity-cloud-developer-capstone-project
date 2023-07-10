/**
 * Fields in a request to update a single item.
 */
export interface UpdateCourseRequest {
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