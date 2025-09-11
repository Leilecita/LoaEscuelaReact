import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@core';

// ----------------------
// MonthHeader
// ----------------------
type MonthHeaderProps = {
 date: string | Date;
};

export const MonthHeader: React.FC<MonthHeaderProps> = ({ date }) => {
 const dateObj = typeof date === "string" ? new Date(date) : date;
 const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

 const month = capitalize(dateObj.toLocaleDateString("es-AR", { month: "long" }));
 const year = dateObj.toLocaleDateString("es-AR", { year: "numeric" });

 return (
   <View style={styles.container}>
     <Text style={styles.text}>
       {month} {year}
     </Text>
   </View>
 );
};


const styles = StyleSheet.create({
 container: {
   backgroundColor: COLORS.headerDate,
   alignSelf: 'flex-start',
   paddingHorizontal: 10,
   paddingVertical: 4,
   borderRadius: 8,
   marginTop: 4,
   marginBottom: 6,
 },
 text: {
   fontFamily: 'OpenSans-Regular',
   fontSize: 16,
  // color: COLORS.darkLetter2,
   color: COLORS.whiteLetter,
 },
 monthText: {
  fontFamily: 'OpenSans-Light', 
   //color: COLORS.buttonClearLetter,
   color: COLORS.whiteLetter,
 },
});