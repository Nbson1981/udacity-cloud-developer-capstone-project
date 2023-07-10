import React from 'react'
import { Card, Icon, Image, Grid } from 'semantic-ui-react'
import { getCourse } from '../api/courses-api'
import { Course } from '../types/Course'
import Auth from '../auth/Auth'

interface ViewCourseState {
    course: Course
  }

  interface ViewCourseProps {
    match: {
      params: {
        courseId: string
      }
    }
    auth: Auth
  }
  
  

export class ViewCourse extends React.PureComponent <ViewCourseProps, ViewCourseState> 
{
    state: ViewCourseState = {
        course: {
          courseId: '',
          createdAt: '',
          name: '',
          description: '',
          instructor: '',
          startDate: '',
          endDate: '',
          dueDate: '',
          done: false
        },
      }

      async componentDidMount() {
        try {
          const course = await getCourse(this.props.auth.getIdToken(), this.props.match.params.courseId)
          this.setState({
            course: course,
          })
        } catch (e) {
          alert(`Failed to fetch course: ${(e as Error).message}`)
        }
      }
    
    render() {
        return (
        <Card fluid centered >
            <Image src={this.state.course.attachmentUrl} wrapped ui={false} />
            <Card.Content>
            <Card.Header> Course Name: {this.state.course.name}</Card.Header>
            <Card.Meta>
                <span className='date'>The course starts on {this.state.course.startDate} and will be end on {this.state.course.endDate}</span>
            </Card.Meta>
            <Card.Meta>
                <span>Instructed by {this.state.course.instructor}</span>
            </Card.Meta>
            <Card.Meta>
                <span className='date'>Due on {this.state.course.dueDate}</span>
            </Card.Meta>
            <Card.Description>
                {this.state.course.description}
            </Card.Description>
            </Card.Content>

        </Card>
        )
    }
}

