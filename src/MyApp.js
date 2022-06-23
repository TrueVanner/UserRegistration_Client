import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddingForm from './AddingForm';
import ViewingForm from './ViewingForm';


function MyApp() {
	const [value, setValue] = React.useState("1");

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
      	<TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(event, newValue) => setValue(newValue)}>
            <Tab label="Add" value="1"/>
            <Tab label="Show" value="2"/>
          </TabList>
        </Box>
        <TabPanel value="1"><AddingForm/></TabPanel>
        <TabPanel value="2"><ViewingForm/></TabPanel>
      </TabContext>
    </Box>
	);
}

export default MyApp;