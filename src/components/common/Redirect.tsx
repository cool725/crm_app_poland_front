import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectProps {
  to: string;
}

const Redirect: React.FC<RedirectProps> = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(props.to);
  }, []);

  return <div />;
};

export default Redirect;
