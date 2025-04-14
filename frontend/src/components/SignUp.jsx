import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./ui/loader";

const SignUp = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    })
    const handleChange = (event) => {
        setInputs({...inputs,[event.target.name]:event.target.value})
    }
    const [loading, setLoading] = useState(false);
    const CreateUser = async (event) => {
        event.preventDefault();
        console.log(inputs);
        try {
            setLoading(true);
            const response = await fetch("https://notinsta-gr7b.onrender.com/api/v1/user/register", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setInputs({
                    username: "",
                    email: "",
                    password: "",
                });
                navigate("/login");
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
        <div className="flex p-0 gap-10 items-center w-screen h-screen justify-center">
            <form onSubmit={CreateUser} className="shadow-[0_30px_30px_rgba(0,0,0,0.2)] p-8 flex gap-5">
                <div className="flex items-center">
                
                </div>
                <div className="fade-in flex flex-col gap-7">
                    <Label className="text-4xl text-white font-bold">Sign Up</Label>
                    <Input className="text-white focus-visible:ring-transparent" type="text" name="username" placeholder="Username" value={inputs.username} onChange={handleChange} />
                    <Input className="text-white focus-visible:ring-transparent" type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} />
                    <Input className="text-white focus-visible:ring-transparent" type="password" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} />
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-transform duration-150 active:scale-95 active:shadow-sm">
                        {loading? <Loader className="mb-5" /> : "Sign Up"}
                    </Button>
                    <p className="text-xl text-white">Already have an account ? <Link className="text-blue-500" to="/login">Sign In</Link></p>
                </div>
            </form>
        </div>
    );
}

export default SignUp;