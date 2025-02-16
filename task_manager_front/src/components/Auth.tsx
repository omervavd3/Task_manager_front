import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (
      localStorage.getItem("access_token") == null ||
      !localStorage.getItem("access_token")
    ) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3000/auth/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if(response.data) {

        } else if(response.status != 200 || response.data.status != 200){
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, []);

  return <div></div>;
};

export default Auth;
