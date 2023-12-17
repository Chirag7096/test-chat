import React, { useEffect, useState } from "react";
import { NativeBaseProvider } from "native-base";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
} from "react-native";
import { io } from "socket.io-client";
import { ScrollView } from "react-native";
import ChatList from "./chatList";
import {
  getDeviceNameSync,
  getDeviceToken,
  getFingerprint,
  getFreeDiskStorage,
  getFreeDiskStorageSync,
} from "react-native-device-info";

const socket = io("http://192.168.29.9:3000", { autoConnect: false });

const userId = String(getFreeDiskStorageSync()).includes(1855) ? 1 : 6;

console.log("🚀 ~ file: App.js:26 ~ userId:", userId);

const ModalComponent = ({ id, close }) => {
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    socket.on("new_message_receive", (data) =>
      setChatData((e) => [...e, data])
    );
    socket.on("chanel_message_receive", ({ data }) => setChatData(data));
    socket.emit("chanel_message", id);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Text
        onPress={close}
        style={{
          right: 10,
          fontSize: 20,
          color: "white",
          fontWeight: "900",
          position: "absolute",
          backgroundColor: "black",
        }}
      >
        X
      </Text>
      <Text style={{ textAlign: "center", fontSize: 20, color: "white" }}>
        {"CHAT"}
      </Text>
      <ScrollView>
        {chatData?.map((e, i) => (
          <View
            key={"chat" + i}
            style={{
              width: 380,
              alignItems: e?.sender_id == userId ? "flex-end" : "flex-start",
            }}
          >
            <Text
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: "gray",
                borderRadius: 20,
                color: "white",
              }}
            >
              {e?.message || ""}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <TextInput
          style={{
            width: "75%",
            height: 40,
            borderWidth: 1,
            borderColor: "gray",
          }}
          onChangeText={(e) => setInput(e)}
          value={input}
        />
        <Button
          title="send"
          onPress={() => {
            socket.emit("new_message", {
              message: input,
              sender_id: userId,
              chanel_id: id,
            });
            setInput("");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

function App() {
  const [data, setData] = useState([]);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on("chanel_list_receive", ({ data }) => setData(data));
    socket.emit("chanel_list", userId);
    return () => socket.connected && socket.disconnect();
  }, []);

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.main}>
        <ChatList data={data} onPress={setChat} />
        <Modal visible={!!chat}>
          <ModalComponent id={chat} close={() => setChat("")} />
        </Modal>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
