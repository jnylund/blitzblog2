const Adult = (props) => {
  return (
    <div>
      <div>{props.content}</div>
    </div>
  )
}

const Person = (props) => {
  return (
    <div>
      <div> {props.content} </div>
      <div> {props.name} </div>
      <Adult {...props}></Adult>
    </div>
  )
}

const PersonList = () => {
  return (
    <Person content={"blah"} name={"joel"}>
      {" "}
    </Person>
  )
}

const name = {
  first: "Jeff",
  last: "Schuman",
}

const { first, last } = name

// render is kind of like yield
