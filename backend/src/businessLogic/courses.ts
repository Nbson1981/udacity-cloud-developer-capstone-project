import { CoursesAccess } from '../dataLayer/coursesAccess'
import { ImageUtils } from '../helpers/imageUtils';
import { CourseItem } from '../models/CourseItem'
import { CreateCourseRequest } from '../requests/CreateCourseRequest'
import { UpdateCourseRequest } from '../requests/UpdateCourseRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { CourseUpdate } from '../models/CourseUpdate';

const logger = createLogger('CourseAccess')
const imageUtils = new ImageUtils()
const courseAccess = new CoursesAccess()

//Get logic function
export async function getCoursesForUser(userId: string): Promise<CourseItem[]> {
    logger.info('Calling getCourses function')
    return courseAccess.getAllCourses(userId)
}

export async function getCourseForUser(userId: string, courseId: string): Promise<CourseItem> {
    logger.info('Calling getCourses function')
    return courseAccess.getCourse(userId, courseId)
}

//Create logic function
export async function createCourse(
    newCourse: CreateCourseRequest,
    userId: string
): Promise<CourseItem> {
    logger.info('Calling create function')

    const courseId = uuid.v4()
    const createdAt = new Date().toISOString()
    
    const newItem = {
        userId,
        courseId,
        createdAt,
        done: true,
        attachmentUrl: '',
        ...newCourse
    }
return await courseAccess.createCourseItem(newItem)
}

//Update logic function
export async function updateCourse(     
    courseId: string,
    courseUpdate: UpdateCourseRequest,
    userId: string
    ): Promise<CourseUpdate> {
    logger.info('Calling update function')
    return courseAccess.updateCourseItem(courseId, userId, courseUpdate)           
    }

//Delete logic function
export async function deleteCourse(
    courseId: string,
    userId: string
    ): Promise<string> {
    logger.info('Calling delete function')
    return courseAccess.deleteCourseItem(courseId, userId)
    }

//Create attachment function logic
export async function createImagePresignedUrl(
    courseId: string,
    userId: string    
    ): Promise<string> {
    logger.info('Calling create image function by user', userId, courseId)
    const s3AttachmentUrl = imageUtils.getAttachmentUrl(courseId)
    await courseAccess.updateAttachmentUrl(courseId, userId, s3AttachmentUrl)
    return imageUtils.getUploadUrl(courseId)    
}