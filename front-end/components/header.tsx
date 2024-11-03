import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
      </nav>
    </header>
  );
};

export default Header;
