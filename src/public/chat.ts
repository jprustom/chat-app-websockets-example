
declare var io:any, Mustache:any
const socket = io()

//FORMS
const $messageForm:HTMLFormElement|null = document.querySelector('#message-form')
const $messageFormInput:HTMLInputElement|undefined|null=$messageForm?.querySelector('input')
const $messageFormButton:HTMLButtonElement|null|undefined =$messageForm?.querySelector('button')
const $sendLocationButton:HTMLButtonElement|null = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')
//TEMPLATES
const messageTemplate = document.querySelector('#message-template')?.innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template')?.innerHTML
const sideBarTemplate=document.querySelector('#sidebar-template')?.innerHTML
//Options
//@ts-ignore
const{username,room}:{username:string,room:string}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    //get last message
    const $lastMessage:any=$messages?.lastElementChild
    //get height of last message
    //@ts-ignore
    const lastMessageStyles=getComputedStyle($lastMessage)
    const lastMessageBottomMargin=parseInt(lastMessageStyles.marginBottom)
    const lastMessageHeight=$lastMessage?.offsetHeight+lastMessageBottomMargin
    //messages visible height
    //@ts-ignore
    const messagesVisibleHeight=$messages?.offsetHeight
    //messages container height
    const messagesContainerHeight=$messages?.scrollHeight
    //how far have I scrolled?
    const scrollOffset=$messages?.scrollTop+messagesVisibleHeight
    //@ts-ignore
    if (messagesContainerHeight-lastMessageHeight<=scrollOffset){
        //@ts-ignore
        $messages?.scrollTop=messagesContainerHeight
    }
}

//EVENT LISTENERS
$messageForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton?.setAttribute('disabled', 'disabled')
    console.log($messageFormInput?.value)
    const messageToSend = $messageFormInput?.value
    socket.emit('sendMessage', (messageToSend), ((error:any) => {
        $messageFormButton?.removeAttribute('disabled')
        //@ts-ignore
        $messageFormInput.value=''
        $messageFormInput?.focus()
        if (error) return console.log(error)
    }))//

})

$sendLocationButton?.addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit(
            'sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            () => { $sendLocationButton.removeAttribute('disabled') })
    })
})

socket.on('welcomeMessage', (welcomeMessageToDisplay:string) => {
    console.log(welcomeMessageToDisplay)
})
socket.on('message', ({username,text:messageReceived,createdAt:timeStamp}:{username:string,text:string,createdAt:number}) => {
    const html = Mustache.render(messageTemplate, {
        message: messageReceived,
        //@ts-ignore
        createdAt:moment(timeStamp).format('h:mm A'),
        username
    })
    $messages?.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('locationUrl', ({username,url,createdAt:timeStamp}:{username:string,url:string,createdAt:number}) => {
    const html = Mustache.render(locationMessageTemplate, {
        //@ts-ignore
        createdAt:moment(timeStamp).format('h:mm A'),
        url,
        username
    })
    $messages?.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.emit('join',{username,room},(error: any)=>{
    if (!error) return
    alert(error)
    location.href='/'
}) 
socket.on('roomData',({room,users}:{room:string,users:any[]})=>{
    const html=Mustache.render(sideBarTemplate,{
        room,
        users
    })
    //@ts-ignore
    document.querySelector('#sidebar')?.innerHTML=html
})   