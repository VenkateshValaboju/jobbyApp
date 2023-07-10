import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'

import './index.css'
import Header from '../Header'

class Jobs extends Component {
  state = {
    employmentType: [],
    search: '',
    jobsList: [],
    minSalary: '',
    isLoading: true,
    jobsLoading: 'PENDING',
    profileDetails: [],
    profileLoading: 'PENDING',
  }

  componentDidMount() {
    this.getTheProfile()
    this.getTheJobsList()
  }

  getTheProfile = async () => {
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const body = await response.json()
      const profileDetails = {
        name: body.profile_details.name,
        profileImageUrl: body.profile_details.profile_image_url,
        shortBio: body.profile_details.short_bio,
      }

      this.setState({
        profileDetails,
        profileLoading: 'SUCCESS',
      })
    }
  }

  getTheJobsList = async () => {
    const token = Cookies.get('jwt_token')
    const {minSalary, search, employmentType} = this.state

    const TypeQuery = employmentType.join(',')

    const url = `https://apis.ccbp.in/jobs?employment_type=${TypeQuery}&minimum_package=${minSalary}&search=${search}`
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const body = await response.json()
      const {jobs} = body

      const jobsList = jobs.map(eachjob => ({
        companyLogoUrl: eachjob.company_logo_url,
        employmentType: eachjob.employment_type,
        id: eachjob.id,
        jobDescription: eachjob.job_description,
        location: eachjob.location,
        packagePerAnnum: eachjob.package_per_annum,
        rating: eachjob.rating,
        title: eachjob.title,
      }))

      this.setState({
        jobsList,
        jobsLoading: 'SUCCESS',
        isLoading: false,
      })
    } else {
      this.setState({
        jobsLoading: 'FAILED',
        isLoading: false,
      })
    }
  }

  changeMinSalary = event => {
    this.setState(
      {
        minSalary: event.target.value,
      },
      this.getTheJobsList,
    )
  }

  changeEmployment = event => {
    const type = event.target.value
    const {employmentType} = this.state
    if (employmentType.includes(type)) {
      const index = employmentType.indexOf(type)
      if (index > -1) {
        employmentType.splice(index, 1)
      }

      this.setState(
        {
          employmentType,
        },
        this.getTheJobsList,
      )
    } else {
      const editedTypeList = [...employmentType, type]
      this.setState(
        {
          employmentType: editedTypeList,
        },
        this.getTheJobsList,
      )
    }
  }

  changeSearchState = event => {
    const Input = document.getElementById('searchInput').value
    this.setState(
      {
        search: Input,
      },
      this.getTheJobsList,
    )
  }

  renderProductsList = () => {
    const {profileLoading, jobsList} = this.state

    switch (profileLoading) {
      case 'SUCCESS':
        return (
          <div>
            <ul>
              {jobsList.map(Item => (
                <JobItem Item={Item} key={Item.id} />
              ))}
            </ul>
          </div>
        )
      default:
        return (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oop! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={this.retryButton}>
              Retry
            </button>
          </div>
        )
    }
  }

  retryButton = () => {
    this.getTheJobsList()
  }

  displayProfile = () => {
    const {profileLoading, profileDetails} = this.state
    console.log(profileDetails)

    switch (profileLoading) {
      case 'SUCCESS':
        return (
          <div>
            <img src={profileDetails.profileImageUrl} alt="profile" />
            <h1>{profileDetails.name}</h1>
            <p>{profileDetails.shortBio}</p>
          </div>
        )
      default:
        return (
          <div>
            <button type="button" onClick={this.retryProfileButton}>
              Retry
            </button>
          </div>
        )
    }
  }

  retryProfileButton = () => {
    this.getTheProfile()
  }

  render() {
    const {
      jobsList,
      minSalary,
      employmentType,
      isLoading,
      jobsLoading,
      profileLoading,
    } = this.state

    return (
      <div>
        <ul>
          <Header />
        </ul>
        <div className="JobsBG">
          <div>
            <div>
              {profileLoading === 'PENDING' ? (
                <div className="loader-container" data-testid="loader">
                  <Loader
                    type="ThreeDots"
                    color="#ffffff"
                    height="50"
                    width="50"
                  />
                </div>
              ) : (
                this.displayProfile()
              )}
            </div>

            <hr />
            <form>
              <div>
                <h1>Type of Employment</h1>
                <input
                  type="checkbox"
                  id="fullTime"
                  name="fullTime"
                  value="FULLTIME"
                  onChange={this.changeEmployment}
                />
                <label htmlFor="fullTime"> Full Time</label>
                <br />
                <input
                  type="checkbox"
                  id="partTime"
                  name="partTime"
                  value="PARTTIME"
                  onChange={this.changeEmployment}
                />
                <label htmlFor="partTime"> Part Time</label>
                <br />
                <input
                  type="checkbox"
                  id="freelance"
                  name="freelance"
                  value="FREELANCE"
                  onChange={this.changeEmployment}
                />
                <label htmlFor="freelance">Freelance</label>
                <br />
                <input
                  type="checkbox"
                  id="Internship"
                  name="Internship"
                  value="INTERNSHIP"
                  onChange={this.changeEmployment}
                />
                <label htmlFor="Internship">Internship</label>
              </div>
              <div>
                <h1>Salary Range</h1>
                <input
                  type="radio"
                  id="10LPA"
                  name="LPA"
                  value="1000000"
                  onChange={this.changeMinSalary}
                />
                <label htmlFor="10LPA"> 10 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="20LPA"
                  name="LPA"
                  value="2000000"
                  onChange={this.changeMinSalary}
                />
                <label htmlFor="20LPA"> 20 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="30LPA"
                  name="LPA"
                  value="3000000"
                  onChange={this.changeMinSalary}
                />
                <label htmlFor="30LPA"> 30 LPA and above</label>
                <br />
                <input
                  type="radio"
                  id="40LPA"
                  name="LPA"
                  value="4000000"
                  onChange={this.changeMinSalary}
                />
                <label htmlFor="40LPA"> 40 LPA and above</label>
              </div>
            </form>
          </div>
          <div>
            <input type="search" placeholder="search" id="searchInput" />
            <button
              type="button"
              onClick={this.changeSearchState}
              data-testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>

            {isLoading ? (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            ) : (
              this.renderProductsList()
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
