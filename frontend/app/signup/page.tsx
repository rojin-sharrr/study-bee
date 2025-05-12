'use client';

//Create a login page, feel free to use components from shadcn

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "lucide-react";
import { useState } from 'react';
import axios, {isCancel, isAxiosError} from "axios";
import { useRouter } from 'next/navigation';

export default function signupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async () => {
    try {
      setError('');
      const response = await axios.post('http://localhost:8000/api/users/register', { 
        name,
        username,
        email, 
        password 
      });
      
      if (response.data.success) {
        router.push('/');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during signup.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}
          <Input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
           <Input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={submitHandler}>Signup</Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            Already have an account?
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href="/login">Login</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


