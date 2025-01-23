import NavBar from "../../components/NavBar";
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
    <main>
      <NavBar {...props} />
      <Outlet />
    </main>
  );
};

export default Layout;
