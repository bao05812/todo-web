const getTodosFromLocal = () => {
    const todosLocal = localStorage.getItem("todos")
    return todosLocal ? JSON.parse(todosLocal) : []
}

const setTodosToLocal = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
}

const todos = getTodosFromLocal()

let selectTodo = null
let activeTab = 0
const listEle = document.querySelector(".todo-list")
const inputEle = document.querySelector(".todo-input")
const formEle = document.querySelector("form")
const allEle = document.querySelector(".filter-all")
const inprogressEle = document.querySelector(".filter-in-progress")
const completedEle = document.querySelector(".filter-completed")
const btnClearEle = document.querySelector(".btn-clear")
const actionEle = document.querySelectorAll(".actions li")

const renderActionBtn = () =>{
    const activeEle = [...actionEle].find(ele => ele.classList.contains("active"))
    const text = activeEle.textContent
    if (text === "In Progress"){
        renderInProGressTodos()
        activeTab = 1
        return
    }
    if (text === "Completed"){
        renderCompletedTodos()
        activeTab = 2
        return
    }
    renderTodoList(todos)
}



const renderTodoList = (todos) => {
    let liHtml = ''
    todos.forEach( todo => {
        liHtml += `
        <li>
        <input onclick="handleTodoStatus(${todo.id})" id="${todo.id}" type="checkbox" ${todo.isDone ? "checked" : ""}>
        <label class="${todo.isDone ? "done" : ""}" for="${todo.id}"> ${todo.content}</label>
        <div onclick="handleClickDots(${todo.id})" class="dots">
            <span></span>
            <span></span>
            <span></span>
            <ul class="dropdown">
                <li onclick="handleEditTodo(${todo.id})" class="btnEdit">Edit</li>
                <li onclick="handleDeleteTodo(${todo.id})" class="btnDelete">Delete</li>
            </ul>
        </div>
            
        </li>
        `
    })
    listEle.innerHTML = liHtml
}
 renderTodoList(todos)
 ///xoa class active
 const removeActiveClass = () => {
    actionEle.forEach(val => val.classList.remove("active"))
}

 formEle.addEventListener("submit", function(e){
    e.preventDefault()
    const inputvalue  = inputEle.value
    if(!inputvalue){
        alert("input is empty")
        return
    }
    if (selectTodo){
        const idx = todos.findIndex(val => val.id === selectTodo.id)
        todos[idx] = {
            ...selectTodo,
            content: inputvalue
        }
        selectTodo = null
        setTodosToLocal()
    } else {
        todos.push({
        id: new Date().getTime(),
        content: inputvalue,
        isDone: false
        })
        setTodosToLocal()
    }
    
    inputEle.value = "" //reset input
    renderActionBtn()
 })

 const handleTodoStatus = (id) => {
    const idx = todos.findIndex(val => val.id === id)
    todos[idx].isDone = !todos[idx].isDone
    renderActionBtn()
    setTodosToLocal()
 }
 const handleDeleteTodo = (id) =>{
    const idx = todos.findIndex(val => val.id === id)
    todos.splice(idx,1)
    if(activeTab === 0){
        renderAllTodos()
        setTodosToLocal()
        return
    }
    else if(activeTab === 1){
        renderInProGressTodos()
        setTodosToLocal()
        return
    }
    else if(activeTab === 2){
        renderCompletedTodos()
        setTodosToLocal()
        return
    }

}

const handleEditTodo = (id) => {
    const idx = todos.findIndex(val => val.id === id)
    // console.log(idx)
    selectTodo = todos[idx]
    inputEle.value = selectTodo.content
}
const renderAllTodos = () => {
    removeActiveClass()
    allEle.classList.add("active")
    renderTodoList(todos)
    setTodosToLocal()
}
allEle.addEventListener("click", function(){
    renderAllTodos()
})
const renderInProGressTodos = () => {
    const inProGressTodos = todos.filter(val => !val.isDone)
    removeActiveClass()
    inprogressEle.classList.add("active")
    renderTodoList(inProGressTodos)
}
inprogressEle.addEventListener("click", function(){
    renderInProGressTodos()
})
const renderCompletedTodos = () => {
    const completedTodos = todos.filter(val => val.isDone)
    removeActiveClass()
    completedEle.classList.add("active")
    renderTodoList(completedTodos)
}
completedEle.addEventListener("click", function(){
    renderCompletedTodos()
})
btnClearEle.addEventListener("click", function(){
    todos.length = 0
    renderTodoList(todos)
})
document.addEventListener("click", function(e){
    const dotEle = e.target.closest(".dots")
    if(!dotEle){
        const dropdownEle = document.querySelectorAll(".dropdown")
        dropdownEle.forEach(val =>{
            val.style.display = "none"
        })
    }
    if(dotEle){
        const dropdownEle = dotEle.children[3]
        dropdownEle.style.display = "block"
    }
})

