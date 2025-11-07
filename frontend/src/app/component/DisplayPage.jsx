"use client";

import { useEffect, useState } from "react";

export default function DisplayPage(){
    const [ data, setData] = useState([])

    const fetchUser = async() =>{
        try{
            const res = await fetch("http://127.0.0.1:8000/categories/")

            if (res.ok){
                const dataUser = await res.json()
                console.log(dataUser)
                setData(dataUser)
            }else{
                console.log(res.statusText)
            }
        }catch{
            console.log("Unable to connect")
        }
    }
    useEffect(()=>{
        fetchUser();
    },[])
    return(
        <div>
            <ul>
                {data.map((user)=>(
                    <li key={user.id}>{user.student_name}</li>
                ))}
            </ul>
        </div>
    )
}