import { Fragment } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
//Components
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
//Styles
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Age Predictor</title>
        <meta name="description" content="Welcome to the Age predictor." />
      </Helmet>
      <div className={styles.home}>
        <Header />
        <main>
          <p>
            The age predictor uses the{" "}
            <a href={"https://agify.io/"} target={"_blank"}>
              agify.io API
            </a>{" "}
            to predict the age of a person given their name.
          </p>
          <Link to={"/predictor"}>
            <button>Let´s give it a try!</button>
          </Link>
        </main>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Home;
