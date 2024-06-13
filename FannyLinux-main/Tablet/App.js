import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import Caja from './VistasTablet/Caja';
import Cola from './VistasTablet/Cola';
import Encargos from './VistasTablet/Encargos';


export default function App() {
  const [selectedTab, setSelectedTab] = useState('caja');

  const renderScreen = () => {
    switch (selectedTab) {
      case 'caja':
        return <Caja />;
      case 'cola':
        return <Cola />;
      case 'encargos':
        return <Encargos />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('caja')} style={[styles.tabButton, selectedTab === 'caja' && styles.selectedTab]}>
          <Text>Caja</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('cola')} style={[styles.tabButton, selectedTab === 'cola' && styles.selectedTab]}>
          <Text>Cola</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('encargos')} style={[styles.tabButton, selectedTab === 'encargos' && styles.selectedTab]}>
          <Text>Encargos</Text>
        </TouchableOpacity>
      </View>
      {renderScreen()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ccc',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedTab: {
    backgroundColor: '#fff',
  },
});


