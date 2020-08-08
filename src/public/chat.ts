
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
socket.on('message', ({text:messageReceived,createdAt:timeStamp}:{text:string,createdAt:number}) => {
    const html = Mustache.render(messageTemplate, {
        message: messageReceived,
        //@ts-ignore
        createdAt:moment(timeStamp).format('h:mm A')
    })
    $messages?.insertAdjacentHTML('beforeend', html)
})
socket.on('locationUrl', ({url,createdAt:timeStamp}:{url:string,createdAt:number}) => {
    const html = Mustache.render(locationMessageTemplate, {
        //@ts-ignore
        createdAt:moment(timeStamp).format('h:mm A'),
        url
    })
    $messages?.insertAdjacentHTML('beforeend', html)
})
socket.on('notification', (notification:string) => {
    console.log(notification)
})