let addToy = false;
let toyCollection = document.querySelector("#toy-collection")
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', function(event){
        event.preventDefault()
        postToy(event.target)
        event.target.name.value = ""
        event.target.image.value = ""
        toyFormContainer.style.display = "none"
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  })
  fetchToys()
});
function fetchToys(){
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toy => {
    toy.forEach(toy => showToy(toy))
  })
}
function showToy(toyData){
  let toyDiv = document.createElement("div")
  toyDiv.setAttribute("class", "card")
  let toyHeader = document.createElement("h2")
  toyHeader.innerText = toyData.name
  let toyImg = document.createElement("img")
  toyImg.src = toyData.image
  toyImg.setAttribute("class", "toy-avatar")
  let toyP = document.createElement("p")
  toyP.innerText = toyData.likes
  let toyButton = document.createElement("button")
  toyButton.setAttribute('id', toyData.id)
  toyButton.addEventListener('click', function(event){
    const toyId = event.target.id
    let toyLikes = event.target.previousElementSibling.innerText
    let updatedLike = parseInt(toyLikes)
    ++updatedLike
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers:  { "Content-Type": "application/json" },
      body: JSON.stringify({
        likes: updatedLike
      })
    })
    toyP.innerText = updatedLike
  })
  toyButton.setAttribute("class", "like-btn")
  toyButton.innerText = "Like <3"
  toyDiv.append(toyHeader, toyImg, toyP, toyButton)
  toyCollection.append(toyDiv)
}
function postToy(toyData){
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: toyData.name.value,
      image: toyData.image.value,
      likes: 0
    })
  })
  .then(res => res.json())
  .then(toy => {
    let newToy = showToy(toy)
  })
}