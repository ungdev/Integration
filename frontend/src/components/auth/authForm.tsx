import { useState } from "react";
import Image from "next/image";
import { Card } from "../../styles/components/ui/card";  // Assure-toi que l'importation fonctionne bien
import { Input } from "../../styles/components/ui/input"; // Idem
import { Button } from "../../styles/components/ui/button"; // Idem
import { handleCASTicket, loginUser, registerUser } from "src/services/auth/auth.service";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);  // Toggle pour Login/Signup
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try{
        const token = await loginUser(formData.email, formData.password);
        if(token){
            localStorage.setItem("authToken", token);
            window.location.href = "/Home";
        }
      }
      catch (err: any) {
        console.log(err);
      }
      // Logique de connexion ici
      console.log("Login with", formData);
    };
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const msg = await registerUser(formData.firstName, formData.lastName, formData.email, formData.password);
        console.log(msg);
      } catch (err: any) {
        console.log(err);
      }
      console.log("Register with", formData);
    };

    const handleCASLogin = async() =>{

        const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || "default";
        const CAS_LOGIN_URL =  process.env.REACT_APP_CAS_LOGIN_URL || "default";
    
        const loginUrl = `${CAS_LOGIN_URL}?service=${encodeURIComponent(SERVICE_URL)}`;
        window.location.href = loginUrl;

        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get("ticket");
        if(ticket){
          const {token} = await handleCASTicket(ticket);
          console.log(token)
          localStorage.setItem("authToken", token);
          console.log("redirect /Home")
          window.location.href = "/Home";
        }
    
      }
  
    return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('img/background.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
  
        <div className="z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center">{isLogin ? "Login" : "Sign Up"}</h2>
  
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-6"
          >
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {isLogin ? "Login" : "Register"}
              </Button>
              <Button
                type="button"
                className="w-full py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                onClick={() => setIsLogin(prev => !prev)}
              >
                {isLogin ? "New here? Sign Up" : "Already have an account? Log In"}
              </Button>
              <Button
                type="button"
                className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-gray-400 transition"
                onClick={() => handleCASLogin()}
              >
                {"Etudiants UTT"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }