"use strict"

let question,answer,count=1,score=0

let categories_url = "/categories.json"

let categories = []

let category = "sport_and_leisure"

let dropDown = document.querySelector(".dropdown-select")

let fetchQuestion = async (url) =>{
  let json = await( await fetch(url)).json()
  return json
}

let changeFocus = (now,next) =>{
  if(now.value.length){
    document.getElementById(next)?.focus()
  }
}

let init = async () =>{
  categories = await fetchQuestion(categories_url)
  
  Object.entries(categories).forEach(([key,value])=>{
    let option = createOption(key,value[0])
    dropDown.appendChild(option)
  })
  
  dropDown.value = category
  
  dropDown.addEventListener("change",(e)=>{
    category = dropDown.value
  })
  
  render()
}

let render = async () =>{
  question = (await fetchQuestion(`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=easy`))[0]
  clearCanvas()
  count = 1
  Draw(draws[0])
  answer = noWhite(question.correctAnswer.toUpperCase())
  let parent = document.querySelector(".letters")
  
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
  
  for(let i=0; i< answer.length ;i++){
    let input = createInput(i)
    document.querySelector(".letters").appendChild(input)
  }
  
  document.querySelector(".question").textContent = question.question
}


let hint = (len) =>{
  if(answer.length-currentAnswer().length <= 1) return false
  let random = Math.floor(Math.random()*answer.length)
  let elm = document.getElementById(random)
  elm.value = answer[random].toUpperCase()
  elm.dispatchEvent(new Event('keyup')); 

}

let noWhite = (string)=>{ 
  return string.replace(/\s/g, '');
} 

let createInput = (id) =>{
  let elm = document.createElement('input')
  elm.setAttribute("type","text")
  elm.setAttribute("autocomplete","off")
  elm.setAttribute("id",id)
  elm.setAttribute("maxlength",1)
  elm.setAttribute("onkeyup",`changeFocus(this,${id+1})`)
  elm.addEventListener("keyup", (e,h)=>{
    validate(e)
  })
  elm.classList.add("input")
  return elm
}

let createOption = (name,value) =>{
  let elm = document.createElement("option")
  elm.textContent = name
  elm.setAttribute("value",value)
  return elm
}

init()

// Logic of Game


let validate = (e) =>{
  let id = e.target.id 
  e.target.style.color = "#ffffff"
  if(e.target.value === "") return 
  if(e.target.value.toUpperCase() !== answer[id]){
    e.target.style.color = "#d22b2b"
    setTimeout(function() {
      Draw(draws[count])
      count++
      e.target.value = ""
      e.target.focus()
    }, 750);
  } else if(e.target.value.toUpperCase() === answer[id]){
    e.target.setAttribute("disabled",true)
  }
  
  if(currentAnswer() === answer){
    let children = document.querySelectorAll('.input')
    e.target.blur()
    children.forEach(e=>{
      e.classList.add("victory")
    })
    
    setTimeout(function() {
      score +=1
      document.querySelector('#score').textContent = ``
      document.querySelector('#score').textContent = `SCORE: ${score}`
      render()
    }, 1000);
    
  }
  if(count >= 8){
    freeze()
  }
}

let freeze = () =>{
  let inputs = document.querySelectorAll(".inputs")
  inputs.forEach(e=>{
    e.blur()
    e.setAttribute("disabled",true)
  })
  score = 0
  count = 0
  setTimeout(function() {
      document.querySelector('#score').textContent = ``
      document.querySelector('#score').textContent = `SCORE: ${score}`
      alert(`You Failed Answer was ${answer}`)
      clearCanvas()
      render()
    }, 500);
}

let currentAnswer = () =>{
  let children = document.querySelectorAll('.input')
  let ret = ""
  for(let i=0;i<children.length;i++){
    ret += children[i].value
  }
  return ret
}