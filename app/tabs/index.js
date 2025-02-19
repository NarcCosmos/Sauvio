//React imports.
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from "react-redux";
import { useState } from "react";

//Client-side and database management.
import socket from '../../scripts/socketService';
import { saveIncident } from '../../scripts/dataStorage';

//Constants for icons. Will implement later, perhaps for tab icons.
const homeIcon = require('../../assets/images/home-icon.png');
const settingsIcon = require('../../assets/images/settings-icon.png');
const backIcon = require('../../assets/images/back-icon.png');
const closeIcon = require('../../assets/images/close-icon.png');
const searchIcon = require('../../assets/images/search-icon.png');

//Default/Main menu.
export function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      // Listen for data response from the server.
      socket.on("dataResponse", (receivedData) => {
        setLoading(false);

        if (receivedData.error) {
          console.error("Error:", receivedData.error);
        } else {
          setData(receivedData);

          // Incident database fills up.
          receivedData.forEach((incident) => {
            saveIncident(
              incident.title,
              incident.category,
              incident.publicationDate,
              incident.location
            );
          });

          console.log("Data saved to local database.");
        }
      });

      return () => {
        socket.off("dataSent"); // Disconnects from the server.
      };
    }, []);

    const getData = () => {
        setLoading(true);
        socket.emit("getData",  {}); // Example: Get all incidents
      };

  return (
    <View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to Sauvio!</Text>
        <View style={styles.container}>
              <Image source={require('../../assets/images/map-demo.png')} style={styles.image} />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Button title={loading ? "Loading..." : "Refresh Data"} onPress={getData} />
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, width: "100%" }}>
                <Text>
                  [{item.category}] {item.title} {"\n"}
                  Published on {item.publicationDate}
                </Text>
              </View>
            )}
          />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 475,
    height: 586,
    resizeMode: 'contain',
  },
});

export default App; //Display the default screen already!