import "./userProfile.css";
import React, { useState, useEffect } from "react";
import Events from "../../components/Event/event";
import Navbar from "../../components/Navbar/Navbar";
import Profile from "../../components/Profile/profile";
import History from "../../components/History/History";
import Swal from "sweetalert2";

const Sidebar = () => {
  const [currentComponent, setCurrentComponent] = useState(<Profile />);
  const [currentHeading, setCurrentHeading] = useState("Profile");
  const [user, setUser] = useState(null);
  const [ticketData, setTicketData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Profile fetch failed");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);

        setUser(null);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/viewevents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Events fetch failed");
        }

        const data = await response.json();

        setEventData(data.events);
      } catch (error) {
        console.error("Events fetch error:", error);
      }
    };
    fetchEvents();
  }, [token]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      try {
        const response = await fetch("http://localhost:3000/users/viewtickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Tickets fetch failed");
        }

        const data = await response.json();
        setTicketData(data.tickets);
        console.log(data);
      } catch (error) {
        console.error("Tickets fetch error:", error);
      }
    };

    if (user) {
      fetchTickets();
    }
  }, [token, user]);

  useEffect(() => {
    if (user) {
      setCurrentComponent(<Profile user={user} token={token} />);
    }
  }, [user, token]);

  const handleButtonClick = (heading, component) => {
    setCurrentComponent(component);
    setCurrentHeading(heading);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/home";
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="sidebar-menu">
          <button className="sidebar-items" onClick={() => handleButtonClick("Profile", <Profile user={user} token={token} />)}>
            <i className="fas fa-user"></i> Profile
          </button>
          <button
            className="sidebar-items"
            onClick={() =>
              handleButtonClick(
                "My Events",
                eventData.map((eventData, index) => <Events key={index} type="event" info={eventData} />)
              )
            }
          >
            <i className="fas fa-calendar-alt"></i> Events
          </button>
          <button
            className="sidebar-items"
            onClick={() =>
              handleButtonClick(
                "My Tickets",
                ticketData.map((ticketData, index) => <Events key={index} type="ticket" info={ticketData.eventId} />)
              )
            }
          >
            <i className="fas fa-ticket-alt"></i> Tickets
          </button>
          <button className="sidebar-items" onClick={() => handleButtonClick("History", <History token={token} />)}>
            <i className="fas fa-history"></i> History
          </button>

          <hr className="sidebar-divider" />
          <div className="sidebar-footer">
            <button className="sidebar-items logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
      <div className="component-container">
        <h2>{currentHeading}</h2>
        {currentComponent}
      </div>
    </div>
  );
};

const UserProfile = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
    </>
  );
};

export default UserProfile;
