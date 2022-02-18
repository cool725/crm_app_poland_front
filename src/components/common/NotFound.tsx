import { Link } from "react-router-dom";
import CustomScrollbar from "../common/CustomScrollbar";

export default function NotFound() {
  return (
    <CustomScrollbar>
      <div
        className="w-full max-w-screen h-screen bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url(images/login-background.png)" }}
      >
        <div className="max-w-87.5 w-full min-h-screen mx-auto flex flex-col h-full py-16">
          <div className="flex-grow flex flex-col items-center w-full">
            <Link to="/">
              <img
                alt="Logo"
                className="h-44 mb-3"
                src="images/logo-clvr1.png"
              />
            </Link>

            <h3 className="text-base text-white mb-28">ADMIN MODE</h3>

            <div className="whitespace-nowrap text-8xl text-white mb-5">
              Page not found
            </div>
          </div>

          <div className="flex-none text-center text-white mt-10">
            © 2022 «CLVR»
          </div>
        </div>
      </div>
    </CustomScrollbar>
  );
}
