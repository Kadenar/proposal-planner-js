// Component
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
  },
  bullet: {
    height: "100%",
    marginRight: 5,
  },
});

const ListItem = ({ index, text }: { index: number; text: string }) => {
  return (
    <View style={styles.row}>
      <View style={styles.bullet}>
        <Text>{`${index}. `}</Text>
      </View>
      <Text>{text}</Text>
    </View>
  );
};

export default ListItem;
