import React from 'react';
import PropTypes from 'prop-types';
import _Paper from '@material-ui/core/Paper';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MySkills from './MySkills';
import MyRatings from './MyRatings';
import MyAnalytics from './MyAnalytics';
import styled from 'styled-components';

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1rem 1rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

const Heading = styled.h1`
  color: black;
  width: 100%;
  min-width: 40rem;
  padding: 1rem 0;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SubHeading = styled.h1`
  color: rgba(0, 0, 0, 0.65);
  padding-left: 1.25rem;
`;

const Container = styled.div`
  margin: 0rem 0.625rem;
  padding: 1.25rem 1.875rem 1.875rem;

  @media (max-width: 480px) {
    padding: 1.25rem 1rem 1.875rem;
  }
`;

const trytheme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

const Dashboard = props => {
  document.title = 'SUSI.AI - Dashboard';
  const { showTitle = true } = props;
  return (
    <ThemeProvider theme={trytheme}>
      <Container>
        {showTitle && <Heading>My Dashboard</Heading>}
        <Paper>
          <SubHeading>My Skills</SubHeading>
          <MySkills />
        </Paper>
        <Paper>
          <SubHeading>My Ratings</SubHeading>
          <MyRatings />
        </Paper>
        <Paper>
          <SubHeading>My Analytics</SubHeading>
          <MyAnalytics />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

Dashboard.propTypes = {
  showTitle: PropTypes.bool,
};

export default Dashboard;
