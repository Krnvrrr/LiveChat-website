// import Messages from './Messages';
import "./App.css";
// import User from './User';
import { useState } from "react";
function App(props) {
  let x=0;
  let [message, setmessage] = useState("");
  let [messages,setmessages]=useState([['left','Welcome to the server']]);
  let [users,setusers]=useState([" "])
  // console.log(props.people)
  const onclick = (e) => {
    e.preventDefault();
    props.socket.emit("send", message);
    setmessages(messages.concat([['right',`you: ${message}`]]));
    setmessage("");
  };
  props.socket.on('user-joined',(data)=>{
    setmessages(messages.concat([['left',`user ${data.name} joined the chat server`]]));
    setusers(data.userNames)
  })
  props.socket.on('users',(data)=>{
    setusers(data);
   })
  props.socket.on('leave',(data)=>{
    setmessages(messages.concat([['left',`user ${data.name} left the chat server`]]));
    setusers(data.userNames)
  })
  props.socket.on("recived", (data) => {
    setmessages(messages.concat([['left',`${data.name}: ${data.message}`]]));
  });
  const onchange = (e) => {
    setmessage(e.target.value);
  };
  return (
    <>
      <div
        className="card"
        style={{ marginBottom: "5px", fontStyle: "italic" }}
      >
        <div className="card-body" style={{ textAlign: "center" }}>
          <h2>Happy chatting with the People who joins the server :-)</h2>
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="container user">
          <ul className="list-group">
            <li
              className="list-group-item "
              style={{
                borderRadius: "0px",
                backgroundColor: "lightgreen",
                color: "black",
              }}
            >
              All users that have joined the server are listed below
            </li>
            {users.map((element)=>{
              return(
                <li className="list-group-item ">{element}</li>
              )
            })}
          </ul>
        </div>
        <div className="container offset">
          <div className="container block">
            {messages&&messages.map((element)=>{
              x++;
              return(
                <div className={`message ${element[0]}`} key={x}> {element[1]}</div>
              )
            })}
          </div>
          <div className="container send">
            <form>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  style={{ border: "2px solid black" }}
                  placeholder="type a message"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                  name="input"
                  value={message}
                  onChange={onchange}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  id="button-addon2"
                  htmlFor="input"
                  onClick={onclick}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
