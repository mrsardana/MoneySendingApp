import React from 'react'
import { useState } from 'react'
import { BottomWarning } from '../components/BottomWarning'
import { Button } from '../components/Button'
import { Heading } from '../components/Heading'
import { InputBox } from '../components/InputBox'
import { SubHeading } from '../components/SubHeading'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export const Signup = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    return (
        <div className='bg-slate-300 h-screen flex justify-center'>
            <div className='flex flex-col justify-center'>
                <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create your account"} />
                    <InputBox placeholder={"John"} label={"First Name"}
                        onChange={e => {
                            setFirstName(e.target.value)
                        }} />
                    <InputBox placeholder={"Doe"} label={"Last Name"}
                        onChange={e => {
                            setLastName(e.target.value)
                        }} />
                    <InputBox placeholder={"email@domain.com"} label={"Email"}
                        onChange={e => {
                            setUserName(e.target.value)
                        }} />
                    <InputBox placeholder={"******"} label={"Password"}
                        onChange={e => {
                            setPassword(e.target.value)
                        }} />
                    <div className='pt-4'>
                        <Button onClick={async () => {
                            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                                "userName": userName,
                                "firstName": firstName,
                                "lastName": lastName,
                                "password": password
                            })
                            localStorage.setItem("token", response.data.token)
                            navigate("/dashboard")

                        }}
                            label={"Sign Up"}></Button>
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    )
}
