import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./ui/loader";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store=>store.auth);
    if (user) navigate('/')
    const [inputs, setInputs] = useState({
        usernameoremail: "",
        password: "",
    })
    const handleChange = (event) => {
        setInputs({...inputs,[event.target.name]:event.target.value})
    }
    const [loading, setLoading] = useState(false);
    const LoginUser = async (event) => {
        event.preventDefault();
        console.log(inputs);
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/v1/user/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.user)
                dispatch(setAuthUser(data.user));
                toast.success(data.message);
                setInputs({
                    usernameoremail: "",
                    password: "",
                });
                navigate("/"); 
            }
            else {
                toast.error(data.message);
            }
        }catch(error){
            console.error(error);
            toast.error(error.message || "Something went wrong");
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="fade-in flex p-0 gap-10 items-center w-screen h-screen justify-center">
            <form onSubmit={LoginUser} className="shadow-[0_30px_30px_rgba(0,0,0,0.2)] p-8 flex gap-5">
                <div className="flex items-center">
                
                </div>
                <div className="flex flex-col gap-7">
                    <Label className="text-4xl text-white font-bold">Sign In</Label>
                    <Input className="text-white focus-visible:ring-transparent" type="text" name="usernameoremail" placeholder="Username/Email" value={inputs.usernameoremail} onChange={handleChange} />
                    <Input className="text-white focus-visible:ring-transparent" type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} />
                    <Button type="submit" className="bg-blue-500 text-white h-10 px-4 py-2 rounded-lg shadow-md transition-transform duration-150 active:scale-95 active:shadow-sm">
                        {loading? <Loader /> : "Sign In"}
                    </Button>
                    <p className="text-xl text-white">Don't have any account ? <Link className="text-blue-500" to="/signup">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
}

export default SignIn;