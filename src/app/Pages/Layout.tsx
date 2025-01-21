import NavBar from "../../../Components/NavBar";
import { Outlet } from "react-router-dom";
import { FC } from "react";

interface LayoutProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <>
      <NavBar {...props} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
