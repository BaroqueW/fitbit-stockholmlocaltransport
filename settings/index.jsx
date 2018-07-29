
//Currently the API lookup is not hooked in, so the storage of stations is not to be used

function mySettings(props) {

	
  return (
    <Page>
      <Section
        title={<Text bold align="center">Stockholm Local Transport</Text>}>
        <Text>Trips from the first destination to the second one before time; reversed afterwards. Resets at midnight. Format for time is HH (24 hour format, with trailing 0).</Text>
        <AdditiveList
          title="Select your favorite stations"
          settingsKey="favorite_station_setting"
          maxItems="2"
         addAction={
            <TextInput
              title="Add a SL Station"
              label="Name"
              placeholder="Type something"
              action="Add Station"
            />
          } 
        />
          <TextInput
    label="Time"
    settingsKey="cutOff_setting"
  />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
