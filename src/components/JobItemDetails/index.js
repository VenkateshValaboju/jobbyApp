import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SkillsSection from '../SkillsSection'
import SimilarJobsSection from '../SimilarJobsSection'

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobs: [],
    skills: [],
    LACimageUrl: '',
    LACdescription: '',
    isLoading: true,
    results: 'PENDING',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${token}`},
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const responseJobDetails = data.job_details
      const responseSimilarJobs = data.similar_jobs
      const jobDetails = {
        companyLogoUrl: responseJobDetails.company_logo_url,
        companyWebsiteUrl: responseJobDetails.company_website_url,
        employmentType: responseJobDetails.employment_type,
        id: responseJobDetails.id,
        jobDescription: responseJobDetails.job_description,
        lifeAtCompany: responseJobDetails.life_at_company,
        location: responseJobDetails.location,
        packagePerAnnum: responseJobDetails.package_per_annum,
        rating: responseJobDetails.rating,
        skills: responseJobDetails.skills,
        title: responseJobDetails.title,
      }
      const similarJobs = responseSimilarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      const {lifeAtCompany} = jobDetails
      const camelLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      this.setState({
        similarJobs,
        jobDetails,
        skills: jobDetails.skills,
        LACimageUrl: camelLifeAtCompany.imageUrl,
        LACdescription: camelLifeAtCompany.description,
        isLoading: false,
        results: 'SUCCESS',
      })
    } else {
      this.setState({
        results: 'FAILURE',
      })
    }
  }

  retryDetails = () => {
    this.getJobDetails()
  }

  getTheDetails = () => {
    const {skills, LACimageUrl, LACdescription, isLoading, results} = this.state
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    switch (results) {
      case 'SUCCESS':
        return (
          <div>
            <div>
              <img src={companyLogoUrl} alt="job details company logo" />
              <h1>{title}</h1>
              <p>{rating}</p>
              <p>{location}</p>
              <p>{employmentType}</p>
              <p>{packagePerAnnum}</p>
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>Visit</a>
              <p>{jobDescription}</p>
              <h1>Skills</h1>
              <ul>
                {skills.map(eachItem => (
                  <SkillsSection eachItem={eachItem} key={eachItem.name} />
                ))}
              </ul>
              <h1>Life at Company</h1>
              <div>
                <p>{LACdescription}</p>
                <img src={LACimageUrl} alt="life at company" />
              </div>
            </div>
            )<h1>Similar Jobs</h1>
            <ul>
              {similarJobs.map(eachItem => (
                <SimilarJobsSection eachItem={eachItem} key={eachItem.id} />
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
            <button type="button" onClick={this.retryDetails}>
              Retry
            </button>
          </div>
        )
    }
  }

  render() {
    const {skills, LACimageUrl, LACdescription, isLoading} = this.state

    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div>
        <ul>
          <Header />
        </ul>

        <div>
          {isLoading ? (
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          ) : (
            this.getTheDetails()
          )}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
