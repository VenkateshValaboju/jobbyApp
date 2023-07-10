const SimilarJobsSection = props => {
  const {eachItem} = props
  console.log(eachItem)
  return (
    <li>
      <img src={eachItem.companyLogoUrl} alt="similar job company logo" />
      <h1>{eachItem.title}</h1>
      <p>{eachItem.rating}</p>
      <h1>Description</h1>
      <p>{eachItem.jobDescription}</p>
      <p>{eachItem.location}</p>
      <p>{eachItem.employmentType}</p>
    </li>
  )
}

export default SimilarJobsSection
