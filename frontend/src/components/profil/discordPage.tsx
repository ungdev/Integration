import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { syncDiscordUser } from "../../services/requests/user.service";

export const DiscordCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      const authToken = localStorage.getItem("authToken");

      if (!code || !authToken) {
        return navigate("/profil?linked=error");
      }

      const res = await syncDiscordUser(code);

      if (res.ok) {
        navigate("/profil?linked=success");
      } else {
        navigate("/profil?linked=error");
      }
    };

    run();
  }, []);

  return <div>Connexion à Discord...</div>;
};
