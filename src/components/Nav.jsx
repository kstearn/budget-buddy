import { Link } from "react-router";

const Nav = () => {
    return (
        <nav>
            <header>
                <h1>Budget Buddy</h1>
            </header>
            <ul>
                <li><Link to="/">Overview</Link></li>
                <li><Link to="/budget">Budget</Link></li>
                <li><Link to="/spending">Spending</Link></li>
            </ul>
        </nav>
    );
}

export default Nav;
