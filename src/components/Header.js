import { Link } from "react-router-dom";

export function Header() {
  return (
    <header>
      <Link to={"/"}>
        <h1>Age predictor</h1>
      </Link>
    </header>
  );
}
