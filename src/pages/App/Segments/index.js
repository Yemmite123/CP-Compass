import React from 'react';
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Questions from './Questions';
import './style.scss';

class Segments extends React.Component {

  render() {
    const { match: { path }, segments } = this.props;

    return (
      <div className="segments-page">
        <Switch>
          <Route exact path={path}>
            <Questions questions={segments && segments.questions} />
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { 
    app: { profile: { segment: { segments } } }
    } = state;

  return {
    segments,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Segments));
