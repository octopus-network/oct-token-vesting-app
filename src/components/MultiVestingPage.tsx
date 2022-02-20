import React from 'react';

import {
  GridItem,
  Grid,
  Box,
  useMediaQuery
} from '@chakra-ui/react';

import Overview from 'components/Overview';
import Panel from 'components/MultiVestingPanel';
import Chart from 'components/Chart';

type MultiVestingPageProps = {
  multiVestingContract: any;
}

export const MultiVestingPage: React.FC<MultiVestingPageProps> = ({ multiVestingContract }) => {
  const [isDesktop] = useMediaQuery('(min-width: 62em)');
  return (
    <Grid templateColumns={isDesktop ? 'repeat(9, 1fr)' : 'repeat(3, 1fr)'} gap="16">
      {
        isDesktop &&
        <GridItem colSpan={6}>
          <Overview />
          <Box mt="12" />
          <Chart />
        </GridItem>
      }
      <GridItem colSpan={3}>
        <Panel contract={multiVestingContract} />
      </GridItem>
    </Grid>
  );
}