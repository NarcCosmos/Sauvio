const SQLite = require('expo-sqlite'); // Expo SQLITE import

const db = SQLite.openDatabase("incidents.db");

// Initializing the database
const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT, publicationDate DATE, location TEXT, url TEXT);"
    );
  });
};

// Saving an incident
const saveIncident = (title, category, publicationDate, location, url) => {
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO incidents (title, category, publicationDate, location, url) VALUES (?, ?, ?, ?, ?);",
      [title, category, publicationDate, location, url],
      (_, result) => {
        console.log("Incident saved:", result);
      },
      (_, error) => {
        console.error("Error saving incident:", error);
        return false;
      }
    );
  });
};

// Loading all incidents
const loadIncidents = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM incidents;",
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          console.error("Error loading incidents:", error);
          reject(error);
        }
      );
    });
  });
};

// Search function
const searchFunction = ({ title, category, publicationDate, location }) => {
  let query = "SELECT * FROM incidents WHERE 1=1";
  let params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (publicationDate) {
    query += " AND publicationDate = ?";
    params.push(publicationDate);
  }

  if (location) {
    query += " AND location = ?";
    params.push(location);
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Loading a single incident by ID
const loadIncidentById = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM incidents WHERE id = ?;",
      [id],
      (_, { rows }) => {
        callback(rows._array[0]);
      },
      (_, error) => {
        console.error("Error loading incident by ID:", error);
        return false;
      }
    );
  });
};

// Loading an incident by title
const loadIncidentByTitle = (title, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM incidents WHERE title LIKE ?;",
      [`%${title}%`],
      (_, { rows }) => {
        console.log("Search Results:", rows._array);
        callback(rows._array);
      },
      (error) => {
        console.log("Error executing query.", error);
      }
    );
  });
};

// Reset database
const resetDatabase = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM incidents;",
      [],
      (_, result) => {
        console.log("Database cleared:", result);
        if (callback) callback();
      },
      (_, error) => {
        console.error("Error clearing database:", error);
        return false;
      }
    );
  });
};

// Get record count
const getRecordNum = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT COUNT(*) AS num_records FROM incidents;",
      [],
      (_, { rows }) => {
        console.log("Found", rows._array[0].num_records, "entries.");
        if (callback) callback(rows._array[0].num_records);
      },
      (_, error) => {
        console.log("Error fetching count:", error);
      }
    );
  });
};

// Call initDatabase when the script is loaded
initDatabase();

// Export functions
module.exports = {
  saveIncident,
  loadIncidents,
  loadIncidentById,
  loadIncidentByTitle,
  resetDatabase,
  searchFunction,
  getRecordNum
};

