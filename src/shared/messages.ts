export const generateMessage=(text:string)=>{
    return{
        text,
        createdAt:new Date().getTime()}
}
export const generateLocationMessage=(url:string)=>{
    return {
        url,
        createdAt:new Date().getTime()
    }
}