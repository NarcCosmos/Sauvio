import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
const { loadIncidents, saveIncident } = require('../../scripts/dataStorage');

export default function IncidentSearchMenu() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await loadIncidents(); // Fetch incidents from DB
      setIncidents(data);
      console.log("Incidents loaded.");
    } catch (error) {
      console.error("Failed to load incidents:", error);
    }
    setLoading(false);
  };

  const listIncident = ({ item: incident }) => (
    <View style={lst.item}>
      <Text style={lst.itemText}>{incident.title}</Text>
      <Text>{incident.location}, on ({incident.publicationDate})</Text>
    </View>
  );

  return (
    <View style={lst.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Incident Search</Text>
      </View>

      <View style={lst.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : incidents.length === 0 ? (
          <Text style={lst.emptyText}>No incidents found</Text>
        ) : (
          <FlatList
            data={incidents}
            keyExtractor={(incident) => incident.id.toString()}
            renderItem={listIncident}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const lst = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  item: { padding: 15, marginVertical: 5, backgroundColor: "#f9c2ff", borderRadius: 5 },
  itemText: { fontSize: 18, fontWeight: "bold" },
  emptyText: { textAlign: "center", fontSize: 18, color: "gray", marginTop: 20 },
});