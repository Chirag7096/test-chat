import React from "react";
import { ScrollView } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ChatList = ({ data, onPress }) => {
  return (
    <SafeAreaView style={styles.main}>
      <ScrollView>
        {data?.map((e) => (
          <TouchableOpacity
            key={e?.id}
            style={styles.card}
            onPress={() => onPress(e?.chanel_id)}
          >
            <Image
              source={{
                uri:
                  e?.img ||
                  "https://images.unsplash.com/photo-1431440869543-efaf3388c585",
              }}
              style={styles.img}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{e.name || e.id}</Text>
              {/* <Text>{e.lastMessage.message}</Text> */}
            </View>
            {/* {e.lastMessage.seen && <Text style={styles.dot}>.</Text>} */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  card: {
    height: 100,
    width: "90%",
    marginTop: 20,
    borderWidth: 1,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginHorizontal: 20,
  },
  dot: {
    fontSize: 50,
    color: "green",
    marginRight: 20,
  },
  name: {
    fontSize: 24,
  },
});
