const users:any[]=[]
export const addUser=({id,username,room}:{id:string,username:string,room:string}):any=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if (!username || !room)
        return{
            error:'username and room are required'
        }
    const userExists:boolean=users.find((user:any)=>user.room==room && user.username==username)
    if (userExists) return {error:'username is in use'}
    const userToAdd={id,username,room}
    users.push(userToAdd)
    return {user:userToAdd}
}
export const removeUser=(id:string)=>{
    const index=users.findIndex((user)=>user.id==id)
    if (index!=-1){
        const removedUser=users[index]
        users.splice(index,1)
        return removedUser
        }
    
}  
export const getUser=(id:string)=>users.find(user=>user.id==id)
export const getUsersInRoom=(room:string)=>users.filter(user=>user.room==room)