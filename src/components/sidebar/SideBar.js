import React, { Component } from "react";
import FAChevronDown from "react-icons/lib/md/keyboard-arrow-down";
import FAMenu from "react-icons/lib/fa/list-ul";
import FASearch from "react-icons/lib/fa/search";
import MdEject from "react-icons/lib/md/eject";
import { SideBarOption } from "./SideBarOption";
import { get, last, differenceBy } from "lodash";
import { createChatNameFromUsers } from "../../Factories";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reciever: ""
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    const { reciever } = this.state;
    const { onSendPrivateMessage } = this.props;
    console.log(reciever);

    onSendPrivateMessage(reciever);
    this.setState({ reciever: "" });
  };

  addChatForUser = username => {
    this.props.onSendPrivateMessage(username);
  };
  render() {
    const {
      chats,
      activeChat,
      user,
      setActiveChat,
      logout,
      users
    } = this.props;
    const { reciever } = this.state;
    return (
      <div id="side-bar">
        <div className="heading">
          <div className="app-name">
            Our Cool Chat <FAChevronDown />
          </div>
          <div className="menu">
            <FAMenu />
          </div>
        </div>
        <form onSubmit={this.handleSubmit} className="search">
          <i className="search-icon">
            <FASearch />
          </i>
          <input
            placeholder="Search"
            type="text"
            value={reciever}
            onChange={e => {
              this.setState({ reciever: e.target.value });
            }}
          />
          <div className="plus"></div>
        </form>
        {/* <div className="side-bar-select">
          <div
            onClick={() => {
              this.setActiveSideBar(SideBar.type.CHATS);
            }}
            className={`sidebar-select__option`}
          >
            <span>Chats</span>
          </div>
          <div
            onClick={() => {
              this.setActiveSideBar(SideBar.type.CHATS);
            }}
            className={`sidebar-select__option`}
          >
            <span>Users</span>
          </div>
        </div> */}
        <div
          className="users"
          ref="users"
          value={reciever}
          onClick={e => {
            e.target === this.refs.user && setActiveChat(null);
          }}
        >
          {chats.map(chat => {
            if (chat.name) {
              return (
                <SideBarOption
                  key={chat.id}
                  name={
                    chat.isCommunity
                      ? chat.name
                      : createChatNameFromUsers(chat.users, user.name)
                  }
                  lastMessage={get(last(chat.messages), "message", "")}
                  active={activeChat.id === chat.id}
                  onClick={() => {
                    this.props.setActiveChat(chat);
                  }}
                />
              );
            }

            return null;
          })}
          {differenceBy(users, [user], "name").map(otherUser => {
            return (
              <SideBarOption
                key={otherUser.id}
                name={otherUser.name}
                onClick={() => {
                  this.addChatForUser(otherUser.name);
                }}
              />
            );
          })}
        </div>
        <div className="current-user">
          <span>{user.name}</span>
          <div
            onClick={() => {
              logout();
            }}
            title="Logout"
            className="logout"
          >
            <MdEject />
          </div>
        </div>
      </div>
    );
  }
}
