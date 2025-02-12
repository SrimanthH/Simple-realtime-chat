const socket =io()

const clientstotal =document.getElementById('clients-total')
const messageCOntainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendMessage(    )
})

socket.on('clients-total',(data)=> {
    console.log(data)
    clientstotal.innerText= `Total Clients: ${data} `
})

function sendMessage(){
    if(messageInput.value === '') return
    console.log(messageInput.value)
    const data={
        name: nameInput.value,
        message:messageInput.value,
        dateTime:new Date()
    }
    socket.emit('message', data)
    addMessagetoUI(true,data)
    messageInput.value=''
}

socket.on('chat-message', (data)=> {
    console.log(data)
    addMessagetoUI(false,data)
})

function addMessagetoUI(isOwnMessage, data){
    clearfeedback()
    const element =`
    <li class="${isOwnMessage ? "message-right":"message-left"}">
                <p class="message">
                    ${data.message}
                    <span>
                        ${data.name} ${moment(data.dateTime).fromNow()}
                    </span>
                </p>
            </li>`

    messageCOntainer.innerHTML += element
    scrollTobottom()
}

function scrollTobottom(){
    messageCOntainer.scrollTo(0, messageCOntainer.scrollHeight)
}

messageInput.addEventListener('focus',(e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`
    })
})
messageInput.addEventListener('keypress',(e)=> {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`
    })
    
})
messageInput.addEventListener('blurr',(e)=> {
    socket.emit('feedback', {
        feedback: ``
    })
    
})

socket.on('feedback', (data)=>{
    clearfeedback()
    const element =` <li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`
    messageCOntainer.innerHTML += element

})

function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element)
    })
}