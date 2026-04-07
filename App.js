import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from '@expo/vector-icons/Fontisto';

const STORAGE_KEY = "@toDos";
const WORKING_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadWorking();
    loadToDos();
  },[]);
  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(WORKING_KEY, "false");
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(WORKING_KEY, "true");
  };
  const loadWorking = async () => {
    try {
      const value = await AsyncStorage.getItem(WORKING_KEY);
      if (value !== null) {
        setWorking(value === "true");
      }
    } catch(e) {}
  };
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    try{
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }catch(e){

    }
  };
  const loadToDos = async() => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s))
    }catch(e){

    }
  };

  const addToDo = async () => {
    if(text === "")
    {
      return;
    }
    const newToDos ={
      ...toDos,
      [Date.now()]:{text, working, done: false}
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const toggleDone = async (key) => {
    const newToDos = {
      ...toDos,
      [key]: {...toDos[key], done: !toDos[key].done}
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
  };
  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do?",
      "Are you sure?",[
      {text: "Cancel"},
      {
        text: "I'm Sure", 
        onPress: () =>{
          const newToDos ={...toDos}
          delete newToDos[key]
          setToDos(newToDos);
          saveToDos(newToDos);
        }
      },
    ]);
    return;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white": theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white": theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput 
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do":"Where do you want go?"} 
          style={styles.input}>
        </TextInput>
        <ScrollView>
          {Object.keys(toDos).map((key) => 
          toDos[key].working === working ?
          (
            <View style={styles.toDo} key={key}>
              <Text style={toDos[key].done ? styles.toDoTextDone : styles.toDoText}>
                {toDos[key].text}
              </Text>
              <View style={styles.toDoActions}>
                <TouchableOpacity onPress={() => toggleDone(key)}>
                  <Fontisto
                    name={toDos[key].done ? "checkbox-active" : "checkbox-passive"}
                    size={18}
                    color={toDos[key].done ? theme.grey : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
          )}
        </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: "space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText:{
    fontSize: 44,
    fontWeight: "600",
  },
  input:{
    backgroundColor:"white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:20,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  toDoText:{
    color: "white",
    fontSize: 16,
    fontWeight:"500",
  },
  toDoTextDone:{
    color: theme.grey,
    fontSize: 16,
    fontWeight:"500",
    textDecorationLine: "line-through",
  },
  toDoActions:{
    flexDirection: "row",
    gap: 10,
  },
});
