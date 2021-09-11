import { Fragment, useState, useEffect, useRef } from "react";
import Helmet from "react-helmet";
import _ from "lodash";
import axios from "axios";
import { gsap } from "gsap";
//Components
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Spinner } from "../components/Spinner";
//Styles
import styles from "../styles/Predictor.module.css";
//Utils
import { countryISOCodes } from "../isoCodes";

const Predictor = () => {
  //State
  const [results, setResults] = useState([]);
  const [namesQuery, setNamesQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countryChosen, setCountryChosen] = useState("No country chosen");
  //
  useEffect(() => {
    setQuery(namesQuery + countryQuery);
  }, [namesQuery, countryQuery]);
  //Render results
  const resultsRender = () => {
    if (results) {
      return _.map(results, ({ name, age, count }) => {
        return (
          <tr>
            <td>{_.capitalize(name)}</td>
            <td>{age}</td>
            <td>{count ? count.toLocaleString() : ""}</td>
          </tr>
        );
      });
    }
  };
  //Render country options
  const selectOptionsRender = () => {
    return countryISOCodes.map(({ code, name }) => {
      return <option value={code}>{name}</option>;
    });
  };
  //Submit results
  const submitResults = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.agify.io/" + query,
      });
      console.log("Result", response.data);
      let newResults;
      if (_.isArray(response.data)) {
        newResults = response.data;
      } else {
        newResults = [response.data];
      }
      setResults(newResults);
      setIsLoading(false);
      setTimeout(() => setIsSuccess(true), 500);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };
  //On change names handler
  const onInputNamesHandler = (e) => {
    if (/,/.test(e.target.value)) {
      const namesArray = _.split(e.target.value, ",");
      let newNamesQuery = "?";
      _.forEach(
        namesArray,
        (name, index) =>
          (newNamesQuery += `name[]=${_.trim(name)}${
            namesArray.length - 1 !== index ? "&" : ""
          }`)
      );
      setNamesQuery(newNamesQuery);
    } else {
      setNamesQuery(`?name=${_.trim(e.target.value)}`);
    }
  };
  // On change Country handler
  const onInputCountryHandler = (e) => {
    if (e.target.value) {
      setCountryQuery(`&country_id=${e.target.value}`);
      setCountryChosen(_.find(countryISOCodes, ["code", e.target.value]).name);
    }
  };
  // Transitions
  const formRef = useRef();
  const loadingRef = useRef();
  const resultsRef = useRef();
  useEffect(() => {
    if (isLoading) {
      gsap
        .timeline()
        .to(formRef.current, { opacity: 0, display: "none" })
        .fromTo(
          loadingRef.current,
          { opacity: 0 },
          { opacity: 1, display: "flex" },
          ">"
        );
    }
    if (!isLoading && isSuccess) {
      gsap
        .timeline()
        .to(loadingRef.current, { opacity: 0, display: "none" })
        .fromTo(
          resultsRef.current,
          { opacity: 0 },
          { opacity: 1, display: "flex" },
          ">"
        );
    }
  }, [isLoading, isSuccess]);
  //
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Age Predictor</title>
        <meta name="description" content="This is the age predictor app." />
      </Helmet>
      <div className={styles.predictor}>
        <Header />
        <main>
          <p>
            Fill out the following form, and then click on{" "}
            <span>Calculate</span> to predict the age!
          </p>
          <div className={styles.card}>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                submitResults();
              }}
            >
              <div>
                <label htmlFor="names">
                  Name <span>(s)</span>
                </label>
                <p>* Write a name or multiple names separated by a comma.</p>
                <input
                  type={"text"}
                  id={"names"}
                  required={true}
                  onChange={(e) => onInputNamesHandler(e)}
                />
              </div>
              <div>
                <label htmlFor={"localization"}>
                  Localization <span>(optional)</span>
                </label>
                <p>
                  * Responses will in a lot of cases be more accurate if the
                  data is narrowed to a specific country.
                </p>
                <select
                  id={"localization"}
                  onChange={(e) => onInputCountryHandler(e)}
                >
                  <option value={""} disabled={true} selected={true}>
                    Select a country
                  </option>
                  {selectOptionsRender()}
                </select>
              </div>
              <button>Calculate</button>
            </form>
            <div className={styles.results} ref={resultsRef}>
              <p>Prediction results</p>
              <p>
                Country chosen: <span>{countryChosen}</span>
              </p>
              <table>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Count</th>
                </tr>
                {resultsRender()}
              </table>
              <button onClick={() => window.location.reload()}>
                Make new prediction
              </button>
            </div>
            <div className={styles.loading} ref={loadingRef}>
              <Spinner />
              <p>Fetching results</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Predictor;
