const SkillsSection = props => {
  const {eachItem} = props

  const Item = {
    name: eachItem.name,
    ImageUrl: eachItem.image_url,
  }

  return (
    <li>
      <div>
        <img src={Item.ImageUrl} alt={Item.name} />
        <p>{Item.name}</p>
      </div>
    </li>
  )
}
export default SkillsSection
