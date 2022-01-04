import React from 'react';
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Questions from './Questions';
import './style.scss';

class Risks extends React.Component {

  render() {
    const { match: { path }, risks } = this.props;
    return (
      <div className="segments-page">
        <Switch>
          <Route exact path={path}>
            <Questions questions={risks && risks.questions}/>
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { 
    app: { profile: { risk: { risks } } }
    } = state;

  return {
    risks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return{}
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Risks));
