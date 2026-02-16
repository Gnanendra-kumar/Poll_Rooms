import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import axios from "axios";
import "../App.css";


export default function Login({ onLogin }) {
  return (<div className="Googles">
    <GoogleLogin
      onSuccess={async credentialResponse => {
        const res = await axios.post(
          "https://poll-rooms-jyx9.onrender.com/api/auth/google",
          { token: credentialResponse.credential }
        );

        localStorage.setItem("token", res.data.jwtToken);
        onLogin();
      }}
    />
    </div>
  );
}
