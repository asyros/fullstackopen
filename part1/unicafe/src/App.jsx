import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const feedbackGiven = good > 0 || neutral > 0 || bad > 0;

  return (
    <div>
      <h2>give feedback</h2>
      <Button setState={setGood} state={good} feedbackType="good" />
      <Button setState={setNeutral} state={neutral} feedbackType="neutral" />
      <Button setState={setBad} state={bad} feedbackType="bad" />
      <h2>statistics</h2>
      {feedbackGiven ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        <p>No feedback given</p>
      )}
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = (good - bad) / total;
  const positiveFeedbackPercentage = (good / total) * 100;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={total > 0 ? average : 0} />
        <StatisticLine
          text="positive"
          value={total > 0 ? positiveFeedbackPercentage + "%" : 0}
        />
      </tbody>
    </table>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Button = ({ setState, state, feedbackType }) => {
  return <button onClick={() => setState(state + 1)}>{feedbackType}</button>;
};

export default App;
