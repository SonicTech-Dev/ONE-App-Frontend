import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useColors from '../../hooks/useColors';

const Tile = ({ title, location, status, color, isOn, iconName, Icon }) => {

    const colors = useColors()

return(
  <View style={[styles.tileContainer(colors)]}>
    <View style={styles.iconContainer}>
     {iconName?(
     <Ionicons name={iconName} size={80} color={colors.primary} />
    ):(
    Icon
    )}
    </View>
    <View style={styles.content}>
      <Text style={styles.title(colors)}>{title}</Text>
    </View>
  </View>
)};

export default Tile;

const styles = StyleSheet.create({
  tileContainer: (colors)=> ({
    flex: 1,
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    borderWidth:1,
    borderColor:colors.primary
  }),
  iconContainer: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: (colors)=> ({
    fontSize: 16,
    fontFamily: 'Arial',
    color: colors.primary,
  }),
  location: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  status: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});
