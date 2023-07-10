import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createCourse, deleteCourse, getCourses, patchCourse } from '../api/courses-api'
import Auth from '../auth/Auth'
import { Course } from '../types/Course'

interface CoursesProps {
  auth: Auth
  history: History
}

interface CoursesState {
  courses: Course[]
  newCourseName: string
  loadingCourses: boolean
}

export class Courses extends React.PureComponent<CoursesProps, CoursesState> {
  state: CoursesState = {
    courses: [],
    newCourseName: '',
    loadingCourses: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCourseName: event.target.value })
  }

  onEditButtonClick = (courseId: string) => {
    this.props.history.push(`/courses/${courseId}/edit`)
  }

  onViewButtonClick = (courseId: string) => {
    this.props.history.push(`/courses/${courseId}`)
  }

  onCourseCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newCourse = await createCourse(this.props.auth.getIdToken(), {
        name: this.state.newCourseName,
        description: `Udacity course name: ${this.state.newCourseName}`,
        instructor:'Udacity Mentor',
        startDate: this.calculateStartDate(),
        endDate: this.calculateEndDate(),
        dueDate: this.calculateDueDate()
      })
      this.setState({
        courses: [...this.state.courses, newCourse],
        newCourseName: ''
      })
    } catch {
      alert('Course creation failed')
    }
  }

  onCourseDelete = async (courseId: string) => {
    try {
      await deleteCourse(this.props.auth.getIdToken(), courseId)
      this.setState({
        courses: this.state.courses.filter(course => course.courseId !== courseId)
      })
    } catch {
      alert('Course deletion failed')
    }
  }

  onCourseCheck = async (pos: number) => {
    try {
      const course = this.state.courses[pos]
      await patchCourse(this.props.auth.getIdToken(), course.courseId, {
        name: course.name,
        dueDate: course.dueDate,
        done: !course.done
      })
      this.setState({
        courses: update(this.state.courses, {
          [pos]: { done: { $set: !course.done } }
        })
      })
    } catch {
      alert('Course deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const courses = await getCourses(this.props.auth.getIdToken())
      this.setState({
        courses,
        loadingCourses: false
      })
    } catch (e) {
      alert(`Failed to fetch course: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Courses</Header>

        {this.renderCreateCourseInput()}

        {this.renderCourses()}
      </div>
    )
  }

  renderCreateCourseInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Course',
              onClick: this.onCourseCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Course name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCourses() {
    if (this.state.loadingCourses) {
      return this.renderLoading()
    }

    return this.renderCoursesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Courses
        </Loader>
      </Grid.Row>
    )
  }

  renderCoursesList() {
    return (
      <Grid padded>
        {this.state.courses.map((course, pos) => {
          return (
            <Grid.Row key={course.courseId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onCourseCheck(pos)}
                  checked={course.done}
                />
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {course.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {course.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="orange"
                  onClick={() => this.onViewButtonClick(course.courseId)}
                >
                  <Icon name="eye" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(course.courseId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCourseDelete(course.courseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {course.attachmentUrl && (
                <Image src={course.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  calculateStartDate(): string {
    const date = new Date()
    date.setDate(date.getDate())

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  calculateEndDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
